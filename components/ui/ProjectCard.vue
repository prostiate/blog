<template>
  <div class="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 transition-all hover:border-[var(--border-medium)]">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <span class="text-[11px] mono-font text-[var(--text-muted)] block uppercase tracking-wider">{{ project.category }}</span>
        <h3 class="text-lg font-bold text-[var(--text-primary)]">{{ project.title }}</h3>
      </div>
      <div class="flex items-center gap-3 text-xs mono-font">
        <a 
          v-if="project.liveUrl" 
          :href="project.liveUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
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

    <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
      {{ project.description }}
    </p>

    <!-- Problem Solved Section -->
    <div v-if="project.problemSolved" class="text-xs bg-[var(--bg-canvas)] p-3.5 rounded-lg border border-[var(--border-subtle)] space-y-1">
      <span class="font-semibold text-[var(--text-primary)] block">Problem Solved:</span>
      <p class="text-[var(--text-secondary)] leading-relaxed">{{ project.problemSolved }}</p>
    </div>

    <!-- Architecture Highlights -->
    <div v-if="project.architecture && project.architecture.length" class="text-xs space-y-1.5">
      <span class="font-semibold text-[var(--text-primary)] block">Architecture Highlights:</span>
      <ul class="list-disc pl-4 space-y-1 text-[var(--text-secondary)]">
        <li v-for="(arch, idx) in project.architecture" :key="idx">{{ arch }}</li>
      </ul>
    </div>

    <!-- Tech Badges -->
    <div v-if="project.tags && project.tags.length" class="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
      <span 
        v-for="tag in project.tags" 
        :key="tag" 
        class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
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
