<template>
  <div class="animate-fade-up mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
    <div class="space-y-2 border-b border-[var(--border-subtle)] pb-6">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        Projects
      </h1>
      <p class="text-sm text-[var(--text-secondary)]">
        A curated record of production systems, local-first web applications, and developer tooling.
      </p>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap gap-1.5 pt-4">
        <button
          v-for="cat in ['All', 'Full Stack', 'Frontend', 'Mobile', 'Backend', 'DevOps / Platform']"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            activeCategory === cat
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Project List -->
    <div class="space-y-6">
      <UiProjectCard
        v-for="project in filteredProjects"
        :key="project.path || project.title"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const activeCategory = ref('All')

const { data: projects } = await useAsyncData('all-projects', () => {
  return queryCollection('projects').order('order', 'ASC').all()
})

const filteredProjects = computed(() => {
  const list = projects.value || []
  if (activeCategory.value === 'All') return list
  return list.filter((p) => p.category === activeCategory.value)
})

useSeoMeta({
  title: 'Projects - Muhammad Irfan Kurniawan',
  description:
    'Production systems, local-first web applications, and developer tooling built by Muhammad Irfan Kurniawan.',
  ogTitle: 'Projects - Muhammad Irfan Kurniawan',
  ogDescription:
    'Production systems, local-first web applications, and developer tooling built by Muhammad Irfan Kurniawan.'
})
</script>
