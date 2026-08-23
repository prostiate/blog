---
title: pg-client-mobile
category: Mobile / Database Tooling
description: Android-first Flutter GUI client for PostgreSQL with keystroke safety
  guards and connection management.
featured: true
order: 3
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

## Overview

**pg-client-mobile** is an Android-first mobile PostgreSQL management tool built with **Flutter and Dart**. It allows backend engineers, DBAs, and platform administrators to inspect databases, run diagnostic queries, and analyze performance logs directly from mobile devices with built-in guardrails against destructive accidents.

---

## Safety-First Architecture

### 1. SQL Execution Safeguards

- Running queries on a touchscreen carries high accidental click risk. pg-client-mobile parses SQL input before execution to detect potentially destructive statements (`DROP`, `TRUNCATE`, `DELETE` without `WHERE`).
- Prompts a secondary confirmation modal with explicit schema and affected row estimates before dispatching dangerous operations.

### 2. High-Performance Grid Virtualization

- Query results with thousands of rows are rendered using a 2D virtualized scrolling grid, preventing memory spikes and maintaining smooth 60 FPS scrolling on budget Android smartphones.

### 3. Encrypted Local Storage

- Connection strings, SSL certificates, and SSH tunnel private keys are encrypted on-device using Android Keystore and AES-256 GCM.

---

## Technical Highlights

- **Commits & Ownership**: 100% solo design and development.
- **Open Source**: Published under MIT License with comprehensive documentation and screenshot galleries.
