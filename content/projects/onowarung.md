---
title: onowarung
category: Full Stack
description: Local-first, multi-tenant POS SaaS built for Indonesian micro-retailers
  (warungs) with offline-first synchronization.
featured: true
order: 2
liveUrl: null
githubUrl: https://github.com/prostiate
tags:
  - Nuxt PWA
  - Hono
  - Cloudflare Workers
  - Neon Postgres
  - Row-Level Security
  - PowerSync
problemSolved: Micro-retailers in Indonesia operate in variable internet connectivity
  environments where traditional cloud-only POS systems freeze or drop orders during
  cellular network outages.
architecture:
  - Offline-first local replica architecture with PowerSync conflict resolution algorithms.
  - Edge API powered by Hono on Cloudflare Workers for sub-50ms regional response times.
  - Multi-tenant Postgres database with strict Row-Level Security (RLS) policies isolating
    tenant stores.
  - Framework-agnostic business logic package shared between PWA client and server edge
    handlers.
---

Local-first, multi-tenant POS SaaS for Indonesian micro-retailers.
