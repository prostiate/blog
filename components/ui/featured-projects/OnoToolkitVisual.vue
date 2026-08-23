<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ProjectXray from './ProjectXray.vue'

const productAvailable = ref(true)
const isMobile = ref(false)
let mobileQuery: MediaQueryList | null = null

function updateMobileLayout() {
  isMobile.value = mobileQuery?.matches ?? false
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 639px)')
  updateMobileLayout()
  mobileQuery.addEventListener('change', updateMobileLayout)
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', updateMobileLayout)
})
</script>

<template>
  <ProjectXray
    label="OnoToolkit browser-local processing architecture"
    :product-available="productAvailable"
  >
    <template #product>
      <div class="product-scene">
        <img
          src="/assets/projects/onotoolkit-showcase.webp"
          alt="OnoToolkit browser tools home screen"
          class="product-image"
          @error="productAvailable = false"
        />
      </div>
    </template>

    <template #architecture>
      <div class="architecture-scene ono-architecture">
        <p class="sr-only">
          Local file to WebGPU / WASM to Canvas output to Download. IndexedDB stores browser-local
          application data.
        </p>
        <svg
          v-if="!isMobile"
          class="architecture-lines ono-lines--desktop"
          viewBox="0 0 600 300"
          aria-hidden="true"
          data-layout="desktop"
        >
          <defs>
            <marker id="ono-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path data-edge="local-to-wasm" d="M125 100 H220" marker-end="url(#ono-arrow)" />
          <path data-edge="wasm-to-canvas" d="M275 100 H370" marker-end="url(#ono-arrow)" />
          <path data-edge="canvas-to-download" d="M425 100 H520" marker-end="url(#ono-arrow)" />
          <path data-edge="wasm-to-indexeddb" d="M225 130 V215" marker-end="url(#ono-arrow)" />
        </svg>
        <svg
          v-else
          class="architecture-lines ono-lines--mobile"
          viewBox="0 0 400 340"
          aria-hidden="true"
          data-layout="mobile"
        >
          <defs>
            <marker
              id="ono-mobile-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <g data-layer="connectors">
            <path data-edge="local-to-wasm" d="M95 70 V100" marker-end="url(#ono-mobile-arrow)" />
            <path data-edge="wasm-to-canvas" d="M95 150 V180" marker-end="url(#ono-mobile-arrow)" />
            <path
              data-edge="canvas-to-download"
              d="M95 230 V260"
              marker-end="url(#ono-mobile-arrow)"
            />
            <path
              data-edge="wasm-to-indexeddb"
              d="M170 125 H220"
              marker-end="url(#ono-mobile-arrow)"
            />
          </g>
          <g data-layer="nodes">
            <g class="mobile-node" data-node="local-file">
              <rect
                x="20"
                y="20"
                width="150"
                height="50"
                rx="10"
                fill="var(--bg-surface)"
                fill-opacity="1"
              />
              <text x="95" y="45">Local file</text>
            </g>
            <g class="mobile-node mobile-node--accent" data-node="webgpu-wasm">
              <rect
                x="20"
                y="100"
                width="150"
                height="50"
                rx="10"
                fill="var(--bg-surface)"
                fill-opacity="1"
              />
              <text x="95" y="125">WebGPU / WASM</text>
            </g>
            <g class="mobile-node" data-node="canvas-output">
              <rect
                x="20"
                y="180"
                width="150"
                height="50"
                rx="10"
                fill="var(--bg-surface)"
                fill-opacity="1"
              />
              <text x="95" y="205">Canvas output</text>
            </g>
            <g class="mobile-node" data-node="download">
              <rect
                x="20"
                y="260"
                width="150"
                height="50"
                rx="10"
                fill="var(--bg-surface)"
                fill-opacity="1"
              />
              <text x="95" y="285">Download</text>
            </g>
            <g class="mobile-node" data-node="indexeddb">
              <rect
                x="220"
                y="100"
                width="150"
                height="50"
                rx="10"
                fill="var(--bg-surface)"
                fill-opacity="1"
              />
              <text x="295" y="125">IndexedDB</text>
            </g>
          </g>
        </svg>
        <div v-if="!isMobile" class="ono-flow" aria-hidden="true">
          <span class="scene-node">Local file</span>
          <span class="scene-node scene-node--accent">WebGPU / WASM</span>
          <span class="scene-node">Canvas output</span>
          <span class="scene-node">Download</span>
          <span class="scene-node ono-indexeddb">IndexedDB</span>
        </div>
        <p class="architecture-caption" aria-hidden="true">Files stay on this device</p>
      </div>
    </template>
  </ProjectXray>
</template>

<style scoped>
.product-scene,
.architecture-scene {
  height: 100%;
  min-height: 0;
}

.product-scene {
  display: grid;
  place-items: center;
  background: #0a1b2d;
}

.product-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
}

.architecture-scene {
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem 1rem;
  background: var(--bg-code);
  color: var(--text-primary);
}

.architecture-lines {
  position: absolute;
  inset: 1rem;
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  overflow: visible;
  fill: none;
  stroke: #22c55e;
  stroke-width: 2;
}

.architecture-lines marker path {
  fill: #22c55e;
}

.mobile-node rect {
  fill: var(--bg-surface);
  stroke: var(--border-medium);
  stroke-width: 1;
}

.mobile-node text {
  fill: var(--text-primary);
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  text-anchor: middle;
  dominant-baseline: middle;
}

.mobile-node--accent rect {
  stroke: rgb(34 197 94 / 0.65);
}

.mobile-node--accent text {
  fill: #16a34a;
}

.ono-flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  align-items: start;
}

.scene-node {
  display: grid;
  min-height: 4.5rem;
  place-items: center;
  border: 1px solid var(--border-medium);
  border-radius: 0.75rem;
  background: var(--bg-surface);
  padding: 0.75rem;
  text-align: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1.25;
}

.scene-node--accent {
  border-color: rgb(34 197 94 / 0.65);
  color: #16a34a;
}

.ono-indexeddb {
  grid-column: 2 / span 2;
  margin-top: 3.5rem;
}

.architecture-caption {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  margin: 0;
  color: #16a34a;
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
