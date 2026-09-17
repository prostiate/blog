<template>
  <article class="group py-6 transition-colors">
    <NuxtLink v-if="project.path" :to="project.path" class="block space-y-2.5 no-underline">
      <div
        class="mono-font flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]"
      >
        <span>{{ project.category }}</span>
        <template v-if="project.liveUrl || project.githubUrl">
          <span>·</span>
          <a
            v-if="project.liveUrl"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-[var(--color-accent)] hover:underline"
            @click.stop
          >
            Live ↗
          </a>
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline"
            @click.stop
          >
            GitHub ↗
          </a>
        </template>
      </div>

      <h3
        class="font-serif text-xl font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]"
      >
        {{ project.title }}
      </h3>

      <p class="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {{ project.description }}
      </p>

      <div
        class="mono-font flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[var(--color-text-muted)]"
      >
        <span v-if="project.tags && project.tags.length">
          {{ project.tags.join(' · ') }}
        </span>
        <span class="font-semibold text-[var(--color-accent)] group-hover:underline">
          Read Case Study →
        </span>
      </div>
    </NuxtLink>
  </article>
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
  path?: string
}

defineProps<{
  project: Project
}>()
</script>
