---
title: Building a Small VM Platform Without Pretending It Is a Cloud
description: There is a tempting way to describe a small on premise platform: borrow the vocabulary of a public cloud, draw enough boxes, and make it sound larger than it is. I prefer the…
date: 2026-08-06
readTime: 9 min read
tags: ["Infrastructure","DevOps","Linux","Operations"]
status: PUBLISHED
featured: true
---

There is a tempting way to describe a small on-premise platform: borrow the vocabulary of a public cloud, draw enough boxes, and make it sound larger than it is. I prefer the opposite approach. A small platform becomes easier to operate when its description is almost boring.

Mine had a finite number of physical machines, a finite amount of memory, and disks that could not be wished into faster hardware. Above that sat ordinary virtual machines running Linux. My work started at the guest operating-system layer. I was not administering the hypervisor, and I did not want to blur that boundary in the design.

That constraint shaped the system. I could decide how workloads were grouped, how traffic entered, where application processes ran, how certificates renewed, and how releases moved between environments. I could not redesign the physical storage or assume an orchestration control plane would erase its limits.

This post is about that layer: the decisions between a newly provisioned VM and a running application.

## Begin with roles, not products

The first useful diagram did not contain product logos. It contained five roles:

```text
Internet
   |
[edge and TLS]
   |
   +---- [staging application node]
   |
   +---- [production application node A]
   +---- [production application node B]
   +---- [production application node C]
                    |
               [database node]

[tooling node] ---- image registry, CI controller, object storage
```

Each role answers a different operational question.

- The **edge** answers: where does public traffic terminate, and where are routes changed?
- The **application nodes** answer: where can a release run, and how many copies may survive a node failure?
- The **database node** answers: where does durable application state live?
- The **tooling node** answers: where are artifacts built, stored, and promoted?
- The **staging node** answers: where can the same deployment contract be exercised without touching production?

This separation is not perfect isolation. A small platform usually cannot afford one machine for every concern. It is a map of responsibility. When an alert arrives, the map narrows the first set of checks.

It also makes compromises visible. A single edge VM is a single public-entry failure point even if three application nodes sit behind it. A dedicated database VM separates noisy application processes from the database, but it does not create database high availability. A tooling VM can save resources, but a full disk there may affect several operational services at once.

Writing those sentences was more valuable than calling the platform “resilient.” Resilience is specific: which failure, which surviving function, and for how long?

## Keep environments structurally similar and operationally separate

Staging and production used the same basic path:

```text
request -> reverse proxy -> application host port -> container port
```

The similarity mattered. A health check, proxy rule, or container image that behaved differently only in production was difficult to trust.

The separation mattered more. Staging had its own routes, application processes, configuration, database state, and storage. Production used multiple application nodes; staging deliberately used one. That difference was documented instead of hidden. Staging could validate a release contract, but it could not prove production failover.

I used predictable host-port ranges to reduce accidental collisions. The pattern is what helped:

```text
2xxxx  staging workloads
5xxxx  production workloads

xx0xx  frontends
xx8xx  APIs
xx1xx  platform services
```

This is not a substitute for service discovery. It is a small-system convention that lets an operator infer the class of a process from a socket listing. The convention needs a registry, even if that registry is only a reviewed table in an operator document.

The rule I learned was simple: do not allocate “the next free port” from memory. Record the owner, environment, host, container port, health path, and whether the allocation is active or reserved.

## Put one reverse-proxy contract at the edge

The public edge handled three jobs:

1. redirect plain HTTP to HTTPS;
2. terminate TLS;
3. forward a request to an environment-specific upstream pool.

The configuration shape:

```nginx
upstream portal_production {
    least_conn;
    server 192.0.2.21:51000 max_fails=3 fail_timeout=10s;
    server 192.0.2.22:51000 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl;
    server_name portal.example.test;

    location / {
        proxy_pass http://portal_production;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

The important part is the contract around them.

Before a configuration was enabled, I wanted four checks:

```bash
nginx -t
curl --fail http://192.0.2.21:51000/healthz
curl --fail http://192.0.2.22:51000/healthz
curl --fail --resolve portal.example.test:443:192.0.2.10 \
  https://portal.example.test/healthz
