<script setup lang="ts">
import { ref } from 'vue'
import ProjectXray from './ProjectXray.vue'

const productAvailable = ref(true)
</script>

<template>
  <ProjectXray
    label="pg-client-mobile SQL workflow architecture"
    :product-available="productAvailable"
  >
    <template #product>
      <div class="product-scene">
        <img
          src="/assets/projects/pg-client-mobile-showcase.webp"
          alt="pg-client-mobile SQL editor and command menu"
          class="product-image"
          @error="productAvailable = false"
        />
      </div>
    </template>

    <template #architecture>
      <div class="architecture-scene pg-architecture">
        <p class="sr-only">
          Connection to Object browser to SQL editor to Shortcut guard to Results and logs.
        </p>
        <svg
          class="architecture-lines pg-lines--desktop"
          viewBox="0 0 600 220"
          aria-hidden="true"
          data-layout="desktop"
        >
          <defs>
            <marker id="pg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path data-edge="connection-to-browser" d="M105 110 H140" marker-end="url(#pg-arrow)" />
          <path data-edge="browser-to-editor" d="M225 110 H260" marker-end="url(#pg-arrow)" />
          <path data-edge="editor-to-guard" d="M345 110 H380" marker-end="url(#pg-arrow)" />
          <path data-edge="guard-to-results" d="M465 110 H500" marker-end="url(#pg-arrow)" />
        </svg>
        <svg
          class="architecture-lines pg-lines--mobile"
          viewBox="0 0 400 280"
          aria-hidden="true"
          data-layout="mobile"
        >
          <defs>
            <marker
              id="pg-mobile-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path
            data-edge="connection-to-browser"
            d="M170 42 H230"
            marker-end="url(#pg-mobile-arrow)"
          />
          <path data-edge="browser-to-editor" d="M305 65 V105" marker-end="url(#pg-mobile-arrow)" />
          <path data-edge="editor-to-guard" d="M230 127 H170" marker-end="url(#pg-mobile-arrow)" />
          <path data-edge="guard-to-results" d="M95 150 V190" marker-end="url(#pg-mobile-arrow)" />
          <g class="mobile-node" data-node="connection">
            <rect x="20" y="20" width="150" height="45" rx="10" />
            <text x="95" y="42">Connection</text>
          </g>
          <g class="mobile-node" data-node="object-browser">
            <rect x="230" y="20" width="150" height="45" rx="10" />
            <text x="305" y="42">Object browser</text>
          </g>
          <g class="mobile-node" data-node="sql-editor">
            <rect x="230" y="105" width="150" height="45" rx="10" />
            <text x="305" y="127">SQL editor</text>
          </g>
          <g class="mobile-node mobile-node--accent" data-node="shortcut-guard">
            <rect x="20" y="105" width="150" height="45" rx="10" />
            <text x="95" y="127">Shortcut guard</text>
          </g>
          <g class="mobile-node" data-node="results-and-logs">
            <rect x="20" y="190" width="360" height="45" rx="10" />
            <text x="200" y="212">Results and logs</text>
          </g>
        </svg>
        <div class="pg-flow" aria-hidden="true">
          <span class="scene-node">Connection</span>
          <span class="scene-node">Object browser</span>
          <span class="scene-node">SQL editor</span>
          <span class="scene-node scene-node--accent">Shortcut guard</span>
          <span class="scene-node">Results and logs</span>
        </div>
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
  object-position: top;
}

.architecture-scene {
  position: relative;
  display: grid;
  align-content: center;
  overflow: hidden;
  padding: 2rem 1rem;
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
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: middle;
}

.mobile-node--accent rect {
  stroke: rgb(34 197 94 / 0.65);
}

.mobile-node--accent text {
  fill: #16a34a;
}

.pg-lines--mobile {
  display: none;
}

.pg-flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}

.scene-node {
  display: grid;
  min-height: 5rem;
  place-items: center;
  border: 1px solid var(--border-medium);
  border-radius: 0.75rem;
  background: var(--bg-surface);
  padding: 0.625rem;
  text-align: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1.25;
}

.scene-node--accent {
  border-color: rgb(34 197 94 / 0.65);
  color: #16a34a;
}

@media (max-width: 639px) {
  .pg-lines--desktop {
    display: none;
  }

  .pg-lines--mobile {
    display: block;
  }

  .pg-flow {
    display: none;
  }
}
</style>
