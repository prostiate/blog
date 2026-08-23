---
title: AccessButtons
category: Mobile / Native Android
description: Premium floating media volume controller for Android built with Kotlin,
  Jetpack Compose, WindowManager overlays, and MIUI lifecycle resiliency.
featured: true
order: 4
liveUrl: null
githubUrl: https://github.com/prostiate/access-buttons
tags:
  - Kotlin
  - Jetpack Compose
  - Android SDK
  - Foreground Service
  - WindowManager
  - Coroutines
problemSolved: Hardware volume rocker wear-and-tear and awkward one-handed reaching
  on large modern smartphones, combined with aggressive background service termination
  on OEM ROMs (MIUI/Xiaomi).
architecture:
  - Custom WindowManager floating glass overlay with smooth drag and edge-snapping physics.
  - Foreground Service architecture with persistent notification ensuring reliable background
    retention on Android 11+.
  - Integrated permission flow handling Display Over Other Apps, MIUI Autostart, and
    Battery Optimization whitelists.
  - Haptic click feedback integration for tactile button press responses.
---

## Overview

[AccessButtons](https://github.com/prostiate/access-buttons) is an Android utility engineered in **Kotlin** and **Jetpack Compose**. It provides an ergonomic, draggable floating glass overlay with `+` / `-` volume controls for `STREAM_MUSIC`, solving physical volume button wear-and-tear and awkward single-handed reaching on large smartphone displays.

---

## Native Android Engineering

### 1. WindowManager Floating Glass Overlay

- Created a lightweight floating overlay attached directly via Android's `WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY`.
- Built custom touch handlers supporting fluid dragging, inertial fling, and automatic edge-snapping physics along screen boundaries.

### 2. OEM Background Resiliency (MIUI / HyperOS Hardening)

- Modern Android skins (especially MIUI/Xiaomi and EMUI) aggressively terminate background processes.
- Architected as a prioritized **Foreground Service** paired with a minimal low-priority system notification.
- Included an onboarding permission manager guiding users through `Display Over Other Apps`, `MIUI Autostart`, and `Battery Optimization Whitelist` settings.

### 3. Tactile Feedback & Volume Stream Sync

- Listens directly to AudioManager stream volume changes and triggers subtle native haptic vibrator pulses on every discrete step change.

---

## Source & Architecture

- **Language**: Kotlin 2.x
- **UI Toolkit**: Jetpack Compose & Material 3
- **Repository**: [github.com/prostiate/access-buttons](https://github.com/prostiate/access-buttons)
