<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { AnimatePresence, motion, useReducedMotion } from 'motion-v'
import type { ProjectItem } from '../../types/project'
import {
  getFeaturedVisualId,
  getPanelMotion,
  wrapProjectIndex
} from '../../utils/featured-projects'
import AmazoneMonorepoVisual from './featured-projects/AmazoneMonorepoVisual.vue'
import OnoToolkitVisual from './featured-projects/OnoToolkitVisual.vue'
import PgClientMobileVisual from './featured-projects/PgClientMobileVisual.vue'

const props = defineProps<{ projects: ProjectItem[] }>()

const visualComponents = {
  onotoolkit: OnoToolkitVisual,
  'amazone-monorepo': AmazoneMonorepoVisual,
  'pg-client-mobile': PgClientMobileVisual
} as const

const activeIndex = ref(0)
const tabRefs = ref<HTMLButtonElement[]>([])
const swipeStartX = ref<number | null>(null)
const prefersReducedMotion = useReducedMotion()
const motionPreferenceReady = ref(false)

const currentProject = computed(() => props.projects[activeIndex.value])
const activeVisual = computed(() => {
  const id = getFeaturedVisualId(currentProject.value?.path)
  return id ? visualComponents[id] : null
})
const reducedMotionEnabled = computed(
  () => motionPreferenceReady.value && Boolean(prefersReducedMotion.value)
)
const panelMotion = computed(() => getPanelMotion(Boolean(prefersReducedMotion.value)))

onMounted(() => {
  motionPreferenceReady.value = true
})

function tabId(index: number) {
  return `featured-project-tab-${index}`
}

const panelId = 'featured-project-panel'

async function selectProject(index: number, focusTab = false) {
  activeIndex.value = wrapProjectIndex(index, props.projects.length)
  await nextTick()

  const activeTab = tabRefs.value[activeIndex.value]
  activeTab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  if (focusTab) activeTab?.focus()
}

function previousProject() {
  void selectProject(activeIndex.value - 1)
}

function nextProject() {
  void selectProject(activeIndex.value + 1)
}

function onTablistKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    void selectProject(activeIndex.value - 1, true)
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    void selectProject(activeIndex.value + 1, true)
  }
}

function startSwipe(event: PointerEvent) {
  swipeStartX.value = event.clientX
}

function finishSwipe(event: PointerEvent) {
  if (swipeStartX.value === null) return

  const deltaX = event.clientX - swipeStartX.value
  swipeStartX.value = null

  if (Math.abs(deltaX) < 48) return
  if (deltaX < 0) nextProject()
  else previousProject()
}

function cancelSwipe() {
  swipeStartX.value = null
}
</script>

