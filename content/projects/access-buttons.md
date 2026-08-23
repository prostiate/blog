---
title: AccessButtons
category: Mobile
description: Premium floating media volume controller for Android built with Kotlin,
  Jetpack Compose, WindowManager overlays, and MIUI lifecycle resiliency.
featured: true
order: 6
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
  on large Android devices, with aggressive background service termination on OEM
  ROMs (MIUI/Xiaomi).
architecture:
  - Custom WindowManager floating glass overlay with smooth drag and edge-snapping physics.
  - Foreground Service architecture with persistent notification ensuring reliable background
    retention on Android 11+.
  - Integrated permission flow handling Display Over Other Apps, MIUI Autostart, and
    Battery Optimization whitelists.
  - Haptic click feedback integration for tactile button press responses.
---

Premium floating media volume controller for Android built in Kotlin.
