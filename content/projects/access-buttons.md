---
title: AccessButtons
category: Mobile / Native Android
description: Floating media volume controls built for Android with Kotlin, Jetpack
  Compose, and a resilient MIUI permission flow.
featured: false
order: 4
liveUrl: null
githubUrl: https://github.com/prostiate/access-buttons
tags:
  - Kotlin
  - Jetpack Compose
  - WindowManager
  - Foreground Service
problemSolved: Provides draggable on-screen media volume controls and guides Xiaomi
  users through the permissions needed to keep the overlay available.
architecture:
  - WindowManager floating overlay with drag and edge-snapping behavior.
  - Foreground Service architecture for the overlay lifecycle.
  - Haptic feedback for volume controls.
  - MIUI permission flow for overlays, autostart, and battery optimization exclusions.
---

## Overview

[AccessButtons](https://github.com/prostiate/access-buttons) is an Android media volume controller built in Kotlin and Jetpack Compose. It presents `+` and `-` controls in a draggable WindowManager overlay.

## Native Android Implementation

The overlay supports dragging, edge snapping, and haptic feedback. A Foreground Service owns its ongoing lifecycle.

For Xiaomi devices, the permission flow guides users through Display Over Other Apps, MIUI Autostart, and Battery Optimization whitelist settings.
