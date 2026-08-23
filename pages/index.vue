<template>
  <div class="animate-fade-up mx-auto max-w-4xl space-y-16 px-4 py-8 sm:px-6 sm:py-12">
    <!-- Minimal Hero Section -->
    <section class="space-y-5 border-b border-[var(--border-subtle)] pb-8">
      <div class="flex items-center gap-2">
        <span class="mono-font text-xs text-[var(--text-muted)]">Jakarta, Indonesia</span>
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Muhammad Irfan Kurniawan
        </h1>
        <p class="text-lg font-medium text-[var(--text-secondary)]">Full Stack Engineer</p>
      </div>

      <p class="max-w-xl text-base italic text-[var(--text-primary)]">
        "Driven by relentless curiosity, sustained by perseverance."
      </p>

      <!-- Compact Contact & Social Links -->
      <div class="mono-font flex flex-wrap items-center gap-4 pt-2 text-xs">
        <a
          href="mailto:mail@irfankurniawan.com"
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          mail@irfankurniawan.com
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://github.com/prostiate"
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
          github.com/prostiate
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/"
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
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </a>
      </div>
    </section>

    <!-- Option 3: Featured Projects Carousel (Interactive Architecture Console) -->
    <section>
      <UiFeaturedProjectsCarousel :projects="featuredProjectsList" />
    </section>

    <!-- Option 2: Featured Projects Showcase (Three.js WebGL 3D Mesh) -->
    <section>
      <UiFeaturedProjectsThree :projects="featuredProjectsList" />
    </section>

    <!-- Section 2: Blog Posts -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Recent Blog Posts
        </h2>
        <NuxtLink
          to="/blog"
          class="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          All blog posts →
        </NuxtLink>
      </div>

      <div class="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        <article
          v-for="post in posts"
          :key="post.path || post.title"
          class="group cursor-pointer py-4"
        >
          <NuxtLink :to="post.path" class="block space-y-1">
            <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 class="text-base font-bold text-[var(--text-primary)] group-hover:underline">
                {{ post.title }}
              </h3>
              <div class="mono-font whitespace-nowrap text-xs text-[var(--text-muted)]">
                {{ post.date }} · {{ post.readTime }}
              </div>
            </div>
            <p class="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {{ post.description }}
            </p>
          </NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => {
  return queryCollection('blog').order('date', 'DESC').limit(3).all()
})

const { data: rawProjects } = await useAsyncData('home-projects', () => {
  return queryCollection('projects').order('order', 'ASC').all()
})

const featuredProjectsList = computed(() => {
  return rawProjects.value || []
})

useSeoMeta({
  title: 'Muhammad Irfan Kurniawan - Full Stack Engineer',
  description:
    'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.',
  ogTitle: 'Muhammad Irfan Kurniawan - Full Stack Engineer',
  ogDescription:
    'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.'
})
</script>
