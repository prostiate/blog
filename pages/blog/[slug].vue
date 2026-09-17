<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Back Link -->
    <div class="mb-8">
      <NuxtLink
        to="/"
        class="mono-font flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-accent)]"
      >
        ← All writings
      </NuxtLink>
    </div>

    <div v-if="post" class="flex flex-col items-start justify-between gap-10 lg:flex-row xl:gap-16">
      <!-- Main Article Column (Strictly 68ch max width for reading focus) -->
      <article class="w-full max-w-[68ch] flex-grow">
        <header class="mb-8 border-b border-[var(--color-border)] pb-8">
          <p class="section-label">My Writings</p>
          <div
            class="mono-font mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]"
          >
            <span>{{ post.date }}</span>
            <span>·</span>
            <span>{{ post.readTime }}</span>
          </div>

          <h1
            class="mb-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl"
          >
            {{ post.title }}
          </h1>

          <p
            v-if="post.description"
            class="mb-0 text-base leading-relaxed text-[var(--color-text-muted)]"
          >
            {{ post.description }}
          </p>
        </header>

        <!-- Markdown Body -->
        <div class="prose-custom py-2">
          <ContentRenderer :value="post" />
        </div>

        <!-- Understated Monograph Colophon -->
        <footer
          class="mt-16 space-y-2 border-t border-[var(--color-border)] pt-8 font-mono text-xs text-[var(--color-text-muted)]"
        >
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Colophon
          </p>
          <p class="leading-relaxed">
            Written by Muhammad Irfan Kurniawan. Published in Jakarta, Indonesia.
          </p>
        </footer>
      </article>

      <!-- Desktop Table of Contents Side-Rail -->
      <aside
        v-if="post.body?.toc?.links && post.body.toc.links.length"
        class="not-prose sticky top-20 hidden w-60 flex-shrink-0 space-y-4 self-start border-l border-[var(--color-border)] pl-6 lg:block xl:w-64"
      >
        <div class="space-y-3 text-xs">
          <span
            class="mono-font block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            Contents
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

          <div class="border-t border-[var(--color-border)] pt-4">
            <button
              @click="copyArticleLink"
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

    <!-- 404 fallback if not found -->
    <div v-else class="space-y-4 py-20 text-center">
      <h2 class="font-serif text-xl font-bold text-[var(--color-text)]">Writing not found</h2>
      <p class="text-sm text-[var(--color-text-muted)]">
        The requested technical essay could not be located.
      </p>
      <NuxtLink
        to="/"
        class="inline-block rounded-[2px] border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white no-underline hover:bg-[var(--color-accent-hover)]"
      >
        Return to Writings
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
