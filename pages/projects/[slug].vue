<template>
  <div class="animate-fade-up mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Back Navigation -->
    <NuxtLink
      to="/projects"
      class="mb-8 flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      ← Back to all projects
    </NuxtLink>

    <div v-if="project" class="space-y-10">
      <!-- Project Header Card -->
      <header class="space-y-6 border-b border-[var(--border-subtle)] pb-8">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
          >
            {{ project.category }}
          </span>
          <span
            v-if="project.featured"
            class="mono-font rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400"
          >
            Featured
          </span>
        </div>

        <div class="space-y-3">
          <h1 class="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {{ project.title }}
          </h1>
          <p class="text-base leading-relaxed text-[var(--text-secondary)]">
            {{ project.description }}
          </p>
        </div>

        <!-- Project Links (Live Site & GitHub) -->
        <div class="mono-font flex flex-wrap items-center gap-3 pt-2 text-xs">
          <a
            v-if="project.liveUrl"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
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
            class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
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

        <!-- Problem Solved Section -->
        <div
          v-if="project.problemSolved"
          class="space-y-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-sm"
        >
          <span class="block font-bold text-[var(--text-primary)]">Problem Solved:</span>
          <p class="leading-relaxed text-[var(--text-secondary)]">{{ project.problemSolved }}</p>
        </div>

        <!-- Architecture Highlights -->
        <div v-if="project.architecture && project.architecture.length" class="space-y-2 text-sm">
          <span class="block font-bold text-[var(--text-primary)]">Architecture Highlights:</span>
          <ul class="list-disc space-y-1.5 pl-4 text-[var(--text-secondary)]">
            <li v-for="(arch, idx) in project.architecture" :key="idx">{{ arch }}</li>
          </ul>
        </div>

        <!-- Tech Badges -->
        <div v-if="project.tags && project.tags.length" class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Case Study Markdown Body -->
      <article class="prose-custom reading-column max-w-[68ch]">
        <ContentRenderer :value="project" />
      </article>
    </div>

    <!-- 404 Fallback -->
    <div v-else class="space-y-4 py-20 text-center">
      <h2 class="text-xl font-bold text-[var(--text-primary)]">Project not found</h2>
      <p class="text-sm text-[var(--text-secondary)]">
        The requested project could not be located.
      </p>
      <NuxtLink
        to="/projects"
        class="inline-block rounded-lg bg-[var(--text-primary)] px-4 py-2 text-xs font-semibold text-[var(--bg-canvas)]"
      >
        Return to Projects
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.path}`, () => {
  return queryCollection('projects').path(route.path).first()
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project Not Found' })
}

useSeoMeta({
  title: computed(() => `${project.value?.title || 'Project'} - Muhammad Irfan Kurniawan`),
  description: computed(() => project.value?.description || ''),
  ogTitle: computed(() => `${project.value?.title || 'Project'} - Muhammad Irfan Kurniawan`),
  ogDescription: computed(() => project.value?.description || '')
})
</script>
