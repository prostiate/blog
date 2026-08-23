---
title: Baremetal CI/CD & Platform Modernization
category: DevOps / Platform
description: Health-gated rolling deployment pipeline on Docker Compose + Jenkins
  after disciplined K3s storage benchmarking.
featured: false
order: 6
liveUrl: null
githubUrl: null
tags:
  - Docker Compose
  - Jenkins
  - K3s
  - Argo CD
  - Prometheus
  - Grafana
problemSolved: Staging K3s/ArgoCD platform suffered frequent false-positive liveness
  probe failures due to shared baremetal SAS HDD I/O saturation (10-15 MB/s).
architecture:
  - Load-tested and benchmarked baremetal VM disk queues, proving storage hardware could
    not sustain concurrent container image pulls.
  - Architected a senior technical decision to cleanly retire K3s in favor of health-gated
    multi-node Docker Compose deployments.
  - Built automated Jenkins staging-to-production pipelines empowering backend teammates
    to trigger zero-downtime rolling deploys.
---

## Overview

Following the deployment of a staging Kubernetes (K3s + Argo CD) cluster on on-premise baremetal virtualization infrastructure, the platform experienced frequent deployment stalls and false-positive probe failures.

Rather than blaming Kubernetes or ignoring the symptoms, rigorous disk queue benchmarking revealed that the underlying SAS HDD storage subsystem was saturating during concurrent layer pulls. This led to an engineering decision to retire K3s and build equivalent automated rolling deployment guarantees using **Docker Compose, Jenkins, and Nginx**.

---

## Engineering Investigation & Resolution

### 1. Root Cause Storage Analysis

- Measured disk queue depth and I/O wait times under load using `fio` and Prometheus storage exporters.
- Discovered that concurrent K3s image pulls on multi-node VMs easily consumed 100% of the shared SAS HDD array throughput (10-15 MB/s), causing health probes to time out and triggering cascade pod restarts.

### 2. Health-Gated Rolling Deployments

- Designed a blue-green / rolling deployment harness in Jenkins and Bash for Docker Compose.
- Deploys new container versions side-by-side on isolated ports, verifies HTTP `/healthz` endpoints before swapping upstream Nginx reverse-proxy routes, and tears down deprecated containers only after verification.

### 3. Teammate Empowerment

- Automated staging-to-production promotion pipelines in Jenkins, enabling backend developers to deploy updates safely with zero downtime without needing complex Kubernetes manifests.

---

## Takeaways

- **Measure First**: Real-world hardware limits dictate software architecture, not industry trends.
- **Operational Simplicity**: Replaced a complex 20-component K8s stack with a transparent, observable Docker Compose pipeline that has operated with 100% uptime.
