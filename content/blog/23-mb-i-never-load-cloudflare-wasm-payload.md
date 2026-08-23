---
title: "23 MB I Never Load: What Shipping Ghostscript and ONNX to Cloudflare Costs"
description: "The largest file in my production build was one the app never requests. A 14-line Rollup plugin deleted it and cut the client payload by 45.7 percent."
date: "2026-08-15"
readTime: "8 min read"
tags: ["Cloudflare","Frontend","Nuxt"]
status: "PUBLISHED"
featured: true
---

The largest file in my production build was one the application never requests. It was 23,013,109 bytes. Deleting it cut the deployed client payload by 45.7%.

That's the headline, and the rest of this post is what a build looks like when twenty browser tools with no server have to fit inside Cloudflare Workers. Everything below is a number I got by running a build, twice, with one plugin toggled. The site is [Ono Toolkit](https://onotoolkit.irfankurniawan.com) and the build config is [`apps/web/nuxt.config.ts`](https://github.com/prostiate/onotoolkit/blob/main/apps/web/nuxt.config.ts).

## What "runs in your browser" weighs

Nothing is uploaded, which means Ghostscript, pdf.js, ONNX Runtime and four image codecs all have to arrive as assets. A production build of `.output/public`:

| Asset                                |          Bytes | Share |
| ------------------------------------ | -------------: | ----: |
| `_nuxt/gs-*.wasm` (Ghostscript)      |     16,177,271 | 59.0% |
| jSquash codecs (7 `.wasm` files)     |      1,819,055 |  6.6% |
| `_nuxt/pdf.worker.min-*.js` (pdf.js) |      1,165,229 |  4.3% |
| all `.wasm`                          |     17,996,326 | 65.7% |
| all `.js`                            |      8,017,700 | 29.3% |
| all `.mjs`                           |        785,943 |  2.9% |
| **`.output/public` total**           | **27,396,717** |  100% |

The server bundle is 6.53 MB (1.86 MB gzipped).

Two-thirds of what I ship is WebAssembly, and Ghostscript alone is 59% of it. Nobody downloads 27 MB  -  these are lazy chunks, and a visitor who formats some JSON fetches none of them. But the total is the wrong number to watch anyway. Cloudflare's constraint is **per asset**, so the file that can break a deploy is the biggest single one, not the sum.

Which is how I ended up looking closely at a file I'd never asked for.

## The asset nobody downloads

ONNX Runtime Web references its `.wasm` binaries the idiomatic way:

```js
new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url);
```

Vite understands that pattern. It resolves the URL at build time and copies the target into the output directory, because that's what the pattern means  -  the file is a build-time asset dependency of the module.

The problem is that my app doesn't load the runtime from there. It loads it from a pinned jsDelivr URL, set on `ort.env.wasm.wasmPaths`, because the wasm has to be ABI-matched to the exact `onnxruntime-web` dev build the app depends on. So Vite dutifully emits multi-megabyte binaries that no code path will ever request. Importing lazily does not help: lazy import controls when the _module_ is fetched, not whether its declared assets are emitted.

Fourteen lines of Rollup plugin fix it:

```ts
// apps/web/nuxt.config.ts
function dropOnnxWasm(): BundleDropPlugin {
  return {
    name: "ono-drop-onnx-wasm",
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (fileName.includes("ort-wasm") && fileName.endsWith(".wasm")) {
          Reflect.deleteProperty(bundle, fileName);
        }
      }
    }
  };
}
```

`generateBundle` runs after Rollup has decided everything it will emit and before anything is written. The `bundle` argument is a plain object keyed by output filename, so removing an output is `delete`. There is no clever API here and that's the appeal  -  it's a filter over a map, registered as `vite.plugins`.

To find out what it was actually worth, I built the app twice, identically, with the plugin registered and then not:

|                     | Client `.output/public` | Largest single asset                                          |
| ------------------- | ----------------------: | ------------------------------------------------------------- |
| Plugin on (shipped) |            27,396,717 B | `gs.wasm`  -  16,177,271 B (15.43 MiB)                          |
| Plugin off          |            50,409,826 B | `ort-wasm-simd-threaded.jsep.wasm`  -  23,013,109 B (21.95 MiB) |
| Difference          |  −23,013,109 B (−45.7%) |                                                               |

Nearly half the client payload was one unreferenced file.

### The part where my own comment is wrong

The comment sitting above that function in my repo today says the ORT wasm is "25.6MB, over Cloudflare's 25MiB per-asset limit (deploy would fail)".

The emitted file is 21.95 MiB. That is _under_ the 25 MiB limit, and only the `jsep` variant gets emitted, not the plain build alongside it. At the version I have pinned, removing this plugin would not fail the deploy. Either that 25.6 MB came from a different ORT release or from a file I was no longer emitting by the time I wrote it down.

