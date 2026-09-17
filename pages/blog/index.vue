<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <!-- Header -->
    <header class="mb-10 border-b border-[var(--color-border)] pb-8">
      <p class="section-label">Archive</p>
      <h1
        class="mb-3 font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
      >
        All My Writings
      </h1>
      <p class="mb-0 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        Complete chronological archive of technical writing, architecture deep-dives, and systems
        engineering notes.
      </p>
    </header>

    <!-- Post Feed -->
    <main v-if="paginatedPosts.length > 0">
      <div class="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <article
          v-for="post in paginatedPosts"
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

      <!-- Pagination Controls -->
      <nav
        v-if="totalPages > 1"
        class="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
        aria-label="Pagination"
      >
        <div class="mono-font text-xs text-[var(--color-text-muted)]">
          Showing {{ (currentPage - 1) * postsPerPage + 1 }}-{{
            Math.min(currentPage * postsPerPage, (posts || []).length)
          }}
          of {{ (posts || []).length }} writings
        </div>

        <div class="flex items-center gap-1.5">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'mono-font flex items-center gap-1 rounded-[2px] border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium transition-colors',
              currentPage === 1
                ? 'cursor-not-allowed opacity-40'
                : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
            ]"
          >
            ← Prev
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'mono-font min-w-[32px] rounded-[2px] px-2.5 py-1.5 text-xs font-semibold transition-colors',
              currentPage === page
                ? 'border border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'mono-font flex items-center gap-1 rounded-[2px] border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium transition-colors',
              currentPage === totalPages
                ? 'cursor-not-allowed opacity-40'
                : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
            ]"
          >
            Next →
          </button>
        </div>
      </nav>
    </main>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] py-16 text-center text-sm text-[var(--color-text-muted)]"
    >
      No writings found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPage = ref(1)
const postsPerPage = 8

const { data: posts } = await useAsyncData('all-blog-posts', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

const totalPages = computed(() => {
  const total = (posts.value || []).length
  return Math.ceil(total / postsPerPage) || 1
})

const paginatedPosts = computed(() => {
  const all = posts.value || []
  const start = (currentPage.value - 1) * postsPerPage
  return all.slice(start, start + postsPerPage)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

useSeoMeta({
  title: 'All Writings - Muhammad Irfan Kurniawan',
  description: 'Complete archive of technical essays and post-mortems by Muhammad Irfan Kurniawan.',
  ogTitle: 'All Writings - Muhammad Irfan Kurniawan',
  ogDescription:
    'Complete archive of technical essays and post-mortems by Muhammad Irfan Kurniawan.'
})
</script>
