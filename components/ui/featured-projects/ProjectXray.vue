<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { percentageFromPointer } from '../../../utils/xray'

const props = withDefaults(
  defineProps<{ label: string; initialPercent?: number; productAvailable?: boolean }>(),
  { initialPercent: 70, productAvailable: true }
)

const stage = ref<HTMLElement | null>(null)
const revealPercent = ref(Math.min(100, Math.max(0, props.initialPercent)))
let activePointerId: number | null = null

watch(
  () => props.productAvailable,
  (available) => {
    if (!available) revealPercent.value = 0
  },
  { immediate: true }
)

function setRevealFromPointer(clientX: number) {
  if (!stage.value || !props.productAvailable) return
  const { left, width } = stage.value.getBoundingClientRect()
  revealPercent.value = percentageFromPointer(clientX, left, width)
}

function releasePointerCapture(pointerId: number) {
  try {
    stage.value?.releasePointerCapture(pointerId)
  } catch {
    // A lost capture can already have been released by the browser.
  }
}

function finishPointer(pointerId: number) {
  if (activePointerId !== pointerId) return
  releasePointerCapture(pointerId)
  activePointerId = null
}

function onPointerDown(event: PointerEvent) {
  if (!props.productAvailable || !stage.value) return
  activePointerId = event.pointerId
  stage.value.setPointerCapture(event.pointerId)
  setRevealFromPointer(event.clientX)
}

function onPointerMove(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return
  setRevealFromPointer(event.clientX)
}

function onPointerUp(event: PointerEvent) {
  finishPointer(event.pointerId)
}

function onPointerCancel(event: PointerEvent) {
  finishPointer(event.pointerId)
}

function onSliderKeydown(event: KeyboardEvent) {
  if (!props.productAvailable) return
  const next =
    event.key === 'ArrowLeft'
      ? revealPercent.value - 5
      : event.key === 'ArrowRight'
        ? revealPercent.value + 5
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 100
            : null
  if (next === null) return
  event.preventDefault()
  revealPercent.value = Math.min(100, Math.max(0, next))
}

onBeforeUnmount(() => {
  if (activePointerId !== null) releasePointerCapture(activePointerId)
})
</script>

<template>
  <div class="project-xray" :aria-label="label">
    <div class="project-xray__controls" aria-label="Visual layer">
      <button
        type="button"
        data-layer="product"
        :disabled="!productAvailable"
        :aria-pressed="revealPercent === 100"
        :class="{ 'project-xray__control--active': revealPercent === 100 }"
        @click="revealPercent = 100"
      >
        Product
      </button>
      <button
        type="button"
        data-layer="architecture"
        :aria-pressed="revealPercent === 0"
        :class="{ 'project-xray__control--active': revealPercent === 0 }"
        @click="revealPercent = 0"
      >
        Architecture
      </button>
    </div>
    <div
      ref="stage"
      class="project-xray__stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <div class="project-xray__architecture"><slot name="architecture" /></div>
      <div
        v-if="productAvailable"
        class="project-xray__product"
        :style="{ clipPath: `inset(0 ${100 - revealPercent}% 0 0)` }"
      >
        <slot name="product" />
      </div>
      <div
        role="slider"
        tabindex="0"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="revealPercent"
        :aria-label="label"
        :aria-disabled="!productAvailable"
        class="project-xray__handle"
        :style="{ left: `${revealPercent}%` }"
        @keydown="onSliderKeydown"
      />
    </div>
  </div>
</template>

<style scoped>
.project-xray {
  display: grid;
  gap: 0.75rem;
}

.project-xray__controls {
  display: inline-flex;
  width: fit-content;
  gap: 0.25rem;
  border: 1px solid var(--border-subtle);
  border-radius: 0.625rem;
  background: var(--bg-code);
  padding: 0.25rem;
}

.project-xray__controls button {
  min-height: 2rem;
  border: 1px solid transparent;
  border-radius: 0.4375rem;
  padding: 0.375rem 0.625rem;
  color: var(--text-secondary);
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1;
}

.project-xray__controls button:hover:not(:disabled),
.project-xray__control--active {
  border-color: var(--border-medium);
  background: var(--bg-surface);
  color: var(--text-primary);
}

.project-xray__controls button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.project-xray__controls button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.project-xray__stage {
  position: relative;
  height: 19rem;
  overflow: hidden;
  touch-action: none;
}

.project-xray__architecture,
.project-xray__product {
  inset: 0;
}

.project-xray__product {
  position: absolute;
}

.project-xray__handle {
  position: absolute;
  inset-block: 0;
  z-index: 2;
  width: 1rem;
  transform: translateX(-50%);
  color: #16a34a;
  cursor: ew-resize;
}

.project-xray__handle::before,
.project-xray__handle::after {
  position: absolute;
  left: 50%;
  content: '';
  transform: translateX(-50%);
}

.project-xray__handle::before {
  inset-block: 0;
  width: 2px;
  background: currentColor;
}

.project-xray__handle::after {
  top: 50%;
  width: 0.875rem;
  height: 2rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-subtle);
  transform: translate(-50%, -50%);
}

.project-xray__handle:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

@media (max-width: 639px) {
  .project-xray__handle {
    opacity: 0;
    pointer-events: none;
  }

  .project-xray__handle:focus-visible {
    opacity: 1;
  }
}
</style>
