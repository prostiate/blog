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
          class="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
          mail@irfankurniawan.com
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://github.com/prostiate"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
          github.com/prostiate
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
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
              class="flex items-center gap-1 font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Live Site ↗
            </a>
            <span class="text-[var(--border-medium)]">·</span>
            <a
              href="https://github.com/prostiate/onotoolkit"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
            >
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

    <!-- Section 2: Writing & Essays -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Writing & Engineering Notes
        </h2>
        <NuxtLink
          to="/blog"
          class="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          All articles →
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

    <!-- Section 3: Verified Tech Stack & Status -->
    <section
      class="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-xs"
    >
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Core System Stack & Runtime
        </span>
        <span class="mono-font text-[11px] text-[var(--text-muted)]"
          >Verified Production Baseline</span
        >
      </div>
      <div class="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
        <div>
          <span class="block text-[11px] text-[var(--text-muted)]">Frontend</span>
          <span class="font-medium text-[var(--text-primary)]">Vue 3 / Nuxt 4 / Tailwind</span>
        </div>
        <div>
          <span class="block text-[11px] text-[var(--text-muted)]">Backend & APIs</span>
          <span class="font-medium text-[var(--text-primary)]">Go (gqlgen) / Hono / Node</span>
        </div>
        <div>
          <span class="block text-[11px] text-[var(--text-muted)]">Databases</span>
          <span class="font-medium text-[var(--text-primary)]">PostgreSQL / Neon / Redis</span>
        </div>
        <div>
          <span class="block text-[11px] text-[var(--text-muted)]">Deployments</span>
          <span class="font-medium text-[var(--text-primary)]">Docker Compose / Cloudflare</span>
        </div>
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
