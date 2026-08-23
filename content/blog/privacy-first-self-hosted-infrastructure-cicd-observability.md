---
title: "Self-Hosting the Delivery Loop on a Tight Resource Budget"
description: "How I joined builds, a private registry, secret delivery, object storage, logs, metrics, and cautious multi-node releases without turning a small platform into a second full-time product."
date: "2026-08-03"
readTime: "9 min read"
tags: ["DevOps","Observability","CI/CD","Self-Hosting"]
status: "PUBLISHED"
featured: true
---

Self-hosting is sometimes presented as a purity test: run everything yourself, reject every managed service, and call the result independence. That framing misses the real work.

The difficult question is not whether a service can run on your machines. It is whether you can patch it, back it up, observe it, recover it, and explain its failure mode while still delivering the applications it supports.

I chose to self-host the parts of the delivery loop where privacy, control, and recurring cost mattered most: continuous integration, the image registry, secret delivery, object storage, logs, metrics, and dashboards. Hardware was limited, so efficiency was not an optimization pass. It was an architectural constraint.

This post describes the resulting loop and, just as importantly, the limits I put around it.

## The loop, not the shopping list

The platform made more sense as a flow than as a list of products:

```text
commit
  -> build and test
  -> create immutable image
  -> scan and push image
  -> fetch environment secrets at job time
  -> pre-pull image on eligible nodes
  -> replace one workload at a time
  -> verify container, host, and edge health
  -> collect logs and metrics
  -> retain enough evidence to debug or roll back
```

I used Jenkins for orchestration, Harbor for the private image registry and scanning, Infisical for secret delivery, MinIO for S3-compatible object storage, and Grafana, Loki, Prometheus, and Alloy for observability. Those names explain the implementation, but the contracts between them matter more than the individual tools.

The CI system was allowed to ask the secret manager for deployment-time values. It was not allowed to print them. Application nodes were allowed to pull signed-in registry artifacts. They were not allowed to build production images. Log collectors were allowed to send selected operational output to the central log store. They were not allowed to scrape arbitrary files from the host.

The first efficiency gain came from reducing responsibilities, not tuning memory.

## Build once, identify exactly what was built

Every release produced an immutable image tag tied to a commit and pipeline run. A moving `latest` tag might exist for convenience, but deployment did not rely on it as the only identity.

A simplified pipeline shape looks like this:

```groovy
stage('Verify') {
  sh 'run-format-check'
  sh 'run-linter'
  sh 'run-tests'
  sh 'run-build'
}

stage('Package') {
  sh 'build-image --tag registry.example.test/team/app:${GIT_COMMIT}'
}

stage('Scan and Push') {
  sh 'scan-image registry.example.test/team/app:${GIT_COMMIT}'
  sh 'push-image registry.example.test/team/app:${GIT_COMMIT}'
}
```

These are examples, not copied pipeline commands. The principle is that the artifact passing the checks is the artifact entering the registry. Rebuilding on an application node would create a second, unverified artifact and make rollback ambiguous.

Registry scanning was a gate with an explicit policy, not a decorative report. Blocking every finding immediately would have frozen delivery because base images often contain findings with no available fix. Ignoring all findings would have made scanning theatre. The practical policy considered severity, exploitability, whether a fixed version existed, and whether the vulnerable package was present in the runtime stage.

## Secrets should arrive late and leave early

The old pattern for small deployments is a long-lived `.env` file copied to a server. It is easy, persistent, and difficult to audit.

I moved secret retrieval into the deployment job. A machine identity received narrowly scoped access to one environment and one application path. The job fetched values just before deployment and passed them to the process that needed them.

The design rules were:

- staging credentials cannot read production values;
- one application cannot enumerate another application's secrets;
- human credentials are not embedded in pipeline configuration;
- secrets are masked in command output;
- temporary files, if unavoidable, have restrictive permissions and are removed in a guaranteed cleanup step;
- rotation can happen without editing source control.

A conceptual shell shape is:

```bash
set -eu
umask 077

secret-cli run \
  --environment production \
  --path /example-app/backend \
  -- deploy-example-command
```

The names are intentionally generic. The point is that the child process receives the environment while the job avoids a durable plaintext copy.

Privacy-first did not mean “no data leaves a process.” Logs and metrics still moved across the private network. It meant collection had a declared purpose, a narrow route, and a retention period.

## Multi-node deployment starts with eligibility

The production release script did not begin by stopping containers. It began by asking which nodes were safe to touch.

For each configured node, it checked:

1. is the node reachable?
2. is the currently deployed service healthy?
3. is there enough disk space for the new image?
4. can the node authenticate to the registry?
5. can it pre-pull the exact image?

