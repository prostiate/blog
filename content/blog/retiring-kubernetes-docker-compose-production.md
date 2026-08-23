---
title: "Retiring Kubernetes: Why We Moved 6 Production Services Back to Docker Compose"
description: "How measured storage evidence on baremetal SAS drives revealed 10-15 MB/s I/O bottlenecks - and why senior engineering means un-adopting tech when hardware says no."
date: "2026-06-15"
readTime: "8 min read"
tags: ["DevOps", "Architecture", "Docker", "Kubernetes"]
featured: true
---

## The Architectural Pivot

In early 2026, our infrastructure team agreed to explore a Kubernetes migration. The goal was standard across growing organizations: eliminate single-node vulnerability, achieve automated GitOps rollouts with Argo CD, and unify our deployment topology across 6 production retail services.

We designed and built a complete K3s cluster with Argo Rollouts, automated staging promotion, and Prometheus monitoring. On paper, it was textbook modern infrastructure.

Yet, after rigorous load testing and production sub-domain dry runs, **we deliberately retired Kubernetes** and moved our entire estate back to health-gated Docker Compose with Jenkins.

This article shares the hardware-level data, the I/O metrics, and why senior engineering is about making decisions based on physics rather than industry hype.

---

## The Hardware Constraint: The Hidden SAS HDD Bottleneck

Our on-premise infrastructure consisted of baremetal enterprise servers running dual virtual machines per box. What was not immediately obvious from high-level CPU and RAM metrics was the underlying disk architecture:

- **Shared Magnetic SAS Disks**: The 2 VMs shared a single physical SAS HDD without dedicated enterprise NVMe caching.
- **Measured Disk Throughput**: Under sequential benchmarks, the disk achieved ~65 MB/s. However, during concurrent random reads and container image layer extractions, throughput plummeted to **10 - 15 MB/s**.
- **Queue Depth Saturation**: In Kubernetes, when 4 to 6 pods deploy simultaneously across a node, `containerd` extracts image layers in parallel. On shared magnetic media, disk queue depth spiked to 35+, causing disk I/O wait latency to exceed 180ms.

::callout{type="warning"}
**The Production Symptom:** Under parallel rollout pressure, database query responses on the co-located VM stalled. Kubernetes liveness probes timed out on healthy containers simply because the disk could not read health-check binaries in time, triggering cascade pod restarts.
::

---

## Interactive Topology Visualization

Below is an interactive view of our distributed service nodes. In a containerized topology, network traffic and disk synchronization require continuous, non-blocking I/O flow.

<TopologyCanvas />

---

## Interactive Benchmark: Simulating the Disk Bottleneck

Adjust the slider below to simulate how concurrent container image pulls degrade disk latency on shared magnetic storage vs sequential health-gated deployment:

<BenchmarkSimulator />

---

## The Decision: Rebuilding Guarantees Without the Overhead

Rather than requesting high-budget SAN/NVMe hardware replacements for internal retail backoffices, we asked a foundational question:

> *"What guarantees do we actually need that Kubernetes provides, and can we achieve them with lower disk friction?"*

The core requirements were:
- **Zero-downtime deployments**
- **Automated rollback on failure**
- **Non-blocking health checks**
- **Reproducible declarative configs**

We rebuilt these guarantees on top of **Docker Compose + Jenkins**:

```bash
# Staggered health-gated deploy step in Jenkinsfile
docker compose pull --parallel
docker compose up -d --no-deps --build fe-amazone-inventory
./scripts/health-check.sh http://localhost:3000/api/health || {
  echo "Health check failed. Initiating instant rollback to previous container tag..."
  docker compose rollback
  exit 1
}
```

### Key Architectural Results:
1. **Sequential Layer Caching**: Deployments extract sequentially, keeping disk queue depths below 3.
2. **Zero False-Positive Probe Restarts**: Disk wait latency dropped from 180ms to under 14ms during rollouts.
3. **Team Autonomy**: Backend engineers can deploy independently with simple, transparent bash runbooks without needing K8s cluster administration expertise.

---

## Conclusion

Senior software engineering is not about adopting the most complex tool in the landscape; it is about respecting system constraints and having the humility to un-adopt technology when the hardware data clearly indicates a simpler, more robust path.
