---
title: OnoToolkit
category: Full Stack / In-Browser ML
description: Privacy-first utilities that keep file processing, model inference,
  and recording inside the browser.
featured: true
order: 1
liveUrl: https://onotoolkit.irfankurniawan.com/
githubUrl: https://github.com/prostiate/onotoolkit
tags:
  - Nuxt 4
  - WASM
  - ONNX Runtime Web
  - IndexedDB
problemSolved: Privacy-sensitive utilities process files, model inputs, recordings,
  and developer tokens locally in the browser instead of uploading them.
architecture:
  - Browser-local PDF processing with Ghostscript-WASM and before-and-after previews.
  - ONNX-powered image tools, including MI-GAN inpainting through ONNX Runtime Web
    with WebGPU and a WASM fallback.
  - Screen recording with browser media APIs, canvas compositing, and an IndexedDB library.
  - RFC 7519 JWT debugging with JOSE-based signing and signature verification.
---

## Overview

[OnoToolkit](https://onotoolkit.irfankurniawan.com/) is a privacy-first suite of browser utilities. File processing, model inference, screen recording, and JWT operations run locally in the browser, so the associated files, tokens, and secrets do not leave the device.

## Browser-Local Processing

### PDF Tools

The PDF suite uses Ghostscript-WASM for compression and includes merge, split, rotate, image conversion, and document conversion workflows. Compression provides a before-and-after preview before download.

### Image Tools

Background removal runs an ONNX model in the browser through `@imgly/background-removal`. Watermark removal uses MI-GAN inpainting through ONNX Runtime Web, with WebGPU and a WASM fallback, and composites the result over the user-painted region.

### Screen Recording

The recorder combines `getDisplayMedia`, `getUserMedia`, canvas compositing, `captureStream()`, and `MediaRecorder`. It supports a movable picture-in-picture webcam, burned-in annotations, mixed microphone and system audio, and a persistent IndexedDB recording library with poster thumbnails.

### JWT Debugging

The RFC 7519 debugger uses `jose` for decoding, signing, signature verification, and in-browser key-pair generation across HS, RS, PS, ES, and EdDSA algorithms.

## Verified Optimization

Build-time filtering removed 23 MB of unrequested WASM payloads from the client bundle.
