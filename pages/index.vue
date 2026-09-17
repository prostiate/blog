<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Understated Editorial Masthead -->
    <header class="mb-10 border-b border-[var(--color-border)] pb-8">
      <p class="section-label">Writings & Field Notes</p>
      <h1
        class="mb-3 font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
      >
        Engineering Notes & Systems Architecture
      </h1>
      <p class="mb-0 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        Personal notes, production architecture, and honest post-mortems from 8+ years building
        resilient web applications, local-first workflows, and edge infrastructure.
      </p>
    </header>

    <!-- Chronological Monograph Feed -->
    <main>
      <div class="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <article
          v-for="post in posts"
          :key="post.path || post.title"
          class="group py-6 transition-colors"
        >
          <NuxtLink :to="post.path" class="block space-y-2 no-underline">
            <div class="mono-font text-xs text-[var(--color-text-muted)]">
              {{ post.date }} · {{ post.readTime }}
            </div>
            <h2
              class="font-serif text-xl font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]"
            >
              {{ post.title }}
            </h2>
            <p class="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {{ post.description }}
            </p>
          </NuxtLink>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('home-posts', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

useSeoMeta({
  title: 'Muhammad Irfan Kurniawan - Engineering Notes & Systems Architecture',
  description:
    'Notes on production architecture, frontend ergonomics, and systems engineering by Muhammad Irfan Kurniawan.',
  ogTitle: 'Muhammad Irfan Kurniawan - Engineering Notes & Systems Architecture',
  ogDescription:
    'Notes on production architecture, frontend ergonomics, and systems engineering by Muhammad Irfan Kurniawan.'
})
</script>