```

The first checks syntax. The next two bypass the proxy and test the upstreams. The last follows the real TLS and host-routing path. That sequence distinguishes an application failure from an edge-routing failure.

Every application exposed a cheap readiness endpoint. It did not run a large business query. It answered whether the process had started and whether the dependencies required to serve normal traffic were available. Liveness and readiness are different questions; treating them as the same can turn a temporary dependency problem into a restart loop.

## Automate certificate renewal, then test the automation

Certificate automation is often declared complete after the first successful issuance. The harder part is renewal.

DNS-based validation worked well because the edge could request a certificate without placing challenge files inside every application. It also allowed wildcard coverage where that was appropriate. The operational chain was:

```text
scheduled renewal
    -> DNS challenge
    -> certificate issuance
    -> install key and chain in restricted directory
    -> validate proxy configuration
    -> reload proxy
```

Every arrow can fail. The renewal account might lose access to DNS. The certificate can renew but fail to copy into the directory used by the proxy. The reload command can require an interactive password and silently fail from a scheduled job.

I therefore treated a forced renewal rehearsal as part of setup. After it ran, I inspected the certificate actually served by the edge, not merely the file produced by the client:

```bash
openssl s_client -connect portal.example.test:443 \
  -servername portal.example.test </dev/null 2>/dev/null |
  openssl x509 -noout -subject -issuer -dates
```

## Design for failure by naming the blast radius

Small platforms rarely have enough redundancy to survive every failure. That is not a reason to avoid failure planning. It is a reason to be precise.

For each VM role, I wrote:

- what immediately becomes unavailable;
- what continues to run;
- whether users can still reach it;
- whether new releases can still be made;
- where the data needed for recovery lives;
- which person or team controls the layer below the VM.

The distinction between “process is running” and “service is reachable” repeatedly mattered. Application containers can remain healthy while a failed edge makes them unavailable to users. Production applications can remain reachable while a failed tooling node prevents new deployments. A database failure can leave static frontend pages online while every state-changing request fails.

Summarised by role:

| Failed role  | Immediate effect                   | Surviving capability              | First recovery priority                |
| ------------ | ---------------------------------- | --------------------------------- | -------------------------------------- |
| Edge         | Public routes unavailable          | Internal services may still run   | Restore TLS and proxy routing          |
| One app node | Reduced production capacity        | Other app nodes can serve         | Drain, diagnose, restore replica       |
| Tooling      | Builds and artifact promotion stop | Current release keeps running     | Preserve registry and CI state         |
| Database     | Stateful requests fail             | Stateless processes may remain up | Protect data, restore service          |
| Staging      | Release rehearsal stops            | Production is unaffected          | Restore after production risk is clear |

This is not a high-availability claim. It is an honest recovery map.

## Resource limits should influence placement

On constrained hardware, co-location is a scheduling decision made by humans. A registry scanning a large image, an object store compacting data, and a CI job building several images can compete for memory and disk on the tooling node. A staging database and a log store can do the same on a shared staging node.

I used three simple controls before reaching for more software:

- explicit container memory limits where failure under a cap was understood;
- scheduled heavy maintenance outside release windows;
- disk-usage thresholds with a documented cleanup procedure.

Cleanup was always dry-run first. “Remove unused images” sounds harmless until a node needs an older layer during rollback. Retention rules differed by role: an application node cache, a central registry, and object-storage data are not interchangeable.

The useful capacity question was not “how much disk is free?” It was “which write-heavy operations can coincide on the same physical storage?” That question later became central to the Kubernetes experiment described in the final post of this series.

## Documentation is part of the platform

The operator reference eventually became as important as the compose files. It recorded:

- the role of every VM without exposing credentials;
- environment boundaries;
- route ownership;
- port-allocation rules;
- certificate renewal and verification;
- deployment health contracts;
- failure impact;
- storage locations and retention rules;
- commands that are safe to run and commands that require a maintenance window.

It deliberately did not contain passwords, tokens, private keys, public endpoints, or copy-paste access instructions. A useful runbook can still be a security problem if it gives a reader a complete map and the keys to it.

The final lesson is not that a handful of VMs can imitate a cloud platform. It is that they do not need to. A clear role map, a consistent request path, rehearsed certificate renewal, explicit health checks, and honest failure boundaries can make a modest platform dependable.

Dependability came from removing mystery. The system was small enough that every moving part could be named. The work was to keep that description true.