<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Back Link -->
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
      <article class="w-full max-w-[68ch] flex-grow">
        <!-- Project Header -->
        <header class="mb-8 border-b border-[var(--color-border)] pb-8">
          <p class="section-label">Engineering Case Study</p>
          <div
            class="mono-font mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]"
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
              >
                Live Demo ↗
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-[var(--color-text)] hover:underline"
              >
                Source Code ↗
              </a>
            </template>
          </div>

          <h1
            class="mb-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl"
          >
            {{ project.title }}
          </h1>

          <p class="mb-0 text-base leading-relaxed text-[var(--color-text-muted)]">
            {{ project.description }}
          </p>

          <div
            v-if="project.tags && project.tags.length"
            class="mono-font mt-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]"
          >
            Stack: {{ project.tags.join(' · ') }}
          </div>
        </header>

        <!-- Case Study Markdown Body -->
        <div class="prose-custom py-2">
          <ContentRenderer :value="project" />
        </div>

        <!-- Understated Colophon -->
        <footer
          class="mt-16 space-y-2 border-t border-[var(--color-border)] pt-8 font-mono text-xs text-[var(--color-text-muted)]"
        >
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Colophon
          </p>
          <p class="leading-relaxed">
            Engineering case study by Muhammad Irfan Kurniawan. Published in Jakarta, Indonesia.
          </p>
        </footer>
      </article>

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
        The requested project case study could not be located.
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
  throw createError({ statusCode: 404, statusMessage: 'Project Not Found', fatal: true })
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
