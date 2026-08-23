---
title: pg-client-mobile
category: Mobile
description: Android-first Flutter GUI client for PostgreSQL with keystroke safety
  guards and connection management.
featured: true
order: 5
liveUrl: null
githubUrl: https://github.com/prostiate/pg-client-mobile
tags:
  - Flutter
  - Dart
  - PostgreSQL
  - Android
  - SQL Safety
problemSolved: Managing production PostgreSQL instances from mobile devices often
  leads to accidental destructive queries due to touch sensitivity and lack of execution
  confirmation guards.
architecture:
  - Implemented shortcut-run protection and AST-based query inspection to prevent accidental
    destructive table drops.
  - Lightweight SQL editor with real-time syntax highlighting, result grid virtualization,
    and execution telemetry.
  - Native connection pool manager with encrypted local credential storage on device.
---

Android-first Flutter GUI client for PostgreSQL.
