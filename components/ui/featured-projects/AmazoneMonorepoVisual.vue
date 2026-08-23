<script setup lang="ts">
import ProjectXray from './ProjectXray.vue'
</script>

<template>
  <ProjectXray label="Amazone monorepo shared layer architecture">
    <template #product>
      <div class="product-scene app-scene">
        <p class="sr-only">Six abstract production application shells.</p>
        <div v-for="app in 6" :key="app" class="app-window">
          <span class="app-window__bar" aria-hidden="true"><i /><i /><i /></span>
          <span>App {{ app }}</span>
        </div>
        <p class="product-caption">6 production apps</p>
      </div>
    </template>

    <template #architecture>
      <div class="architecture-scene amazone-architecture">
        <p class="sr-only">
          Backoffice, Auth Login, and Cashier connect to @amazone/base. The shared layer provides 27
          components, 8 composables, and 10 utilities, which support a parameterized Docker build.
        </p>
        <svg class="architecture-lines" viewBox="0 0 600 350" aria-hidden="true">
          <defs>
            <marker
              id="amazone-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path d="M100 85 L300 145" marker-end="url(#amazone-arrow)" />
          <path d="M300 85 V145" marker-end="url(#amazone-arrow)" />
          <path d="M500 85 L300 145" marker-end="url(#amazone-arrow)" />
          <path d="M300 190 L100 235" marker-end="url(#amazone-arrow)" />
          <path d="M300 190 V235" marker-end="url(#amazone-arrow)" />
          <path d="M300 190 L500 235" marker-end="url(#amazone-arrow)" />
          <path d="M300 280 V315" marker-end="url(#amazone-arrow)" />
        </svg>
        <div class="amazone-flow">
          <span class="scene-node">Backoffice</span>
          <span class="scene-node">Auth Login</span>
          <span class="scene-node">Cashier</span>
          <span class="scene-node scene-node--accent shared-layer">@amazone/base</span>
          <span class="scene-node">27 components</span>
          <span class="scene-node">8 composables</span>
          <span class="scene-node">10 utilities</span>
          <span class="scene-node docker-build">Parameterized Docker build</span>
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

.app-scene {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  align-content: center;
  padding: 2rem;
  background: var(--bg-canvas);
}

.app-window {
  display: grid;
  min-height: 5.5rem;
  align-content: center;
  gap: 1rem;
  border: 1px solid var(--border-medium);
  border-radius: 0.75rem;
  background: var(--bg-surface);
  padding: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
}

.app-window__bar {
  display: flex;
  gap: 0.25rem;
}

.app-window__bar i {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--border-medium);
}

.product-caption {
  grid-column: 1 / -1;
  margin: 0.25rem 0 0;
  color: #16a34a;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.architecture-scene {
  position: relative;
  overflow: hidden;
  padding: 1.25rem;
  background: var(--bg-code);
  color: var(--text-primary);
}

.architecture-lines {
  position: absolute;
  inset: 1.25rem;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
  overflow: visible;
  fill: none;
  stroke: #22c55e;
  stroke-width: 2;
}

.architecture-lines marker path {
  fill: #22c55e;
}

.amazone-flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem 0.5rem;
}

.scene-node {
  display: grid;
  min-height: 3.75rem;
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

.shared-layer,
.docker-build {
  grid-column: 1 / -1;
}

@media (max-width: 639px) {
  .app-scene {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 1rem;
  }

  .amazone-flow {
    gap: 0.75rem 0.375rem;
  }

  .scene-node {
    font-size: 0.6875rem;
  }
}
</style>
