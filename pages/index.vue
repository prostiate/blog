<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 animate-fade-up">
    
    <!-- Minimal Hero Section -->
    <section class="space-y-5 pb-8 border-b border-[var(--border-subtle)]">
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Building local-first tools
        </span>
        <span class="text-xs text-[var(--text-muted)] mono-font">Jakarta, Indonesia</span>
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Muhammad Irfan Kurniawan
        </h1>
        <p class="text-lg font-medium text-[var(--text-secondary)]">
          Full Stack Engineer
        </p>
      </div>

      <p class="text-base text-[var(--text-primary)] italic max-w-xl">
        "Driven by relentless curiosity, sustained by perseverance."
      </p>

      <!-- Compact Contact & Social Links -->
      <div class="flex flex-wrap items-center gap-4 text-xs mono-font pt-2">
        <a href="mailto:mail@irfankurniawan.com" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
          mail@irfankurniawan.com
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a href="https://github.com/prostiate" target="_blank" rel="noopener noreferrer" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
          github.com/prostiate
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/" target="_blank" rel="noopener noreferrer" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
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
        <NuxtLink to="/projects" class="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
          View all projects →
        </NuxtLink>
      </div>

      <!-- Hero Highlight: OnoToolkit -->
      <div class="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all hover:border-[var(--border-medium)] shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h3 class="text-lg font-bold text-[var(--text-primary)]">OnoToolkit</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-muted)] mono-font">Featured</span>
          </div>
          <div class="flex items-center gap-3 text-xs mono-font">
            <a href="https://onotoolkit.irfankurniawan.com/" target="_blank" rel="noopener noreferrer" class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Live Site ↗
            </a>
            <span class="text-[var(--border-medium)]">·</span>
            <a href="https://github.com/prostiate/onotoolkit" target="_blank" rel="noopener noreferrer" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline">
              GitHub ↗
            </a>
          </div>
        </div>

        <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
          Privacy-first suite of high-performance browser tools running entirely client-side. Pushes heavy workloads into the browser: ONNX Runtime Web (WebGPU/WASM) for AI background removal and MI-GAN inpainting, Ghostscript-WASM for PDF compression, and getDisplayMedia canvas screen recording. Zero server uploads, zero accounts.
        </p>

        <div class="flex flex-wrap gap-1.5 pt-1">
          <span class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">Nuxt 4</span>
          <span class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">WASM</span>
          <span class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">ONNX WebGPU</span>
          <span class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">Ghostscript</span>
          <span class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">IndexedDB</span>
        </div>
      </div>

      <!-- Secondary Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="project in secondaryProjects" 
          :key="project.title"
          class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface)] transition-colors space-y-3"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-base text-[var(--text-primary)]">{{ project.title }}</h4>
            <span class="text-[11px] mono-font text-[var(--text-muted)]">{{ project.category }}</span>
          </div>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-1 pt-1">
            <span 
              v-for="tag in (project.tags || []).slice(0, 3)" 
              :key="tag" 
              class="text-[10px] mono-font px-1.5 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
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
        <NuxtLink to="/blog" class="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
          All articles →
        </NuxtLink>
      </div>

      <div class="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        <article 
          v-for="post in posts" 
          :key="post.path || post.title"
          class="py-4 group cursor-pointer"
        >
          <NuxtLink :to="post.path" class="block">
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
              <h3 class="text-base font-semibold text-[var(--text-primary)] group-hover:underline">
                {{ post.title }}
              </h3>
              <div class="text-xs mono-font text-[var(--text-muted)] whitespace-nowrap">
                {{ post.date }} · {{ post.readTime }}
              </div>
            </div>
            <p class="text-xs text-[var(--text-secondary)] line-clamp-2">
              {{ post.description }}
            </p>
          </NuxtLink>
        </article>
      </div>
    </section>

    <!-- Section 3: Verified Tech Stack & Status -->
    <section class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Core System Stack & Runtime
        </span>
        <span class="text-[11px] mono-font text-[var(--text-muted)]">Verified Production Baseline</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div>
          <span class="text-[var(--text-muted)] block text-[11px]">Frontend</span>
          <span class="font-medium text-[var(--text-primary)]">Vue 3 / Nuxt 4 / Tailwind</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block text-[11px]">Backend & APIs</span>
          <span class="font-medium text-[var(--text-primary)]">Go (gqlgen) / Hono / Node</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block text-[11px]">Databases</span>
          <span class="font-medium text-[var(--text-primary)]">PostgreSQL / Neon / Redis</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block text-[11px]">Deployments</span>
          <span class="font-medium text-[var(--text-primary)]">Docker Compose / Cloudflare</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => {
  return queryCollection('blog')
    .order('date', 'DESC')
    .limit(3)
    .all()
})

const { data: rawProjects } = await useAsyncData('home-projects', () => {
  return queryCollection('projects')
    .order('order', 'ASC')
    .all()
})

const secondaryProjects = computed(() => {
  return (rawProjects.value || []).filter(p => p.title !== 'OnoToolkit' && p.featured).slice(0, 4)
})

useSeoMeta({
  title: 'Muhammad Irfan Kurniawan - Full Stack Engineer',
  description: 'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.',
  ogTitle: 'Muhammad Irfan Kurniawan - Full Stack Engineer',
  ogDescription: 'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.'
})
</script>
