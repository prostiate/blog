<template>
  <div class="animate-fade-up mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Back Button -->
    <NuxtLink
      to="/blog"
      class="mb-8 flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      ← Back to all essays
    </NuxtLink>

    <div v-if="post" class="flex flex-col items-start justify-between gap-10 lg:flex-row xl:gap-16">
      <!-- Main Article Column (Strictly 65ch to 68ch) -->
      <article class="w-full max-w-[68ch] flex-grow">
        <header class="space-y-4 border-b border-[var(--border-subtle)] pb-8">
          <div class="mono-font flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>{{ post.date }}</span>
            <span>·</span>
            <span>{{ post.readTime }}</span>
          </div>

          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            {{ post.title }}
          </h1>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >
              #{{ tag }}
            </span>
          </div>
        </header>

        <!-- Markdown Body -->
        <div class="prose-custom py-8">
          <ContentRenderer :value="post" />
        </div>

        <!-- Canonical Author Signature Box -->
        <div
          class="not-prose mt-12 space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          <div class="flex items-center gap-3">
            <UiLogoMark custom-class="w-10 h-10" />
            <div>
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">
                Muhammad Irfan Kurniawan
              </h4>
              <p class="text-xs text-[var(--text-secondary)]">
                Senior Full Stack Engineer · Jakarta, Indonesia
              </p>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-[var(--text-secondary)]">
            Writing about production architecture, frontend ergonomics, browser performance, and
            practical systems engineering.
          </p>
        </div>
      </article>

      <!-- Desktop Table of Contents Side-Rail -->
      <aside
        v-if="post.body?.toc?.links && post.body.toc.links.length"
        class="not-prose sticky top-24 hidden w-60 flex-shrink-0 space-y-4 self-start border-l border-[var(--border-subtle)] pl-6 lg:block xl:w-64"
      >
        <div class="space-y-3 text-xs">
          <span
            class="mono-font block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            Table of Contents
          </span>

          <nav class="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto pr-1">
            <template v-for="(link, lIdx) in post.body.toc.links" :key="link.id">
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

          <div class="border-t border-[var(--border-subtle)] pt-4">
            <span class="mb-1.5 block text-[11px] text-[var(--text-muted)]">Share this essay:</span>
            <button
              @click="copyArticleLink"
              class="mono-font flex w-full items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-left text-[11px] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-code)]"
            >
              <span v-if="copied" class="font-semibold text-emerald-600 dark:text-emerald-400"
                >Copied to Clipboard!</span
              >
              <span v-else>Copy Link</span>
              <span>{{ copied ? '✓' : '📋' }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- 404 fallback if not found -->
    <div v-else class="space-y-4 py-20 text-center">
      <h2 class="text-xl font-bold text-[var(--text-primary)]">Essay not found</h2>
      <p class="text-sm text-[var(--text-secondary)]">
        The requested article could not be located.
      </p>
      <NuxtLink
        to="/blog"
        class="inline-block rounded-lg bg-[var(--text-primary)] px-4 py-2 text-xs font-semibold text-[var(--bg-canvas)]"
      >
        Return to Writing
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const activeId = ref('')
const copied = ref(false)

const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post Not Found', fatal: true })
}

useSeoMeta({
  title: `${post.value.title} - Muhammad Irfan Kurniawan`,
  description: post.value.description,
  ogTitle: `${post.value.title} - Muhammad Irfan Kurniawan`,
  ogDescription: post.value.description,
  ogType: 'article',
  ogUrl: `https://irfankurniawan.com/blog/${slug}`,
  twitterCard: 'summary_large_image',
  twitterTitle: `${post.value.title} - Muhammad Irfan Kurniawan`,
  twitterDescription: post.value.description
})

const copyArticleLink = () => {
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
