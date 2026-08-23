---
title: Amazone In-House Auth & Token Service
category: Backend
description: High-security internal authentication service in Go with revocable session
  tokens and RBAC middleware.
featured: false
order: 7
liveUrl: null
githubUrl: null
tags:
- Go
- GraphQL / gqlgen
- PostgreSQL
- Redis
- JWT
- RBAC
problemSolved: Firebase Auth lacked granular instant-revocation capabilities required
  for cashier shift handovers and multi-outlet department permissions.
architecture:
- High-throughput Go GraphQL auth backend with dual-token (short-lived access + sliding
  refresh) lifecycle.
- Redis-backed instant session blacklist for immediate operator offboarding across
  all store cashiers.
- Role-based access control (RBAC) middleware verifying company, branch, and role
  scopes on every resolver.
---

Internal authentication service in Go with revocable session tokens.