Only eligible nodes entered the cutover set. If none were eligible, the job failed before changing the running service.

The pre-pull step was important on slow storage. Downloading and extracting an image while the old process still served traffic moved most of the variable work ahead of cutover.

```text
configured nodes
      |
      v
preflight checks ---- failed nodes -> skip and report
      |
      v
pre-pull image ------ failed pulls -> remove from eligible set
      |
      v
replace workload one node at a time
      |
      v
container health -> host health -> edge health
```

“Zero downtime” is too absolute for this arrangement. The honest claim is narrower: releases are sequenced so that a healthy replica remains available while another node changes, provided the edge and at least one replica remain healthy.

## Health checks at three boundaries

A container reporting `healthy` does not prove that users can reach it. I checked three boundaries.

**Inside the runtime:** Is the process listening and ready?

**At the host:** Does the published host port reach the process?

**Through the edge:** Does TLS, host routing, and proxying reach a healthy replica?

Generic checks look like:

```bash
runtime-health example-app
curl --fail http://127.0.0.1:51000/healthz
curl --fail https://portal.example.test/healthz
```

The deployment accepted a node only after all checks relevant to that node passed. A partial production result was visible: if two nodes succeeded and one failed, the job reported degraded capacity instead of converting a recoverable node problem into a total outage.

Rollback also used an immutable image reference. It did not assume that reverting a Git commit would restore database state. Schema compatibility, object-storage changes, and one-way migrations remained separate release concerns.

## Logs: collect less, label better

Centralized logging can quietly become centralized sensitive data. I started with container standard output and a small label set: environment, application, node role, and severity.

I explicitly filtered or avoided:

- authorization headers and cookies;
- request bodies by default;
- passwords, tokens, and connection strings;
- personal data that was not needed to diagnose an operational failure;
- high-cardinality labels such as user IDs or request URLs with identifiers.

High-cardinality labels hurt both privacy and performance. A field can remain inside a log line for occasional search without becoming an index label.

Alloy collected and forwarded logs. Loki stored them. Grafana queried them. Retention was kept short enough for the storage budget and long enough to cover the usual delay between an incident and an investigation. Long-term audit evidence, where required, belonged to an explicitly designed audit stream rather than the general application log bucket.

The useful logging question was not “Can I search everything?” It was “What is the minimum evidence needed to explain a failed request or release?”

## Metrics: watch pressure before exhaustion

On small machines, saturation is often gradual. Memory pressure causes swapping; a registry disk fills with old layers; log ingestion grows; a CI workspace accumulates caches.

I watched a compact set of signals:

- available memory and swap activity;
- filesystem usage and inode usage;
- container restarts;
- CPU load and I/O wait;
- registry and object-store capacity;
- request error rate and latency;
- deployment duration and failure stage;
- log ingestion volume.

Alerts were tied to an action. A disk warning linked to a dry-run cleanup procedure. A failed health check linked to commands that tested the runtime, host, and edge separately. An alert without a first response became noise quickly.

Prometheus collected numeric time series. Grafana displayed a few role-based dashboards rather than one enormous wall. The tooling-node dashboard emphasized disk, registry, CI queue, and object storage. Application-node dashboards emphasized request health, restarts, and resource pressure. The staging dashboard made its co-located services visible because contention there could invalidate a release rehearsal.

## Storage needs different safety rules

Registry caches, CI workspaces, object-storage data, and application-node images all consume disk, but they do not share a deletion policy.

For disposable caches, automation could remove old unreferenced data after a dry run. For a private registry, retention depended on rollback requirements. For object storage, deletion was a data-lifecycle decision and never an emergency cache command.

When moving object-storage data to a larger filesystem, I used a preservation-first sequence:

1. copy while the service is online to reduce the maintenance window;
2. stop writes;
3. run a final metadata-preserving synchronization;
4. point the service at the new location;
5. start and check readiness;
6. verify object counts and representative reads;
7. rename the old directory as a temporary rollback copy;
8. delete it only after an agreed observation period.

That sequence costs temporary disk space. It buys a recoverable mistake.

## What self-hosting changed

The result was not a miniature hyperscale platform. It was a controlled delivery loop whose data stayed on infrastructure we administered.

It reduced dependence on external dashboards and credential stores. It also made patching, backups, retention, and capacity our responsibility. The resource budget forced useful discipline: fewer labels, shorter retention, immutable artifacts, role-specific dashboards, and explicit cleanup.

The biggest improvement was not a tool. It was the ability to trace one release from commit to image, from image to node, and from node to health evidence without exposing credentials or guessing which artifact was running.

Self-hosting was worthwhile because the boundaries were written down. Without those boundaries, the same stack would simply have been more software to worry about.