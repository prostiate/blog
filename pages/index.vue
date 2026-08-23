<template>
  <div class="animate-fade-up mx-auto max-w-4xl space-y-16 px-4 py-8 sm:px-6 sm:py-12">
    <!-- Minimal Hero Section -->
    <section class="space-y-5 border-b border-[var(--border-subtle)] pb-8">
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
        >
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          Building local-first tools
        </span>
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

    <!-- Section 1: Featured Projects -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Featured Projects
        </h2>
        <NuxtLink
          to="/projects"
          class="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          View all projects →
        </NuxtLink>
      </div>

      <!-- Hero Highlight: OnoToolkit -->
      <div
        class="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm transition-all hover:border-[var(--border-medium)]"
      >
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div class="flex items-center gap-2.5">
            <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
            <h3 class="text-lg font-bold text-[var(--text-primary)]">OnoToolkit</h3>
            <span
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >Featured</span
            >
          </div>
          <div class="mono-font flex items-center gap-3 text-xs">
            <a
              href="https://onotoolkit.irfankurniawan.com/"
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
              Live Site ↗
            </a>
            <span class="text-[var(--border-medium)]">·</span>
            <a
              href="https://github.com/prostiate/onotoolkit"
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
              GitHub ↗
            </a>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
          Privacy-first suite of high-performance browser tools running entirely client-side. Pushes
          heavy workloads into the browser: ONNX Runtime Web (WebGPU/WASM) for AI background removal
          and MI-GAN inpainting, Ghostscript-WASM for PDF compression, and getDisplayMedia canvas
          screen recording. Zero server uploads, zero accounts.
        </p>

        <div class="flex flex-wrap gap-1.5 pt-1">
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >Nuxt 4</span
          >
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >WASM</span
          >
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >ONNX WebGPU</span
          >
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >Ghostscript</span
          >
          <span
            class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >IndexedDB</span
          >
        </div>
      </div>

      <!-- Secondary Projects Grid -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          v-for="project in secondaryProjects"
          :key="project.title"
          class="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5 transition-colors hover:bg-[var(--bg-surface)]"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-base font-bold text-[var(--text-primary)]">{{ project.title }}</h4>
            <span class="mono-font text-[11px] text-[var(--text-muted)]">{{
              project.category
            }}</span>
          </div>
          <p class="text-xs leading-relaxed text-[var(--text-secondary)]">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-1 pt-1">
            <span
              v-for="tag in (project.tags || []).slice(0, 3)"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
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
          <NuxtLink :to="post.path" class="block">
            <div class="mb-1 flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:underline">
                {{ post.title }}
              </h3>
              <div class="mono-font whitespace-nowrap text-xs text-[var(--text-muted)]">
                {{ post.date }} · {{ post.readTime }}
              </div>
            </div>
            <p class="line-clamp-2 text-xs text-[var(--text-secondary)]">
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

const secondaryProjects = computed(() => {
  return (rawProjects.value || []).filter((p) => p.title !== 'OnoToolkit' && p.featured).slice(0, 4)
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
