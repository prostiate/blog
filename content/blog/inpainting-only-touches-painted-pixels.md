---
title: An Inpainting Model That Is Only Allowed to Touch the Pixels You Painted
description: MI-GAN returns a whole new image and I throw almost all of it away on purpose. The guarantee, the ONNX plumbing, and the 88 MB my own comment said was 40 MB.
date: 2026-08-15
readTime: 10 min read
tags: ["Architecture","Frontend"]
status: PUBLISHED
featured: true
---

A generative inpainting model hands you back a whole new image. Not a patch  -  an entire raster, every pixel of it the model's opinion. If you show that to a user who asked you to remove a watermark from the corner of their photo, you have not removed a watermark. You have replaced their photo with a similar one.

So I throw away almost all of it. The model's output is only allowed to reach pixels the user actually painted; everything else is copied byte-for-byte from the original. That is the whole product, and it is one loop.

The tool is [Ono Toolkit's Watermark Remover](https://onotoolkit.irfankurniawan.com/tools/watermark-remover) and the source is [on GitHub](https://github.com/prostiate/onotoolkit) under AGPL-3.0. It runs MI-GAN as ONNX in your browser  -  no upload, no inference server, no GPU of mine. This post is how the pieces fit and what I measured them costing, including the one number in my own code comments that turned out to be wrong by more than 2×.

## The guarantee comes first

```ts
// apps/web/app/utils/image.ts
export function compositeMaskedRegion(
  original: RgbaImage,
  result: RgbaImage,
  mask: Uint8Array
): RgbaImage {
  const { width, height } = original;
  const out = new Uint8ClampedArray(original.data.length);
  out.set(original.data);
  for (let p = 0; p < mask.length; p += 1) {
    if (mask[p] === 0) {
      const dst = p * 4;
      out[dst] = result.data[dst]!;
      out[dst + 1] = result.data[dst + 1]!;
      out[dst + 2] = result.data[dst + 2]!;
      out[dst + 3] = result.data[dst + 3]!;
    }
  }
  return { width, height, data: out };
}
```

That's it, minus a size-mismatch throw at the top. Start from a copy of the original, and only where `mask[p] === 0`  -  the painted region  -  take the model's pixels.

I want to be precise about why this is the foundation and not a safety net. MI-GAN already claims to preserve unmasked areas; its own pipeline crops, resizes and blends internally. But "claims to preserve" is a property of a neural network, and the property I want to advertise is "your photo is unchanged outside the brush", which is a property of an `if` statement. One of those I can test. The other I can only hope for.

The consequence is that 99% of the output quality has nothing to do with model quality. If MI-GAN gets worse, my tool gets worse in a 200×80 pixel rectangle and nowhere else.

## Getting a mask out of a brush

The canvas the user paints on is not the image. It's a second, transparent canvas stacked exactly on top at the same natural resolution:

```ts
// apps/web/app/components/tool/image/WatermarkCanvas.vue
/**
 * Two stacked, natural-resolution canvases: the base image and a transparent
 * brush overlay the user paints on. Keeping them separate lets us read a clean
 * mask (overlay alpha) and the untouched source pixels independently. Strokes
 * are tinted red purely for display; only their alpha drives the mask.
 */
```

The red is cosmetic  -  `rgba(220, 38, 38, 0.55)`, chosen so you can see what you painted. The only channel that carries information is alpha.

Which means the mask extraction reads one byte in four:

```ts
// apps/web/app/utils/image.ts
export function brushOverlayToMaskUint8(overlay: RgbaImage, alphaThreshold = 10): Uint8Array {
  const { width, height, data } = overlay;
  const plane = width * height;
  const out = new Uint8Array(plane);
  for (let p = 0; p < plane; p += 1) {
    const painted = data[p * 4 + 3]! > alphaThreshold;
    out[p] = painted ? 0 : 255;
  }
  return out;
}
```

Note the convention, which is inverted from what you'd guess: MI-GAN wants **255 = keep, 0 = inpaint**. Painted pixels become 0. The `alphaThreshold = 10` exists because anti-aliased stroke edges fade to alpha 1–9, and I don't want a one-pixel halo of half-committed mask around every brush stroke.

The pointer mapping is the same class of problem as a preview-versus-output bug  -  the canvas is displayed at whatever CSS size fits the layout, and painted at natural resolution:

```ts
// apps/web/app/components/tool/image/WatermarkCanvas.vue
function toCanvasPoint(event: PointerEvent): { x: number; y: number } {
  const canvas = overlayCanvas.value!;
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}
```

Get that ratio wrong and the mask lands somewhere the user didn't paint, the guarantee holds perfectly, and it protects entirely the wrong rectangle.

## Feeding an ONNX model from JavaScript

Canvas gives you interleaved RGBA. The model wants planar CHW `uint8`  -  all the red, then all the green, then all the blue, alpha dropped:

```ts
// apps/web/app/utils/image.ts  -  trimmed (doc comment removed)
export function rgbaToChwUint8(image: RgbaImage): Uint8Array {
  const { width, height, data } = image;
  const plane = width * height;
  const out = new Uint8Array(plane * 3);
  for (let p = 0; p < plane; p += 1) {
    const src = p * 4;
    out[p] = data[src]!; // R plane
    out[plane + p] = data[src + 1]!; // G plane
    out[2 * plane + p] = data[src + 2]!; // B plane
  }
  return out;
}
```

Shapes are `[1, 3, height, width]` for the image and `[1, 1, height, width]` for the mask. The one detail I'd argue for is not hard-coding the input names:

```ts
// apps/web/app/composables/useInpaint.ts
const feeds: Record<string, InferenceSession.OnnxValueMapType[string]> = {
  [session.inputNames[0]!]: imageTensor,
  [session.inputNames[1]!]: maskTensor
};

const outputs = await session.run(feeds);
const output = outputs[session.outputNames[0]!];
```

Reading the names off the loaded session means a re-exported model with different tensor names still works as long as the order and shapes hold. When I instrumented a real run, the live session reported `inputNames = ["image", "mask"]` and `outputNames = ["result"]`  -  exactly the positional contract the code assumes.

## Getting 28 MB of weights into a browser tab

The model is 28,079,181 bytes, served from Hugging Face. Fetching that with a bare `await fetch()` gives the user a spinner and no information, so it's read through a stream reader and reported as a ratio, then stored in the Cache Storage API:

```ts
// apps/web/app/composables/useInpaint.ts  -  trimmed (chunk assembly removed)
const cache = "caches" in globalThis ? await caches.open(MODEL_CACHE) : null;
const cached = cache ? await cache.match(MODEL_URL) : undefined;
if (cached) {
  onProgress?.(1);
  return cached.arrayBuffer();
}

const response = await fetch(MODEL_URL);
const total = Number(response.headers.get("content-length") ?? 0);
const reader = response.body.getReader();
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  if (value) {
    chunks.push(value);
    received += value.length;
    onProgress?.(total > 0 ? received / total : undefined);
  }
}
```

Visit two skips the download entirely. The session promise itself is module-level and set back to `null` if creation throws, so a failed first attempt doesn't poison the page.

Two runtime configuration lines are worth more than they look:

```ts
// apps/web/app/composables/useInpaint.ts
ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
ort.env.wasm.numThreads = 1;
```

`ORT_VERSION` is pinned to the exact string `1.21.0-dev.20250206-d981b153d3` in both `package.json` and that URL. The pin is an ABI concern, not a caution: the wasm binaries fetched from the CDN have to match the JavaScript loader that came from npm, and a floating version silently pairs incompatible halves. That particular dev build is also the one `@imgly/background-removal` pins, and unlike stable 1.21.0 it ships correct TypeScript `exports`.

`numThreads = 1` looks conservative and isn't a choice at all. Multi-threaded ONNX Runtime needs `SharedArrayBuffer`, which needs `crossOriginIsolated`, which needs COOP and COEP response headers. There is no COOP or COEP anywhere in this app or its Cloudflare config, so `crossOriginIsolated` is false in production and one thread is the only number available. A deployment decision reaching down into an ML config line.

WebGPU gets requested when it exists and is not trusted:

```ts
// apps/web/app/composables/useInpaint.ts
const useWebGpu = typeof navigator !== "undefined" && "gpu" in navigator;
try {
  return await ort.InferenceSession.create(modelBuffer, {
    executionProviders: useWebGpu ? ["webgpu", "wasm"] : ["wasm"]
  });
} catch {
  // WebGPU can fail to initialise on some drivers - fall back to WASM.
  return ort.InferenceSession.create(modelBuffer, { executionProviders: ["wasm"] });
}
```

Feature detection tells you the API exists. It does not tell you the driver underneath it works.

## What it actually costs

Measured in headless Chromium on a Linux server, cold cache, real model, real CDN, `navigator.deviceMemory` reporting 8 GB. `"gpu" in navigator` was true and session creation didn't throw, but ONNX Runtime dispatches per operator, so I can't claim which provider ran which kernel.

Cold start to a usable session:

| Phase                             |     Time |
| --------------------------------- | -------: |
| Import the ORT loader from CDN    |   130 ms |
| Download the model (28,079,181 B) | 1,874 ms |
| `InferenceSession.create`         | 1,720 ms |
| Total                             | 3,724 ms |

That 1,874 ms is a datacentre link. On a 20 Mbps connection the same download is around 11 seconds, which is the number that matters for a real first visit  -  and the reason the Cache Storage write earns its complexity.

Then inference, first run and steady state:

| Input               | Megapixels |             Time |
| ------------------- | ---------: | ---------------: |
| 512×512 (first run) |       0.26 |         4,621 ms |
| 512×512             |       0.26 | 1,999 / 1,882 ms |
| 1024×1024           |       1.05 | 1,938 / 1,915 ms |
| 1600×1200           |       1.92 | 1,956 / 1,964 ms |
| 2048×1536           |       3.15 |         1,981 ms |

Inference costs about 1.95 seconds regardless of input resolution. Twelve times the pixels, five percent more time. The first run carries roughly 2.4 s of extra warm-up and then it's flat.

That flatness is the code comment being right about something I'd only read secondhand. MI-GAN's pipeline crops and resizes around the mask internally, so the work it does is a function of the masked region, not of the image you handed it. Practically: I don't need to downscale big images before inference, and a progress bar that scales with megapixels would be lying.

## The number I got wrong

While measuring the model I audited its sibling. The background remover wraps `@imgly/background-removal`, and my own comment above it says this:

```ts
// apps/web/app/composables/useBackgroundRemoval.ts
/**
 * Wraps `@imgly/background-removal` (AGPL, same as this repo). The library and
 * its ~40MB ONNX weights are imported lazily on first use so they never enter
 * the SSR bundle, and are cached by the browser after the first download.
 */
```

The call site passes no `model` option, so the library's own default applies. I resolved the library's asset manifest at version 1.7.0 and summed the chunk offsets:

| Model option           | Asset          |       Bytes |
| ---------------------- | -------------- | ----------: |
| `large`                | `isnet`        | 176,149,806 |
| `medium` (the default) | `isnet_fp16`   |  88,152,708 |
| `small`                | `isnet_quint8` |  44,348,940 |

The default is 88,152,708 bytes  -  84.1 MiB  -  not "~40 MB". Add the ONNX Runtime wasm the library pulls from its own CDN and a first background-removal run downloads roughly 100–111 MB. The "~40 MB" figure matches the _small_ model, which the app does not select.

I wrote that comment. It was wrong by more than a factor of two for the entire life of the feature, and it stayed wrong because a documented number costs nothing to write and nothing to be wrong about until someone checks it. Two things follow: the comment gets fixed, and `model: "small"` at 44,348,940 bytes goes on the list to evaluate against output quality, because halving a first-run download is worth an afternoon of looking at cutouts.

The inpainting side survives the same audit  -  28,079,181 bytes is what `content-length` says and what the progress bar counts to  -  but only because I checked, not because I remembered.

You can try the watermark remover at [onotoolkit.irfankurniawan.com/tools/watermark-remover](https://onotoolkit.irfankurniawan.com/tools/watermark-remover). The pixel guarantee is in [`utils/image.ts`](https://github.com/prostiate/onotoolkit/blob/main/apps/web/app/utils/image.ts) and the ONNX plumbing is in [`useInpaint.ts`](https://github.com/prostiate/onotoolkit/blob/main/apps/web/app/composables/useInpaint.ts). Paint over something, and check the rest of the file against the original if you like  -  that's the point of doing it this way.
