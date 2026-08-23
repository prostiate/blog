---
title: Baremetal Platform Modernization
category: DevOps / Platform
description: A measured K3s and GitOps pilot followed by health-gated, multi-node
  Docker Compose rollouts suited to the available storage hardware.
featured: false
order: 6
liveUrl: null
githubUrl: null
tags:
  - Docker Compose
  - Jenkins
  - K3s
  - Argo CD
  - Argo Rollouts
  - Harbor
problemSolved: Load testing showed that the available shared storage could not support
  the intended Kubernetes application platform reliably.
architecture:
  - Piloted K3s, Argo CD, Argo Rollouts, Harbor, Infisical, and an observability stack.
  - Measured 10-15 MB/s during concurrent image pulls from a single SAS HDD shared
    between two VMs per server.
  - Retired Kubernetes for application workloads on 3 June 2026.
  - Rebuilt the rollout with health gates, one-node-at-a-time deployment, per-node
    rollback, and post-deployment smoke tests on Docker Compose.
---

## Overview

The platform pilot combined K3s, Argo CD, Argo Rollouts, Harbor, Infisical, and Loki, Alloy, and Prometheus observability. It was designed and load-tested as a possible application platform, not operated as the production deployment system.

## Storage Evidence and Decision

A production dry run exposed the underlying constraint: each baremetal server had a single SAS HDD shared between two VMs. Under concurrent image pulls, measured throughput was 10-15 MB/s.

The Kubernetes approach was formally retired for application workloads on 3 June 2026, with the investigation and conditions for reconsidering it documented.

## Docker Compose Rollout

Equivalent release guarantees were rebuilt with a deliberately triggered Jenkins and Docker Compose process. Deployments proceed one node at a time, require health checks before continuing, isolate rollback per node, and finish with post-deployment smoke tests.
