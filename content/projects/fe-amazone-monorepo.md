---
title: Amazone Retail & POS Monorepo
category: Frontend / Architecture
description: Shared Bun and Turborepo workspace for three production Nuxt applications,
  with a separately packaged Cashier Desktop build.
featured: true
order: 2
liveUrl: null
githubUrl: null
tags:
  - Vue 3
  - Nuxt
  - Bun
  - Turborepo
  - Chrome 109
problemSolved: Three separately maintained Nuxt frontends duplicated shared changes
  and drifted apart, while large data-entry forms froze on ageing in-store hardware.
architecture:
  - Consolidated three Nuxt frontends with Bun workspaces and Turborepo.
  - Packages Cashier Desktop separately from the three production Nuxt applications.
  - Shared a reusable @amazone/base Nuxt layer containing 27 components.
  - Used one parameterized Docker build to produce three independent application images.
  - Reworked the form interaction into server-paginated pages after virtualization
    proved insufficient on the oldest supported machines and browsers.
---

## Overview

The workspace consolidates Backoffice, Auth Login, and Cashier, which are three production Nuxt applications, and includes the separately packaged Cashier Desktop build. The three Nuxt applications were previously maintained independently. Bun workspaces and Turborepo now keep common frontend capabilities in one place while each application continues to ship independently.

## Shared Nuxt Architecture

The reusable `@amazone/base` Nuxt layer contains 27 components alongside shared composables, utilities, and a unified authentication contract. The layer is auto-imported across applications and can be overridden when an application needs different behavior.

A single parameterized Dockerfile uses `turbo prune` to prepare focused builds and still produces three independent application images.

## Legacy Hardware Form Fix

Large data-entry forms froze on ageing in-store hardware. Virtualization was tried first but remained insufficient on the oldest machines and browsers. The interaction was then redesigned as server-paginated, multi-page forms: users complete one page at a time, submit only on the last page, and backend validation protects data integrity.

The monorepo also includes browser-support guards and E2E coverage pinned to Chrome 109, matching the Windows 7 browser used by in-store terminals.

## Measured Pipeline Results

Jenkins medians for the migrated application improved from 3.5 to 1.7 minutes in staging and from 5.9 to 3.0 minutes in production.