I'm keeping the plugin and rewriting the comment, because the measured justification is the better one: 23 MB of assets the app never requests, 46% of the client payload, and a margin against a hard platform limit that I would rather not spend on dead weight. "Deploy would fail" is a scarier sentence and a worse reason, and it had the specific failure mode of being unfalsifiable until someone tried it.

## The build that ran out of memory

Before any of that, the build simply stopped working. Cloudflare's build container died with "JavaScript heap out of memory" while generating source maps.

The fix is one line:

```ts
// apps/web/nuxt.config.ts
// Source maps for the heavy client-only ML/codec chunks roughly double build
// memory and are unnecessary in production - disabling them keeps the Nitro
// Cloudflare build within the build container's memory limit.
sourcemap: false,
```

Source maps are proportional to the code they map, and a 16 MB Ghostscript build plus seven codec modules plus an ONNX runtime is a lot of code to map. The commit that shipped this reproduced the OOM locally under a constrained 1.6 GB heap first, which is the part I'd repeat  -  an OOM you can only observe in someone else's CI is an OOM you fix by guessing. It reported server output dropping from 7.9 MB to 6.3 MB; my build today measures 6.53 MB, consistent with 6.3 MB plus the tools added since.

I lose production stack traces. For a client-side toolkit with no error reporting service that was never much of a loss, but it is a real one and it's the trade.

## Two smaller scars

```ts
// apps/web/nuxt.config.ts  -  trimmed (surrounding config keys removed)
export default defineNuxtConfig({
  nitro: {
    // Cloudflare Workers support modern JS; pin esbuild to es2022 so BigInt
    // literals in dependencies (e.g. Nuxt UI's useFieldGroup) aren't flagged as
    // unsupported for the default es2019 target during the Worker build.
    esbuild: {
      options: {
        target: "es2022"
      }
    }
  }
});
```

esbuild's default target for the Worker build is es2019, which predates BigInt literals. A dependency used one. The runtime supports it fine; only the transpiler disagreed.

And the six libraries Vite is told not to pre-bundle in dev:

```ts
// apps/web/nuxt.config.ts  -  trimmed (this sits under `vite`)
const optimizeDeps = {
  exclude: [
    "onnxruntime-web",
    "@imgly/background-removal",
    "@jsquash/jpeg",
    "@jsquash/webp",
    "@jsquash/oxipng",
    "konva"
  ]
};
```

These are browser-only and dynamically imported. Letting Vite's dependency optimiser pre-bundle them means paying for them on every dev server cold start regardless of which tool you're working on.

## The header I don't set decides a line of ML config

Production sends no COOP or COEP headers. There is no `Cross-Origin-Embedder-Policy` string anywhere in the app or the Cloudflare config, and the generated `_headers` file contains only cache-control rules.

So `crossOriginIsolated` is false in the browser. Which means no `SharedArrayBuffer`. Which means:

- jSquash falls back to its non-parallel oxipng build, so PNG optimisation is single-threaded.
- ONNX Runtime's `ort.env.wasm.numThreads = 1` isn't a conservative default I chose. It's the only value that can work.

I could set those headers. COEP would then require every cross-origin resource  -  including the jsDelivr runtime and the Hugging Face model download  -  to opt in with CORP or CORS headers I don't control. That's the real trade, and until I need the threads I'm not making it. What I like about this chain is how far it reaches: a decision about response headers on a static host ends up as an integer in a machine-learning config object three layers down.

## The licence, since it's a consequence of the same choices

Ghostscript is AGPL-3.0. `@imgly/background-removal` is AGPL-3.0. Bundling and serving both means the whole distributed app is AGPL-3.0. That wasn't a preference; it's what shipping those two binaries to a browser entails. If you fork it and host a modified version, you owe your users the source.

## Reproduce it

```bash
pnpm build
du -sb apps/web/.output/public
find apps/web/.output/public -name '*.wasm' -printf '%s\t%p\n' | sort -rn | head
```

Then comment out `dropOnnxWasm()` from `vite.plugins` in `apps/web/nuxt.config.ts` and run it again. The 23 MB difference shows up as one file.

The thing I'd hand to someone else from this is narrow: `new URL(..., import.meta.url)` is a build-time asset declaration, not a runtime fetch, and no amount of lazy importing will stop a bundler from emitting what it declares. If you load a dependency's binaries from a CDN instead, you are shipping them twice until you go and look.

I'm still carrying 16 MB of Ghostscript, and I don't have a way around that one  -  it's the thing doing the work, and a per-asset limit I'm currently 9 MiB clear of is the sort of margin that gets eaten by a dependency upgrade I didn't read carefully.

Source: [github.com/prostiate/onotoolkit](https://github.com/prostiate/onotoolkit). The tools: [onotoolkit.irfankurniawan.com](https://onotoolkit.irfankurniawan.com).
