---
title: Baremetal CI/CD & Platform Modernization
category: DevOps / Platform
description: Health-gated rolling deployment pipeline on Docker Compose + Jenkins
  after disciplined K3s storage benchmarking.
featured: false
order: 8
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

Health-gated rolling deployment pipeline on Docker Compose.
