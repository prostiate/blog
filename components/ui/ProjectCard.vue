<template>
  <div
    class="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[var(--border-medium)]"
  >
    <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <span
          class="mono-font block text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
          >{{ project.category }}</span
        >
        <h3 class="text-lg font-bold text-[var(--text-primary)]">{{ project.title }}</h3>
      </div>
      <div class="mono-font flex items-center gap-3 text-xs">
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            />
          </svg>
          Live Demo ↗
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
            />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          Source Code ↗
        </a>
      </div>
    </div>

    <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
      {{ project.description }}
    </p>

    <!-- Problem Solved Section -->
    <div
      v-if="project.problemSolved"
      class="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 text-xs"
    >
      <span class="block font-semibold text-[var(--text-primary)]">Problem Solved:</span>
      <p class="leading-relaxed text-[var(--text-secondary)]">{{ project.problemSolved }}</p>
    </div>

    <!-- Architecture Highlights -->
    <div v-if="project.architecture && project.architecture.length" class="space-y-1.5 text-xs">
      <span class="block font-semibold text-[var(--text-primary)]">Architecture Highlights:</span>
      <ul class="list-disc space-y-1 pl-4 text-[var(--text-secondary)]">
        <li v-for="(arch, idx) in project.architecture" :key="idx">{{ arch }}</li>
      </ul>
    </div>

    <!-- Tech Badges -->
    <div
      v-if="project.tags && project.tags.length"
      class="flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-2"
    >
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Project {
  id: string
  title: string
  category: string
  description: string
  problemSolved?: string
  architecture?: string[]
  tags?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  featured?: boolean
}

defineProps<{
  project: Project
}>()
</script>
