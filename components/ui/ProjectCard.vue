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
          class="flex items-center gap-1 font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Live Demo ↗
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
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
