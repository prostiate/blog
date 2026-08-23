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
        <svg class="architecture-lines" viewBox="0 0 600 220" aria-hidden="true">
          <defs>
            <marker id="pg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path d="M105 110 H140" marker-end="url(#pg-arrow)" />
          <path d="M225 110 H260" marker-end="url(#pg-arrow)" />
          <path d="M345 110 H380" marker-end="url(#pg-arrow)" />
          <path d="M465 110 H500" marker-end="url(#pg-arrow)" />
        </svg>
        <div class="pg-flow">
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
  .pg-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pg-flow .scene-node:last-child {
    grid-column: 1 / -1;
  }
}
</style>
