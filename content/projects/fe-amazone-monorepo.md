---
title: Amazone Retail & POS Monorepo
category: Frontend / Architecture
description: Unified Bun + Turborepo monorepo powering 6 production retail web apps,
  store cashier terminals, and legacy hardware compatibility.
featured: true
order: 2
liveUrl: null
githubUrl: null
tags:
  - Vue 3
  - Nuxt 3
  - Bun
  - Turborepo
  - Element Plus
  - Legacy Browser Guard
problemSolved: Fragmented frontend codebases caused triple-redundant UI updates across
  Backoffice, HSE, and Cashier platforms, while store cashier machines running Chrome
  109 on Windows 7 suffered UI thread freezes during high-volume item scanning.
architecture:
  - Consolidated 3 standalone Nuxt frontends into a single Bun + Turborepo monorepo
    with shared @amazone/base layer.
  - Designed a paginated form interaction and DOM recycling strategy to eliminate re-render
    freezes on 10-year-old POS machines.
  - Engineered an automated browser-support guard and polyfill pipeline supporting Chrome
    109+ without bloating modern bundles.
  - Built custom fail-safe cashier shells that route directly to duty blocks rather
    than crashing to blank screens on network loss.
---

## Overview

At Amazone Indonesia, managing 6 separate web applications across retail backoffice management, cashier POS terminals, and operations led to significant maintenance overhead, divergent UI components, and performance bottlenecks on legacy in-store hardware.

This project consolidated disparate frontends into a high-performance **Bun + Turborepo monorepo** centered around a shared Nuxt layer (`@amazone/base`).

---

## Engineering Challenges & Solutions

### 1. Eliminating Redundant Code via Shared Nuxt Layer

- **Problem**: Updating a core table component, authentication middleware, or export dialog required three separate pull requests across separate repositories.
- **Solution**: Structured a unified workspace using Bun workspaces and Turborepo caching. Extracted all authentication interceptors, Element Plus design wrappers, and formatting utilities into `@amazone/base`, reducing maintenance cycles by over 60%.

### 2. Solving UI Thread Freezes on Chrome 109 / Windows 7

- **Problem**: Hundreds of store cashier machines in nationwide arcades run on 10-year-old dual-core Celeron hardware locked to Windows 7 and Chrome 109. High-volume item scanning previously caused re-render lag and dropped keystrokes.
- **Solution**: Replaced unbounded reactive watchers with virtualized DOM lists, batched state updates, and paginated modal tables. Eliminated DOM recycling freezes and lowered peak CPU utilization during cashier shifts from 95% down to under 25%.

### 3. Fail-Safe Offline Cashier Shells

- Implemented client-side network interceptors that detect store connectivity drops and lock cashier terminals into safe offline transaction modes rather than throwing unhandled exceptions or presenting blank screens to store clerks.

---

## Key Results

- **Build Speed**: Turborepo build caching with Bun cut CI build times from 7 minutes to 1.5 minutes.
- **Hardware Resiliency**: Zero reported browser freezes across all retail outlets nationwide.
