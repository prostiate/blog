<template>
  <div class="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
    <header class="border-b border-[var(--color-border)] pb-8">
      <p class="section-label">Engineering Index</p>
      <h1
        class="mb-3 font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
      >
        Systems & Projects
      </h1>
      <p class="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        A curated record of production systems, local-first web applications, and developer tooling.
      </p>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in ['All', 'Full Stack', 'Frontend', 'Mobile', 'Backend', 'DevOps / Platform']"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'mono-font rounded-[2px] border px-3 py-1 text-xs font-medium transition-colors',
            activeCategory === cat
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
              : 'border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <!-- Project List -->
    <main class="space-y-6">
      <UiProjectCard
        v-for="project in filteredProjects"
        :key="project.path || project.title"
        :project="project"
      />
    </main>
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
