---
title: "OnoToolkit"
category: "Full Stack"
description: "Privacy-first suite of high-performance browser tools running entirely client-side via WASM, ONNX Runtime Web, and WebGPU."
featured: true
order: 1
liveUrl: "https://onotoolkit.irfankurniawan.com/"
githubUrl: "https://github.com/prostiate/onotoolkit"
tags: ["Nuxt 4", "WASM", "ONNX WebGPU", "Ghostscript", "IndexedDB", "Cloudflare Workers"]
problemSolved: "Heavy utilities (PDF compression, image background removal, video editing, JWT debugging) typically require uploading sensitive user files and secrets to third-party cloud servers, posing privacy and data leak risks."
architecture:
  - "ONNX Runtime Web (WebGPU with WASM fallback) for background removal (@imgly/background-removal) and MI-GAN inpainting watermark removal."
  - "Ghostscript-WASM integration for client-side PDF compression with instant before/after preview sliders."
  - "Local-first screen recorder using getDisplayMedia, canvas compositing, and burned-in annotation strokes into MediaRecorder stream."
  - "RFC 7519 JWT debugger built on jose with in-browser key-pair generation and EdDSA/ES/RS signature verification."
  - "Zero cloud storage: IndexedDB persistent local library with poster thumbnail caching."
---

Privacy-first suite of high-performance browser utilities running entirely in the user's browser.
