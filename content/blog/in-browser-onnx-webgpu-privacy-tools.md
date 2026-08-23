---
title: "Running ONNX Models in the Browser: Zero-Server Privacy Architecture with WebGPU & WASM"
description: "Building OnoToolkit: How we moved heavy background removal, MI-GAN inpainting, and Ghostscript PDF compression entirely into client-side WASM & WebGPU."
date: "2026-05-10"
readTime: "6 min read"
tags: ["WASM", "WebGPU", "ONNX", "Privacy", "Nuxt 4"]
featured: true
---

## Why Zero-Server Privacy Matters

When developers and end-users need to compress a confidential legal PDF, remove an image background, or debug a JSON Web Token containing internal claims, the standard workflow is dangerous: they upload the document to a random online converter.

With **OnoToolkit** ([onotoolkit.irfankurniawan.com](https://onotoolkit.irfankurniawan.com/)), our founding principle was absolute client-side isolation: **files, tokens, and secrets must never leave the browser**.

---

## The Technical Challenge: Running ML Models Client-Side

Running machine learning models in consumer browsers introduces strict resource budgets:
- **Memory Footprint**: Keeping model weights under 40 MB to prevent mobile browser tab crashes.
- **Compute Acceleration**: Leveraging WebGPU where available, with automatic, graceful fallback to WebAssembly (WASM) SIMD.
- **Byte-Identical Precision**: Inpainting algorithms must reconstruct only targeted pixels while preserving the original image byte-for-byte.

```typescript
// ONNX Runtime Web execution pipeline with WebGPU acceleration
import * as ort from 'onnxruntime-web/webgpu';

export async function removeWatermarkInpainting(
  imageTensor: ort.Tensor, 
  maskTensor: ort.Tensor
): Promise<ImageData> {
  const session = await ort.InferenceSession.create('/models/migan_inpaint.onnx', {
    executionProviders: ['webgpu', 'wasm'],
    graphOptimizationLevel: 'all'
  });

  const feeds = { input_image: imageTensor, mask: maskTensor };
  const results = await session.run(feeds);
  return tensorToImageData(results.output_image);
}
```

---

## Ghostscript in WebAssembly for PDF Compression

For PDF manipulation, server-side Ghostscript has been the gold standard for decades. By compiling Ghostscript to WebAssembly (`ghostscript-wasm`), we achieved:
- Dual-pass compression with real-time before/after quality comparison.
- Full support for multi-page extraction, rotation, and PDF-to-Markdown conversions.
- Complete offline capability after the initial PWA service worker cache.

::callout{type="info"}
**Performance Insight:** Using a client-side binary-search resizer, the browser iteratively computes JPEG/WebP quantization tables to hit the exact requested file size without server roundtrips.
::

---

## Conclusion

Client-side computation is now fast enough to replace cloud processing for a vast array of daily productivity and media workflows. Building local-first tools is not just about saving cloud hosting costs - it is about giving users unbreakable privacy guarantees by architecture.
