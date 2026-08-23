---
title: OnoToolkit
category: Full Stack / In-Browser ML
description: Privacy-first suite of high-performance browser tools running entirely
  client-side via WASM, ONNX Runtime Web, and WebGPU.
featured: true
order: 1
liveUrl: https://onotoolkit.irfankurniawan.com/
githubUrl: https://github.com/prostiate/onotoolkit
tags:
  - Nuxt 4
  - WASM
  - ONNX WebGPU
  - Ghostscript
  - IndexedDB
  - Cloudflare Workers
problemSolved: Heavy utilities (PDF compression, image background removal, watermark
  removal, video recording, JWT debugging) traditionally require uploading sensitive
  files and tokens to third-party cloud servers, introducing severe privacy and data
  leak risks.
architecture:
  - ONNX Runtime Web (WebGPU with WASM fallback) for background removal (@imgly/background-removal)
    and MI-GAN inpainting watermark removal.
  - Ghostscript-WASM integration for client-side PDF compression with instant before/after
    preview sliders.
  - Local-first screen recorder using getDisplayMedia, canvas compositing, and burned-in
    annotation strokes into MediaRecorder stream.
  - RFC 7519 JWT debugger built on jose with in-browser key-pair generation and EdDSA/ES/RS
    signature verification.
  - "Zero cloud storage: IndexedDB persistent local library with poster thumbnail caching."
---

## Overview

[OnoToolkit](https://onotoolkit.irfankurniawan.com/) is a privacy-first suite of high-performance utilities that run entirely in the browser. Unlike conventional online file converters that upload user files to remote servers, OnoToolkit executes all computational workloads locally on the client machine using **WebAssembly (WASM)**, **ONNX Runtime Web with WebGPU**, and **Canvas compositing APIs**.

Files, documents, and sensitive authentication tokens never leave the user's device.

---

## Architectural Deep Dive

### 1. In-Browser Machine Learning (ONNX & WebGPU)

- **Background Removal**: Integrates `@imgly/background-removal` running neural network inference on the client. Automatically prioritizes hardware-accelerated **WebGPU** execution, gracefully falling back to multi-threaded WASM with SIMD instructions when GPU access is unavailable.
- **Watermark Inpainting (MI-GAN)**: Runs deep generative inpainting client-side. Rather than accepting full image re-generation artifacts, the pipeline uses masked canvas compositing to guarantee that only user-painted bounding pixels are modified, leaving unaltered pixels 100% byte-identical.

### 2. Client-Side PDF Processing via Ghostscript-WASM

- Compiles Ghostscript to WebAssembly to provide production-grade PDF compression, linearization, and page manipulation in the browser.
- Features a real-time before/after image comparison slider and live compression ratio telemetry prior to downloading.

### 3. Canvas-Composited Screen Recorder

- Built on `getDisplayMedia` and `getUserMedia` streams with real-time `<canvas>` compositing.
- Supports movable, circular picture-in-picture webcam bubbles and interactive vector annotation strokes burned directly into the output `MediaRecorder` stream at 60 FPS.
- Integrates local IndexedDB storage with instant blob caching and poster thumbnails.

### 4. Zero-Trust RFC 7519 JWT Debugger

- Implements cryptographic signature verification and keypair generation (HS256, RS256, ES256, EdDSA) via the `jose` library in memory.
- Ensures developer API tokens, private keys, and authorization claims are never leaked across network boundaries.

---

## Impact & Key Takeaways

- **Zero Server Costs**: Zero backend processing servers required; deployed entirely on Cloudflare Workers/Pages static CDN.
- **Absolute Data Sovereignty**: 100% client-side execution eliminates data privacy liabilities and server cold starts.
- **Rollup Payload Optimization**: Reduced client bundle sizes by 45.7% (23 MB) by stripping unrequested WASM sub-payloads at build time.
