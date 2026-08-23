---
title: Amazone In-House Auth & Token Service
category: Backend / Security
description: High-security internal authentication service in Go with revocable session
  tokens and RBAC middleware.
featured: false
order: 5
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
  for cashier shift handovers, multi-outlet department permissions, and on-premise
  compliance.
architecture:
  - High-throughput Go GraphQL auth backend with dual-token (short-lived access + sliding
    refresh) lifecycle.
  - Redis-backed instant session blacklist for immediate operator offboarding across
    all store cashiers.
  - Role-based access control (RBAC) middleware verifying company, branch, and role
    scopes on every resolver.
---

## Overview

To secure retail cashier workstations, manager consoles, and internal backoffice services, this project replaced third-party hosted authentication (Firebase Auth) with an in-house **Go GraphQL authentication engine**.

The system provides instant session revocation, strict role-based access control (RBAC), and sliding refresh token rotation across all company applications.

---

## Core Architecture

### 1. Dual-Token Lifecycle

- **Access Tokens**: Short-lived (15 minutes), digitally signed JWTs containing user ID, role, outlet branches, and department permissions.
- **Refresh Tokens**: Stored in PostgreSQL with hardware device fingerprints and IP validation, rotated upon every access token refresh.

### 2. Instant Session Revocation via Redis

- Cashier shift changes and employee offboarding require immediate authorization invalidation without waiting for access tokens to expire.
- Built a high-speed Redis session blacklist queried by API gateway middleware in `<1ms`.

### 3. Go GraphQL Engine (gqlgen)

- Type-safe schema-first GraphQL API implemented in Go using `gqlgen`.
- Fine-grained field-level directive authorization (`@hasPermission(scope: "RETAIL_WRITE")`) protecting administrative resolvers.

---

## Results

- **Full Data Sovereignty**: Eliminated recurring SaaS authentication bills and third-party vendor lock-in.
- **Sub-Millisecond Auth Checks**: Redis token verification executed with near-zero latency overhead on backend endpoints.
