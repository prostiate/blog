<script setup lang="ts">
import { ref } from 'vue'
import ProjectXray from './ProjectXray.vue'

const productAvailable = ref(true)
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
        <svg class="architecture-lines ono-lines--desktop" viewBox="0 0 600 300" aria-hidden="true">
          <defs>
            <marker id="ono-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path data-edge="local-to-wasm" d="M125 100 H220" marker-end="url(#ono-arrow)" />
          <path data-edge="wasm-to-canvas" d="M275 100 H370" marker-end="url(#ono-arrow)" />
          <path data-edge="canvas-to-download" d="M425 100 H520" marker-end="url(#ono-arrow)" />
          <path data-edge="wasm-to-indexeddb" d="M300 130 V215" marker-end="url(#ono-arrow)" />
        </svg>
        <svg class="architecture-lines ono-lines--mobile" viewBox="0 0 400 360" aria-hidden="true">
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
          <path data-edge="local-to-wasm" d="M140 85 H260" marker-end="url(#ono-mobile-arrow)" />
          <path
            data-edge="wasm-to-canvas"
            d="M300 115 L100 180"
            marker-end="url(#ono-mobile-arrow)"
          />
          <path
            data-edge="canvas-to-download"
            d="M140 210 H260"
            marker-end="url(#ono-mobile-arrow)"
          />
          <path
            data-edge="wasm-to-indexeddb"
            d="M300 115 L200 285"
            marker-end="url(#ono-mobile-arrow)"
          />
        </svg>
        <div class="ono-flow" aria-hidden="true">
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
  min-height: 19rem;
}

.product-scene {
  display: grid;
  place-items: center;
  background: var(--bg-canvas);
}

.product-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 19rem;
  object-fit: cover;
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

.ono-lines--mobile {
  display: none;
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

@media (max-width: 639px) {
  .ono-lines--desktop {
    display: none;
  }

  .ono-lines--mobile {
    display: block;
  }

  .ono-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(3, 4.5rem);
    gap: 0.75rem 0.5rem;
  }

  .ono-indexeddb {
    grid-column: 1 / -1;
    margin-top: 0;
  }
}
</style>
