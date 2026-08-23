---
title: "One Canvas, Two Frozen Tracks: A Screen Recorder That Changes Its Mind Mid-Recording"
description: "MediaRecorder will not let you swap tracks mid-session, so I stopped swapping them. The design, the four bugs it caused, and the four benchmarks that priced it."
date: "2026-08-15"
readTime: "17 min read"
tags: ["Architecture","Frontend","Nuxt"]
status: "PUBLISHED"
featured: true
---

I wanted a screen recorder where the decision you make at the start isn't binding. Start recording your camera, realise two minutes in that you need to show your terminal, and just… add the screen. Start a screen recording, decide you want your face in the corner after all, and drop the webcam in. Draw an arrow on the thing you're talking about, and have that arrow be _in the video_, not in some sidecar file.

The browser's recording API does not want you to do this. `MediaRecorder` takes a `MediaStream` when you construct it and encodes whatever tracks that stream had. There is no supported way to say "from now on, encode this other camera instead". If you want a different composition, the obvious move is to stop, rebuild, and start again  -  two files, a visible seam, a lost thought.

So I stopped trying to reconfigure the recorder. I gave it two tracks that never change for the entire session, and made every feature a change to what happens _behind_ those tracks.

This is the design, the four bugs it caused, and the four benchmarks I ran to find out what it costs. The tool is [Ono Toolkit's Screen Recorder](https://onotoolkit.irfankurniawan.com/tools/screen-recorder); the source is [on GitHub](https://github.com/prostiate/onotoolkit) under AGPL-3.0. Nothing is uploaded  -  that constraint is why all of this had to happen in the browser in the first place.

## The two tracks

Here is the encoder setup. It runs once, and nothing in it is ever touched again.

```ts
// apps/web/app/composables/useScreenRecorder.ts  -  trimmed (event listeners removed)
setAudioSources({ micStream: options.micStream, tabStream: options.tabStream });
const audioTrack = audioDestination?.stream.getAudioTracks()[0] ?? null;

// Prime the first frame before capturing so the stream never starts black.
draw();

const canvasStream = canvas.captureStream(frameRate);
const videoTrack = canvasStream.getVideoTracks()[0];
const recordingStream = new MediaStream(
  videoTrack ? [videoTrack, ...(audioTrack ? [audioTrack] : [])] : []
);

recorder = new MediaRecorder(recordingStream, {
  mimeType: mime.mimeType,
  videoBitsPerSecond: recorderBitrate(resolution)
});
recorder.start(1000);
```

Two tracks:

- **Video** comes from `canvas.captureStream()`. Not from the screen. Not from the camera. From a `<canvas>` I paint every frame.
- **Audio** comes from a `MediaStreamAudioDestinationNode`  -  a Web Audio sink. Not from the microphone. Not from the tab. From a mixing bus I connect sources into.

Both are indirections, and both are the whole trick. `MediaRecorder` sees a canvas and a bus. It has no idea the canvas started showing a camera and now shows a screen, or that a microphone joined the bus ninety seconds in.

```text
      display stream ──┐
      camera stream ───┼── drawImage ──►  <canvas>  ──captureStream──►  video track ──┐
  annotation strokes ──┘                                                              │
                                                                                      ├──►  MediaRecorder  ──►  Blob  ──►  IndexedDB library
          microphone ──┐                                                              │
           tab audio ──┴── connect ────►  AudioDestinationNode  ────────►  audio track ┘
```

Everything to the left of the two track arrows is hot-swappable. Everything to the right is frozen.

## Swapping the screen while recording

`bindDisplay` makes "add screen" work. Its parameter is nullable, so removing the screen is the same operation as adding one.

```ts
// apps/web/app/composables/useScreenRecorder.ts
async function bindDisplay(stream: MediaStream | null): Promise<void> {
  if (displayTrack) displayTrack.removeEventListener("ended", onScreenEnded);
  if (displayStream && displayStream !== stream) {
    for (const track of displayStream.getVideoTracks()) track.stop();
  }
  displayStream = stream;
  hasDisplay = stream !== null;
  if (!stream) {
    displayVideo.srcObject = null;
    displayTrack = null;
    sizeCanvasFromCamera();
    return;
  }
  displayVideo.srcObject = stream;
  void displayVideo.play().catch(() => undefined);
  displayTrack = stream.getVideoTracks()[0] ?? null;
  if (displayTrack) displayTrack.addEventListener("ended", onScreenEnded);
  await awaitPlayable(displayVideo);
  sizeCanvasFromDisplay();
}
```

The stream goes into an off-DOM `<video>` that exists only to be a `drawImage` source. That `ended` listener is how the browser's own "Stop sharing" bar reaches my state machine  -  the user can end a recording from browser chrome I don't control, and the session has to notice.

The audio side is a set diff:

```ts
// apps/web/app/composables/useScreenRecorder.ts
function setAudioSources(sources: {
  micStream: MediaStream | null;
  tabStream: MediaStream | null;
}): void {
  const wanted = new Set(
    [sources.micStream, sources.tabStream].filter((s): s is MediaStream => s !== null)
  );
  for (const [stream, node] of audioSourceNodes) {
    if (!wanted.has(stream)) {
      node.disconnect();
      audioSourceNodes.delete(stream);
    }
  }
  for (const stream of wanted) connectAudioSource(stream);
}
```

`audioDestination` is created once and never replaced, so the recorded audio track survives every connect and disconnect.

Put together, adding a screen to a camera-only recording is about fifteen lines:

```ts
// apps/web/app/stores/screenRecorder.ts  -  trimmed (try/catch removed)
const displayStream = await devices.getDisplayMedia({
  video: { frameRate: { ideal: this.settings.frameRate } },
  audio: this.settings.systemAudio
});
this.session.setDisplayStream(markRaw(displayStream));
this.displayActive = true;
// The camera now becomes a picture-in-picture overlay on top of the screen.
this.overlayVisible = this.cameraStream !== null;
this.session.setOverlayEnabled(this.overlayVisible);
this.session.setAudioSources({
  micStream: this.settings.micOn ? this.micStream : null,
  tabStream: this.settings.systemAudio ? displayStream : null
});
```

`markRaw` is not decoration. A `MediaStream` wrapped in a Vue reactive proxy is a `MediaStream` that will eventually misbehave in a way you'll spend an evening on.

## The compositor is one function, and it is dumb on purpose

```ts
// apps/web/app/composables/useScreenRecorder.ts
function draw(): void {
  if (paused || disposed) return;
  frameHandle = requestAnimationFrame(draw);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (hasDisplay && displayVideo.readyState >= 2) {
    ctx.drawImage(displayVideo, 0, 0, canvas.width, canvas.height);
  } else if (!hasDisplay && cameraVideo && cameraVideo.readyState >= 2) {
    // Camera-only: the webcam fills the whole frame.
    drawVideoCover(ctx, cameraVideo, 0, 0, canvas.width, canvas.height);
  }

  // Webcam picture-in-picture only makes sense when a screen is the base.
  if (hasDisplay && overlayEnabled && cameraVideo && cameraVideo.readyState >= 2) {
    const rect = denormalizeRect(live.overlayRect(), canvas.width, canvas.height);
    ctx.save();
    applyShapeClip(ctx, live.overlayShape(), rect.x, rect.y, rect.width, rect.height);
    drawVideoCover(ctx, cameraVideo, rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  }

  for (const stroke of live.annotations()) {
    drawAnnotation(ctx, stroke, canvas.width, canvas.height);
  }
}
```

No state machine, no dirty tracking, no diffing. Every frame is rebuilt from whatever the sources currently are. That is what makes mid-session source swaps free: there is no cached composition to invalidate. It is also, as I'll show with numbers further down, the single worst performance decision in the file.

### The seam between a reactive store and a 60 Hz loop

`live` is the decision I'd repeat. The engine doesn't import the Pinia store and doesn't subscribe to anything. It receives four getters and calls them every frame:

```ts
// apps/web/app/types/screenRecorder.ts  -  trimmed (doc comments removed)
export interface RecorderLiveState {
  overlayEnabled: () => boolean;
  overlayRect: () => NormalizedRect;
  overlayShape: () => WebcamShape;
  annotations: () => AnnotationStroke[];
}
```

A render loop running 60 times a second and a reactivity system that wants to schedule updates are not natural allies. Subscribing means every pointermove during a webcam drag becomes a watcher firing, a re-render, and a message into the engine. Polling means the drag writes to the store at whatever rate the pointer fires, and the engine reads the latest value once per frame and discards everything else  -  exactly the semantics you want. It also makes the engine testable and framework-free: it takes four functions, not a store.

### Fractions, not pixels

The webcam rectangle and every annotation point are fractions of the canvas, `0..1`  -  and so is stroke width:

```ts
// apps/web/app/types/screenRecorder.ts
export interface AnnotationStroke {
  id: string;
  tool: AnnotationTool;
  color: string;
  /** Stroke width as a fraction of the canvas width, so it scales with output. */
  width: number;
  points: { x: number; y: number }[];
}
```

This is why the DOM overlay the user drags  -  a positioned `<div>` above the canvas  -  can be laid out in percentages and land in the same place as the composited output at any canvas size. And it's why a mid-session canvas resize doesn't drag anyone's annotations across the frame.

## Four bugs

### 1. The canvas that went black after the first frame

The webcam picture-in-picture needs a clip path to be a circle. The first version called `ctx.clip()` and then a `ctx.restore()` with no matching `ctx.save()`. On a canvas 2D context that leaves the clip region applied  -  permanently. Frame one looked right. Every frame after was drawn into a clip the size of the webcam bubble, so the recorded video was black.

The fix is the `save()`/`restore()` pair in `draw()` above, plus the unconditional black `fillRect` at the top of every frame. Canvas state is not scoped; `save()`/`restore()` must balance on every path including early returns; and a bug in frame N of a render loop is invisible until frame N+1.

### 2. The webcam preview that flashed on and immediately off

The pre-recording preview used `v-if` plus a non-standard `:src-object` binding, so any change to the stream remounted the `<video>`. Meanwhile two code paths could both call `getUserMedia`, and the second acquisition tore down the first stream while the first was still binding.

The `<video>` is now always mounted with `srcObject` set by a watcher, and acquisition got a re-entrancy guard:

```ts
// apps/web/app/stores/screenRecorder.ts  -  trimmed (constraints removed)
// Guard against overlapping acquisitions  -  the reason the preview used to
// flash on and immediately off (a second acquire tore down the first).
if (this.cameraBusy) return;
this.cameraBusy = true;
try {
  const stream = await devices.getUserMedia({/* ... */});
  this.releaseCameraStream();
  this.cameraStream = markRaw(stream);
  this.session?.setCameraStream(this.cameraStream);
  await this.loadDevices();
} finally {
  this.cameraBusy = false;
}
```

Note the ordering: acquire the new stream _first_, then release the old one. Release-then-acquire gives a visible gap, and if the acquire fails you've destroyed a working preview for nothing.

For the same reason the page keeps all three views mounted with `v-show` rather than `v-if`  -  the canvas element and the live streams have to survive the transition from setup to recording to done.

### 3. The circle that was only a circle in the video

My favourite, because both sides were individually correct.

The composited output drew a true circle: take the overlay rect, inscribe the largest centred square, draw an ellipse in it. The DOM preview drew `border-radius: 9999px` on the same rect. On a non-square rect, CSS gives you an **ellipse** filling the box. So the user dragged out a wide bubble, the preview showed a wide oval, and the video contained a circle in the middle of it. For a WYSIWYG recorder, preview and output disagreeing is the one thing that must never happen.

The fix was to stop having two implementations:

```ts
// apps/web/app/utils/screenRecorder.ts  -  trimmed (finite-number guards removed)
/** Returns the visible square used by the circle overlay inside its bounds. */
export function inscribedSquareRect(rect: OverlayRect): OverlayRect {
  const diameter = Math.min(rect.width, rect.height);
  return {
    x: rect.x + (rect.width - diameter) / 2,
    y: rect.y + (rect.height - diameter) / 2,
    width: diameter,
    height: diameter
  };
}

export function overlayShapeNormalizedRect(
  rect: NormalizedRect,
  shape: WebcamShape,
  canvasWidth: number,
  canvasHeight: number
): NormalizedRect {
  if (shape !== "circle" || canvasWidth <= 0 || canvasHeight <= 0) return rect;
  const shaped = overlayShapeRect(denormalizeRect(rect, canvasWidth, canvasHeight), shape);
  return {
    x: shaped.x / canvasWidth,
    y: shaped.y / canvasHeight,
    width: shaped.width / canvasWidth,
    height: shaped.height / canvasHeight
  };
}
```

The second function exists because normalized coordinates are _not_ aspect-preserving: equal fractions of width and height are not equal pixel counts. To convert a shape rule from normalized space to normalized space you have to round-trip through pixels  -  which means the preview must know its own pixel size, which is a `ResizeObserver` on the stage element.

The regression test pins the exact arithmetic, because "it looks round now" is not a test:

```ts
// apps/web/tests/recorderGeometry.test.ts
it("keeps circle bounds square in pixels on a widescreen canvas", () => {
  expect(
    overlayShapeNormalizedRect({ x: 0.1, y: 0.2, width: 0.4, height: 0.2 }, "circle", 1600, 900)
  ).toEqual({ x: 0.24375, y: 0.2, width: 0.1125, height: 0.2 });
});
```

Generalised: the preview and the output must share a function, not a convention. Two correct implementations of "circle" is still a bug.

### 4. Drawing mode stole the webcam

When I added the pen, drawing needed a full-stage pointer surface, so I made the webcam frame refuse drags while drawing mode was active. Wrong. Users turn the pen on, draw, then want to nudge the bubble away from what they just drew, and had to toggle drawing off to do it.

The layering already had the answer. The webcam frame sits above the drawing surface, so it can keep its own pointer events while drawing wins everywhere else. The guard came out, and the e2e test now asserts the frame is still draggable _while_ annotation mode is on.

## What it costs: four things I measured

I benchmarked my own design rather than guessing. Everything below ran in headless Chromium on a Linux server with SwiftShader software rasterisation and no GPU, so treat canvas and encode timings as a pessimistic bound. The scaling behaviour and the pass/fail verdicts hold regardless.

### Annotations are re-stroked from scratch, every frame

`draw()` loops the whole stroke list and re-issues every `lineTo` at 30 or 60 fps. There is no cached stroke layer and no cap on strokes or points  -  `extendStroke` pushes every sampled pointer position. I drove the real `drawAnnotation` on a 1920×1080 canvas with realistic 120-point pen drags, median and p95 over 30 frames after 5 warm-up frames:

|                              Strokes | Total points | Median frame | p95 frame |
| -----------------------------------: | -----------: | -----------: | --------: |
| 0 (fill + full-frame drawImage only) |            0 |       1.1 ms |    4.5 ms |
|                                    5 |          600 |       6.7 ms |   19.8 ms |
|                                   10 |        1,200 |      12.1 ms |   47.4 ms |
|                                   25 |        3,000 |      28.6 ms |   64.3 ms |
|                                   50 |        6,000 |      65.4 ms |  133.1 ms |
|                                  100 |       12,000 |     159.6 ms |  239.5 ms |
|                                  400 |       48,000 |     322.8 ms |  692.9 ms |

The base composite is essentially free at 1.1 ms. Everything after that is my annotation loop, and it's linear in total point count. The 16.6 ms budget for 60 fps goes between 5 and 10 strokes; the 33.3 ms budget for 30 fps goes between 25 and 50. On a real GPU these numbers will be better, but the curve is the curve: this design cannot survive a heavily-annotated hour-long screencast.

The fix is known and I haven't done it. Render committed strokes into an offscreen canvas once and blit that, keeping only the in-progress stroke live. That turns an O(total points) per-frame cost into O(1) plus one stroke.

### Everything is in memory until you stop

Chunks accumulate in a plain array; nothing streams to disk, and `new Blob(chunks)` at stop makes a second copy. The nominal 1080p bitrate is 8 Mbps, which is a 60 MB/minute ceiling. Measured on a busy 1920×1080 animated canvas for 20 seconds, the actual output was 5,291,644 bytes over 20.015 s  -  264 KB/s, or 15.9 MB per minute, about 2.1 Mbps against the 8 Mbps I asked for. So the ceiling is 60 MB/min and reality on this machine was a quarter of that. Either way, "no time limits" is true of the API and not of your laptop, and a `FileSystemWritableFileStream` would fix it at the cost of the no-permission-prompt property I like.

The same run turned up two things I didn't expect. `recorder.start(1000)` over 20 seconds produced 6 chunks, not 20  -  the timeslice is a hint, not a contract. And the codec probe mattered immediately:

```ts
// apps/web/app/utils/screenRecorder.ts
export const RECORDER_MIME_CANDIDATES: readonly { mimeType: string; extension: "mp4" | "webm" }[] =
  [
    { mimeType: "video/mp4;codecs=avc1,mp4a", extension: "mp4" },
    { mimeType: "video/mp4", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" }
  ];
```

On this build, `video/mp4;codecs=avc1,mp4a` reported unsupported while bare `video/mp4` reported supported, so the list falls through to candidate two. `isTypeSupported` is also called inside a try/catch because some browsers throw rather than return `false`, and there's a unit test for that, which tells you how I found out. The practical consequence is that two users can record the same session and get different container formats, and the app derives the file extension from what it actually got.

### The mid-recording resize I was worried about is fine

`bindDisplay` sets `canvas.width` and `canvas.height` while `MediaRecorder` is encoding the track captured from that canvas. I genuinely did not know whether that produced a valid file. So I tested it: record at 1280×720, resize to 1920×1080 mid-recording, record more, stop, then check the magic bytes and play it back.

| MIME                         | Track follows resize | Magic bytes | Seeks to end | Reported duration | Decoded size, start → end |
| ---------------------------- | :------------------: | ----------- | :----------: | ----------------- | ------------------------- |
| `video/mp4`                  |         yes          | `ftyp`      |     yes      | 5.967 s           | 1280×720 → 1920×1080      |
| `video/webm;codecs=vp9,opus` |         yes          | `1a45dfa3`  |     yes      | Infinity          | 1280×720 → 1920×1080      |
| `video/webm;codecs=vp8,opus` |         yes          | `1a45dfa3`  |     yes      | Infinity          | 1280×720 → 1920×1080      |

All three survive it. The `captureStream` track's `getSettings()` follows the canvas live and the decoded frame size genuinely changes mid-file. Good.

### …but WebM recordings have no duration, and that's a real bug

The same test surfaced something I wasn't looking for. Every WebM output reports `video.duration === Infinity`. This is the well-known `MediaRecorder` WebM behaviour  -  the EBML header is written before the duration is known  -  and it reproduces on both VP9 and VP8. The MP4 path reports a correct duration.

My app hides this from itself: the store computes elapsed time from its own wall clock, so the library UI shows the right length. But the file you download still carries the flaw, and on a browser without MP4 recording support that's every recording you make.

## Testing something CI cannot do

CI has no screen to share and no camera, and Playwright can't drive the OS screen picker. So the test replaces the API that opens it, before the page loads:

```ts
// tests/e2e/screen-recorder.spec.ts
Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
  configurable: true,
  value: async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    let hue = 0;
    const paint = () => {
      hue = (hue + 2) % 360;
      ctx.fillStyle = "hsl(" + hue + " 80% 50%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(paint);
    };
    paint();
    return canvas.captureStream(30);
  }
});
```

A synthetic, _animated_ display stream  -  animated so a codec that drops duplicate frames still has something to encode. Camera and microphone come from Chromium's own fakes.

The final assertion is the part I'd argue for. The test doesn't check that a success message appeared; it downloads the file the user would get and checks the container magic:

```ts
// tests/e2e/screen-recorder.spec.ts
const bytes = Buffer.concat(chunks);
expect(bytes.length).toBeGreaterThan(1_000);
const hex = bytes.subarray(0, 12).toString("hex");
// WebM starts with the EBML magic; MP4 starts with "ftyp".
expect(hex.startsWith("1a45dfa3") || bytes.subarray(4, 8).toString("ascii") === "ftyp").toBe(true);
```

There's one more I'm quietly pleased with. `navigator.mediaDevices.getUserMedia` is monkey-patched to increment `window.__cameraRequestCount` whenever the constraints ask for video, and the screen-only test asserts that count is still `0` after recording starts, then exactly `1` immediately after the user clicks "Show webcam". A privacy promise  -  "screen-only never touches your camera"  -  is exactly the kind of claim that rots silently, and it is testable.

## Where this leaves me

The indirection buys unlimited mid-session flexibility, and I'd make the trade again. What I didn't know until I measured it was the price: a per-frame redraw that falls off a cliff somewhere around ten annotation strokes, and a container that lies about its own length.

The stroke-layer fix I know how to write. The WebM duration I don't have an answer I like  -  the honest options are post-processing the EBML header in the browser or shipping a remux step, and both currently cost more than the problem does. It's a known defect, not a solved one, and it's the reason I'd rather publish my own benchmark than get the bug report.

Try it at [onotoolkit.irfankurniawan.com/tools/screen-recorder](https://onotoolkit.irfankurniawan.com/tools/screen-recorder)  -  it records locally, nothing is uploaded, and recordings stay in an on-device IndexedDB library until you delete them. The engine is 332 lines in [`useScreenRecorder.ts`](https://github.com/prostiate/onotoolkit/blob/main/apps/web/app/composables/useScreenRecorder.ts), and the geometry that took three attempts is in [`utils/screenRecorder.ts`](https://github.com/prostiate/onotoolkit/blob/main/apps/web/app/utils/screenRecorder.ts).
