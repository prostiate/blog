<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Back Navigation -->
    <div class="mb-8">
      <NuxtLink
        to="/projects"
        class="mono-font flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-accent)]"
      >
        ← All projects
      </NuxtLink>
    </div>

    <div
      v-if="project"
      class="flex flex-col items-start justify-between gap-10 lg:flex-row xl:gap-16"
    >
      <!-- Main Content Column (Bounded to 68ch) -->
      <div class="w-full max-w-[68ch] flex-grow space-y-10">
        <!-- Project Header -->
        <header class="space-y-4 border-b border-[var(--color-border)] pb-8">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="mono-font rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]"
            >
              {{ project.category }}
            </span>
            <span
              v-if="project.featured"
              class="mono-font rounded-[2px] border border-[var(--color-accent)] bg-[var(--color-bg-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent)]"
            >
              Featured
            </span>
          </div>

          <h1
            class="font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
          >
            {{ project.title }}
          </h1>

          <p class="text-base leading-relaxed text-[var(--color-text-muted)]">
            {{ project.description }}
          </p>

          <!-- Project Links (Live Site & GitHub) -->
          <div class="mono-font flex flex-wrap items-center gap-3 pt-2 text-xs">
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-[2px] border border-[var(--color-accent)] bg-[var(--color-bg-surface)] px-3.5 py-2 font-semibold text-[var(--color-accent)] no-underline transition-colors hover:bg-[var(--color-bg-code)]"
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
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
              Live Demo ↗
            </a>

            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3.5 py-2 font-medium text-[var(--color-text)] no-underline transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-code)]"
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
            class="space-y-1.5 rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 text-sm"
          >
            <span class="block font-serif font-semibold text-[var(--color-text)]"
              >Problem Solved:</span
            >
            <p class="mb-0 leading-relaxed text-[var(--color-text-muted)]">
              {{ project.problemSolved }}
            </p>
          </div>

          <!-- Architecture Highlights -->
          <div v-if="project.architecture && project.architecture.length" class="space-y-2 text-sm">
            <span class="block font-serif font-semibold text-[var(--color-text)]"
              >Architecture Highlights:</span
            >
            <ul class="list-disc space-y-1.5 pl-4 text-[var(--color-text-muted)]">
              <li v-for="(arch, idx) in project.architecture" :key="idx">{{ arch }}</li>
            </ul>
          </div>

          <!-- Tech Stack (Clean Dot-separated text line) -->
          <div
            v-if="project.tags && project.tags.length"
            class="mono-font pt-2 text-xs text-[var(--color-text-muted)]"
          >
            {{ project.tags.join(' · ') }}
          </div>
        </header>

        <!-- Case Study Markdown Body -->
        <article class="prose-custom reading-column max-w-[68ch]">
          <ContentRenderer :value="project" />
        </article>

        <!-- Understated Colophon -->
        <footer
          class="mt-16 space-y-2 border-t border-[var(--color-border)] pt-8 font-mono text-xs text-[var(--color-text-muted)]"
        >
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Colophon
          </p>
          <p class="leading-relaxed">
            Project case study by Muhammad Irfan Kurniawan. Published in Jakarta, Indonesia.
          </p>
        </footer>
      </div>

      <!-- Desktop Table of Contents Side-Rail -->
      <aside
        v-if="project.body?.toc?.links && project.body.toc.links.length"
        class="not-prose sticky top-20 hidden w-60 flex-shrink-0 space-y-4 self-start border-l border-[var(--color-border)] pl-6 lg:block xl:w-64"
      >
        <div class="space-y-3 text-xs">
          <span
            class="mono-font block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            Contents
          </span>

          <nav class="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto pr-1">
            <template v-for="(link, lIdx) in project.body.toc.links" :key="link.id">
              <a :href="`#${link.id}`" :class="['toc-link', activeId === link.id ? 'active' : '']">
                {{ `${lIdx + 1}. ` }}{{ link.text }}
              </a>

              <!-- Nested H3 links -->
              <template v-if="link.children && link.children.length">
                <a
                  v-for="child in link.children"
                  :key="child.id"
                  :href="`#${child.id}`"
                  :class="['toc-link pl-4 text-[11px]', activeId === child.id ? 'active' : '']"
                >
                  {{ child.text }}
                </a>
              </template>
            </template>
          </nav>

          <div class="border-t border-[var(--color-border)] pt-4">
            <button
              @click="copyProjectLink"
              class="mono-font flex w-full items-center justify-between rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2.5 py-1.5 text-left text-[11px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              <span v-if="copied" class="font-semibold text-[var(--color-accent)]"
                >Copied to Clipboard!</span
              >
              <span v-else>Copy Link</span>
              <span>{{ copied ? '✓' : '📋' }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- 404 Fallback -->
    <div v-else class="space-y-4 py-20 text-center">
      <h2 class="font-serif text-xl font-bold text-[var(--color-text)]">Project not found</h2>
      <p class="text-sm text-[var(--color-text-muted)]">
        The requested project could not be located.
      </p>
      <NuxtLink
        to="/projects"
        class="inline-block rounded-[2px] border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white no-underline hover:bg-[var(--color-accent-hover)]"
      >
        Return to Projects
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activeId = ref('')
const copied = ref(false)

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
  ogDescription: computed(() => project.value?.description || ''),
  ogType: 'article',
  ogUrl: computed(() => `https://irfankurniawan.com${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${project.value?.title || 'Project'} - Muhammad Irfan Kurniawan`),
  twitterDescription: computed(() => project.value?.description || '')
})

const copyProjectLink = () => {
  if (import.meta.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

onMounted(() => {
  const headings = document.querySelectorAll('.prose-custom h2, .prose-custom h3')
  if (!headings.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '0px 0px -70% 0px' }
  )

  headings.forEach((h) => observer.observe(h))
})
</script>