<template>
  <section
    v-if="projects.length"
    class="featured-projects space-y-6"
    aria-labelledby="featured-projects-heading"
  >
    <header
      class="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-end"
    >
      <div class="space-y-1">
        <h2
          id="featured-projects-heading"
          class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
        >
          Featured Projects
        </h2>
        <p class="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Selected case studies spanning browser-local tools, shared frontend systems, and mobile
          database workflows.
        </p>
      </div>
      <NuxtLink
        to="/projects"
        class="mono-font shrink-0 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
      >
        View all projects →
      </NuxtLink>
    </header>

    <div
      role="tablist"
      aria-label="Featured projects"
      class="no-scrollbar flex touch-pan-y gap-2 overflow-x-auto pb-1"
      @keydown="onTablistKeydown"
      @pointerdown="startSwipe"
      @pointerup="finishSwipe"
      @pointercancel="cancelSwipe"
    >
      <button
        v-for="(project, index) in projects"
        :key="project.path || project.title"
        :ref="
          (element) => {
            if (element) tabRefs[index] = element as HTMLButtonElement
          }
        "
        type="button"
        role="tab"
        :id="tabId(index)"
        :aria-controls="panelId"
        :aria-selected="activeIndex === index"
        :tabindex="activeIndex === index ? 0 : -1"
        class="mono-font relative shrink-0 rounded-lg border px-3 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        :class="
          activeIndex === index
            ? 'border-[var(--border-medium)] bg-[var(--bg-code)] font-semibold text-[var(--text-primary)]'
            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
        "
        @click="selectProject(index)"
      >
        {{ project.title }}
        <template v-if="activeIndex === index">
          <span
            v-if="reducedMotionEnabled"
            data-active-tab-indicator="static"
            class="absolute inset-x-3 -bottom-px h-px bg-emerald-500"
          />
          <motion.span
            v-else
            data-active-tab-indicator="motion"
            layout-id="featured-project-active-tab"
            class="absolute inset-x-3 -bottom-px h-px bg-emerald-500"
          />
        </template>
      </button>
    </div>

    <div class="flex items-center justify-between">
      <p class="mono-font text-xs text-[var(--text-muted)]" aria-live="polite">
        {{ activeIndex + 1 }} / {{ projects.length }}
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          data-nav="previous"
          class="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          aria-label="Previous project"
          @click="previousProject"
        >
          ←
        </button>
        <button
          type="button"
          data-nav="next"
          class="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          aria-label="Next project"
          @click="nextProject"
        >
          →
        </button>
      </div>
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        v-if="currentProject"
        :key="currentProject.path || currentProject.title"
        role="tabpanel"
        :id="panelId"
        :aria-labelledby="tabId(activeIndex)"
        :initial="motionPreferenceReady ? panelMotion.initial : false"
        :animate="panelMotion.animate"
        :exit="panelMotion.exit"
        :transition="panelMotion.transition"
        class="grid overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:grid-cols-2"
      >
        <div class="min-w-0 bg-[var(--bg-canvas)] p-4 sm:p-5">
          <component :is="activeVisual" v-if="activeVisual" />
          <div
            v-else
            class="grid min-h-80 content-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-code)] p-6"
            :aria-label="`${currentProject.title} architecture summary`"
          >
            <p class="mono-font text-xs text-emerald-600 dark:text-emerald-400">
              Architecture overview
            </p>
            <p class="text-lg font-semibold text-[var(--text-primary)]">
              {{ currentProject.title }}
            </p>
            <p class="text-sm text-[var(--text-secondary)]">{{ currentProject.category }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in currentProject.tags || []"
                :key="tag"
                class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-secondary)]"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div
          data-swipe-zone="text"
          class="featured-projects__details touch-pan-y space-y-5 p-6 sm:p-8"
          @pointerdown="startSwipe"
          @pointerup="finishSwipe"
          @pointercancel="cancelSwipe"
        >
          <p class="mono-font text-xs text-emerald-600 dark:text-emerald-400">
            {{ currentProject.category }}
          </p>
          <div class="space-y-3">
            <h3 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {{ currentProject.title }}
            </h3>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
              {{ currentProject.description }}
            </p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in currentProject.tags || []"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-1 text-xs text-[var(--text-secondary)]"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mono-font flex flex-wrap gap-3 pt-1 text-xs font-semibold">
            <NuxtLink
              v-if="currentProject.path"
              :to="currentProject.path"
              class="rounded-lg bg-[var(--text-primary)] px-3.5 py-2.5 text-[var(--bg-canvas)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Read case study
            </NuxtLink>
            <a
              v-if="currentProject.liveUrl"
              :href="currentProject.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-emerald-700 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-emerald-400"
            >
              Live project
            </a>
            <a
              v-if="currentProject.githubUrl"
              :href="currentProject.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-[var(--text-primary)] hover:border-[var(--border-medium)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Source code
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </section>
</template>

<style scoped>
@media (max-width: 374px) {
  .featured-projects__details {
    min-height: 27rem;
  }
}

@media (min-width: 375px) and (max-width: 639px) {
  .featured-projects__details {
    min-height: 24.25rem;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .featured-projects__details {
    min-height: 18.625rem;
  }
}
</style>
