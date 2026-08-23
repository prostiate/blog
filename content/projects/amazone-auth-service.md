---
title: Amazone In-House Authentication Service
category: Backend / Security
description: Go and GraphQL authentication service with revocable server-side sessions,
  rotating refresh tokens, per-app isolation, and auditable RBAC.
featured: false
order: 5
liveUrl: null
githubUrl: null
tags:
  - Go
  - GraphQL / gqlgen
  - PostgreSQL
  - RBAC
problemSolved: Firebase Auth could not provide revocable server-side sessions, per-app
  isolation, or the audit trail required for shared internal authentication.
architecture:
  - Opaque revocable server-side sessions with rotating refresh tokens.
  - bcrypt password hashing with an HMAC pepper and HttpOnly host-only cookies.
  - Per-app session isolation, device binding, and RBAC role-creation scoping.
  - Server-driven allowedMenus authorization and audit logging.
  - PostgreSQL auth and master schema namespacing behind backward-compatible shims.
---

## Overview

This in-house Go and gqlgen GraphQL service replaced Firebase Auth across 5 backends and 6 frontends. It provides shared authentication while preserving per-application session isolation.

## Session and Credential Design

Authentication uses opaque, revocable server-side sessions and rotating refresh tokens. Passwords are protected with bcrypt and an HMAC pepper. Browser credentials use HttpOnly, host-only cookies, and sessions can be bound to a device identity.

## Authorization and Auditability

RBAC includes role-creation scoping so administrators cannot create roles beyond their authority. A server-driven `allowedMenus` tree supplies application authorization, and audit logs record authentication activity.

## Migration

Identity tables moved from `public.*` into namespaced `auth.*` and `master.*` PostgreSQL schemas. Backward-compatible shims kept legacy resolvers working during the cutover.

The migration covered 11 applications with zero service interruption.
