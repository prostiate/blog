---
title: "Amazone Retail & POS Monorepo"
category: "Frontend"
description: "Unified Bun + Turborepo monorepo powering 6 production retail web apps, store cashier terminals, and legacy hardware compatibility."
featured: true
order: 3
liveUrl: null
githubUrl: null
tags: ["Vue 3", "Nuxt 3", "Bun", "Turborepo", "Element Plus", "Legacy Browser Guard"]
problemSolved: "Fragmented frontend codebases caused triple-redundant UI updates across Backoffice, HSE, and Cashier platforms, while store cashier machines running Chrome 109 on Windows 7 suffered UI thread freezes during high-volume item scanning."
architecture:
  - "Consolidated 3 standalone Nuxt frontends into a single Bun + Turborepo monorepo with shared @amazone/base layer."
  - "Designed a paginated form interaction and DOM recycling strategy to eliminate re-render freezes on 10-year-old POS machines."
  - "Engineered an automated browser-support guard and polyfill pipeline supporting Chrome 109+ without bloating modern bundles."
  - "Built custom fail-safe cashier shells that route directly to duty blocks rather than crashing to blank screens on network loss."
---

Unified Bun + Turborepo monorepo powering 6 production retail web applications.
