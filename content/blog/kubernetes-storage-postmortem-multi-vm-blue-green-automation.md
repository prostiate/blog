---
title: "The Kubernetes Deployment That Taught Me to Measure the Disk"
description: "The Kubernetes experiment did not fail because Kubernetes was broken. The cluster scheduled workloads, pulled images, ran startup probes, and held a blue green promotion gate…"
date: "2026-07-25"
readTime: "10 min read"
tags: ["DevOps", "Kubernetes", "Post-Mortem", "Storage"]
status: "PUBLISHED"
featured: true
---

The Kubernetes experiment did not fail because Kubernetes was broken.

The cluster scheduled workloads, pulled images, ran startup probes, and held a blue-green promotion gate exactly as configured. Production stayed available during the incident that triggered the investigation.

The experiment failed a fit test. The operational cost and storage behavior of the cluster did not match the hardware or the size of the team operating it.

That distinction matters. “Kubernetes is too heavy” would be an easy story and a poor post-mortem. The useful story starts with a slow release, follows the evidence down to shared spinning disks, and ends with a decision to keep the ideas that worked while retiring the control plane.

## What happened

A frontend release reached the preview stage of a blue-green rollout. Two preview pods landed on different workers.

One worker already had the image layers. Its pod started normally. The other worker had to download and extract the image. It took much longer, and the application then needed additional time to read modules from its container filesystem. Startup probes timed out several times before the process became ready.

The rollout controller did not promote an unready preview. The failure threshold was generous enough that the pod was not killed. Eventually both preview pods became healthy and the release reached the manual promotion gate.

No user-facing outage occurred.

The two pods came from the same build, carried the same image tag, and were scheduled in the same second. They differed in one thing:

|                              | Cold worker                    | Warm worker |
| ---------------------------- | ------------------------------ | ----------- |
| Image already in local store | no                             | yes         |
| Image pull                   | 52 s                           | 8 s         |
| Data moved                   | 150.5 MiB at ~3 MB/s effective | none        |
| Startup probe failures       | 4 consecutive, about 20 s      | none        |
| Final state                  | healthy                        | healthy     |

Total pipeline time to the promotion gate was about 4 minutes 46 seconds - and that was a fully cached build. Nothing was compiled that had not already been compiled. The time went into moving 150 MiB onto a worker that had not seen it.

Method: both rows come from the same rollout. Pull durations are the container runtime's own pull events for the two preview pods; the probe counts are the rollout controller's event stream for the same window. Same image, same minute, one variable.

The first mistake would have been to increase the probe delay and declare victory. The probe was reporting a symptom. I wanted to know why one node differed so sharply from another.

## Separate download time from extraction and startup

An image pull is not one operation.

```text
registry request
  -> download compressed layers
  -> verify content
  -> read compressed layer data
  -> decompress
  -> write snapshot files
  -> mount container filesystem
  -> start runtime
  -> read application files
  -> become ready
```

A fast network does not guarantee a fast pull. Extracting many small files can be dominated by random I/O and metadata operations. A JavaScript server then reads a large module tree during startup, adding more work on the same filesystem.

The slower node had a cold cache. The faster node had seen the image before. Re-running the deployment made the problem appear smaller because both nodes became warm. That is why warm reruns are weak evidence for deployment performance.

I compared runtime events, image presence, pull timing, startup timing, and probe events. The divergence began before the application accepted traffic.

## Map virtual disks to physical disks

Inside each VM, the disk looked independent. At the physical layer, some worker VMs shared one spinning SAS disk.

That fact changed the interpretation of every benchmark. Two sequential workloads in two VMs were not independent sequential workloads to the disk head. Their combined access could become a seek-heavy pattern as the hypervisor served both virtual disks.

The simplified layout was:

```text
physical host A
  one spinning disk
    -> worker VM 1 virtual disk
    -> worker VM 2 virtual disk

physical host B
  one spinning disk
    -> worker VM 3 virtual disk
    -> worker VM 4 virtual disk

physical host C
  several spinning disks
    -> worker VM 5 virtual disk
```

This was the point where the boundary of my responsibility mattered. I administered the guest OS and workloads, not the hypervisor. I could measure from the VMs, correlate with the physical layout supplied by the infrastructure owner, and change workload placement. I could not turn the underlying disks into SSDs through configuration.

## Benchmarking without benchmarking the page cache

An early read test produced numbers that were too good to explain the rollout. The file was being served partly from memory.

The corrected test used a temporary file, direct I/O, and a deliberate page-cache drop:

```bash
dd if=/dev/zero of=/tmp/io-test.bin bs=1M count=512 oflag=direct
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
dd if=/tmp/io-test.bin of=/dev/null bs=1M iflag=direct
rm -f /tmp/io-test.bin
```

These commands are examples and are intrusive. Dropping page cache affects other workloads on the VM and should not be done casually on a busy production system.

I also ran tests concurrently on sibling VMs. A single quiet-node benchmark cannot reveal contention between virtual disks sharing one spindle.

