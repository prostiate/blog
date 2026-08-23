---
title: Personal Site & Edge CMS
category: Full Stack
description: Multi-worker edge architecture with dedicated Superadmin CMS, service
  bindings, and edge rate-limiting.
featured: false
order: 4
liveUrl: https://irfankurniawan.com
githubUrl: https://github.com/prostiate
tags:
- Nuxt 4
- Hono
- Cloudflare Workers
- Drizzle ORM
- Neon Postgres
- R2 & KV
problemSolved: Traditional monolithic CMS solutions suffer from server cold starts,
  rigid deployment pipelines, and edge cache invalidation complexity.
architecture:
- Decoupled Admin console running on an isolated Worker communicating via Cloudflare
  Service Bindings to the core API.
- Drizzle ORM integration with Neon serverless Postgres for instant branch-based migrations.
- Distributed rate-limiting engine on edge workers handling memory-state synchronization
  across global edge nodes.
---

Multi-worker edge architecture with dedicated Superadmin CMS on Cloudflare Workers.
