<template>
  <div class="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
    <!-- Header -->
    <header class="border-b border-[var(--color-border)] pb-8">
      <p class="section-label">Selected Systems & Case Studies</p>
      <h1
        class="mb-3 font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
      >
        Systems & Projects
      </h1>
      <p class="mb-0 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
        Production systems, internal platforms, and local-first utilities engineered under real
        business and hardware constraints.
      </p>
    </header>

    <!-- Project List (Monograph Stream) -->
    <main class="divide-y divide-[var(--color-border)]">
      <article
        v-for="project in projects"
        :key="project.path || project.title"
        class="group py-8 transition-colors"
      >
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

          <h2
            class="font-serif text-xl font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]"
          >
            {{ project.title }}
          </h2>

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
    </main>
  </div>
</template>

<script setup lang="ts">
const { data: projects } = await useAsyncData('all-projects', () => {
  return queryCollection('projects').order('order', 'ASC').all()
})

useSeoMeta({
  title: 'Projects - Muhammad Irfan Kurniawan',
  description:
    'Production systems, internal platforms, and local-first web applications built by Muhammad Irfan Kurniawan.',
  ogTitle: 'Projects - Muhammad Irfan Kurniawan',
  ogDescription:
    'Production systems, internal platforms, and local-first web applications built by Muhammad Irfan Kurniawan.'
})
</script>