This is the measurement the whole investigation turns on. A worker sharing one physical spindle with a second VM that was issuing large sequential reads at the same time read at **13.0 MB/s**. A worker that was the only VM on its spindle read at **161 MB/s**. Same class of disk, same benchmark, same afternoon. The difference was the neighbour.

One worker measured 15, then 91, then 192 MB/s across three runs of the same test. Part of that spread is page cache - only the first run reliably reached the disk - and part is variable contention from the VM beside it. I could not cleanly separate the two contributions, and the spread is itself the finding: a disk whose sequential read throughput moves by more than an order of magnitude between runs is not a disk you can plan a release pipeline around.

One early result stayed marked uncertain, because an interactive privilege prompt delayed the cache-drop step and the number may be partly cache-assisted. I did not remove it and I did not promote it. That uncertainty stayed in the record. Post-mortems become dangerous when rough observations are promoted into universal performance facts.

## What the probes were saying

The startup probe waited 45 seconds before its first attempt, then retried every 5 seconds with a 5-second timeout. On the cold worker, the combined image extraction and application initialization exceeded that comfortable window, and four attempts in a row timed out - about 20 seconds of failures. The warm worker recorded none.

The probe failures were real timeouts but not an outage. The generous failure threshold prevented a restart loop, and the blue-green controller prevented promotion.

This yielded two different actions:

- a short-term probe adjustment could reduce noisy events;
- a storage and deployment change was needed to address the variable startup time.

Increasing the delay alone would make the dashboard quieter while releases remained slow and unpredictable.

## Why the orchestration layer amplified the hardware mismatch

The scheduler could place a new pod on any eligible worker. That flexibility is usually useful. On this hardware it meant a release could unexpectedly pay a cold-pull and extraction cost on a contended spindle.

The cluster also added several operational systems:

- GitOps reconciliation;
- rollout controllers;
- overlays and image-tag automation;
- cluster credentials and role-based access;
- control-plane and worker maintenance;
- container-runtime image garbage collection;
- environment placement rules.

All of those can be justified at the right scale. Here, they sat above a small set of applications and a small team. The system offered capabilities the hardware could not exercise predictably and the team did not need often enough to justify the maintenance.

The decision was not “containers are bad” or “GitOps is bad.” Container images, immutable tags, health probes, declarative configuration, and blue-green thinking all survived the change.

## The replacement: explicit multi-VM automation

The replacement deployment targeted a known set of application VMs.

```text
build once
  -> push immutable image
  -> probe current nodes
  -> pre-pull image while old release serves traffic
  -> remove nodes whose pre-pull failed
  -> update eligible nodes one at a time
  -> check runtime health
  -> check host-port health
  -> check edge route
  -> report healthy and degraded nodes
```

A generic preflight sketch:

```bash
eligible_nodes=()

for node in "${configured_nodes[@]}"; do
  if probe_current_release "$node" && check_free_space "$node"; then
    eligible_nodes+=("$node")
  fi
done

if [ "${#eligible_nodes[@]}" -eq 0 ]; then
  echo "No eligible deployment nodes" >&2
  exit 1
fi
```

This is illustrative code, not a copy of the actual scripts.

Fixed targets reduced scheduling flexibility, but they made cache behavior and failure handling easier to reason about. Pre-pulling moved download and extraction before cutover. Sequential replacement kept a healthy replica serving while another node changed.

The scripts still needed careful design. They could not make a single edge highly available, repair a failed database, or roll back a destructive schema migration. Their advantage was that their behavior fit on one page and matched the platform actually available.

## What I retained from Kubernetes

The experiment produced useful assets and habits:

- immutable image promotion;
- a private registry;
- explicit readiness endpoints;
- environment-specific declarative configuration;
- blue-green preview and promotion concepts;
- resource requests and capacity thinking;
- a record of placement and storage assumptions.

I archived the cluster configuration and investigation notes instead of deleting the history. If the platform later gains dedicated SSD or NVMe-backed storage, a larger workload count, and enough operational capacity, the decision can be revisited from evidence rather than memory.

The revisit checklist includes:

- dedicated fast storage for worker virtual disks;
- cold-pull and extraction benchmarks under concurrency;
- separate staging and production failure boundaries;
- tested image garbage collection;
- startup probes based on measured cold starts;
- a clear reason the scheduler, reconciliation, and rollout machinery are needed.

## Lessons

**Measure below the abstraction.** Container events pointed to image and startup delay. VM benchmarks pointed to disk. The physical map explained why apparently separate workers interfered.

**Test the cold path.** A warm image cache can make a second deployment look fixed.

**Keep uncertainty in the report.** One questionable benchmark was labeled questionable. The decision did not depend on pretending every number was perfect.

**Distinguish protection from performance.** The rollout protected production correctly even though the release was slow.

**Choose operational complexity for the system you have.** A simpler deployment can be more reliable when its constraints are visible and its operators understand every step.

The most valuable outcome was not retiring Kubernetes. It was learning to stop debugging the application at the layer where the symptom appeared.

The slow pod was not asking for a more patient probe. It was asking me to measure the disk.
