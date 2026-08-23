<template>
  <div class="animate-fade-up mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
    <div class="space-y-2 border-b border-[var(--border-subtle)] pb-6">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Blog</h1>
      <p class="text-sm text-[var(--text-secondary)]">
        Personal notes, engineering thoughts, and honest post-mortems. Might be right, might be
        wrong - take what helps and decide for yourself.
      </p>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-1.5 pt-4">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="activeTag = tag"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            activeTag === tag
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 2-Column Blog Cards Grid -->
    <div v-if="paginatedPosts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <article
        v-for="post in paginatedPosts"
        :key="post.path || post.title"
        class="group flex flex-col justify-between space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[var(--border-medium)] hover:shadow-sm"
      >
        <div class="space-y-2.5">
          <div class="mono-font flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{{ post.date }}</span>
            <span>{{ post.readTime }}</span>
          </div>

          <NuxtLink :to="post.path" class="block">
            <h2
              class="text-base font-bold leading-snug text-[var(--text-primary)] group-hover:underline sm:text-lg"
            >
              {{ post.title }}
            </h2>
          </NuxtLink>

          <p class="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ post.description }}
          </p>
        </div>

        <div class="space-y-3 border-t border-[var(--border-subtle)] pt-3">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags || []"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 text-center text-sm text-[var(--text-muted)]"
    >
      No blog posts found for "{{ activeTag }}".
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 sm:flex-row"
    >
      <div class="mono-font text-xs text-[var(--text-muted)]">
        Showing {{ (currentPage - 1) * postsPerPage + 1 }}-{{
          Math.min(currentPage * postsPerPage, filteredPosts.length)
        }}
        of {{ filteredPosts.length }} posts
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          :class="[
            'mono-font flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium transition-colors',
            currentPage === 1
              ? 'cursor-not-allowed opacity-40'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
          ]"
        >
          ← Prev
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'mono-font min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
            currentPage === page
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="[
            'mono-font flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium transition-colors',
            currentPage === totalPages
              ? 'cursor-not-allowed opacity-40'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
          ]"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const activeTag = ref('All')
const currentPage = ref(1)
const postsPerPage = 6 // 2 columns x 3 rows = 6 posts per page

const { data: posts } = await useAsyncData('all-blog-posts', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

const allTags = computed(() => {
  const set = new Set(['All'])
  ;(posts.value || []).forEach((post) => {
    ;(post.tags || []).forEach((t: string) => set.add(t))
  })
  return Array.from(set)
})

const filteredPosts = computed(() => {
  const list = posts.value || []
  if (activeTag.value === 'All') return list
  return list.filter((p) => (p.tags || []).includes(activeTag.value))
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

watch(activeTag, () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

useSeoMeta({
  title: 'Blog - Muhammad Irfan Kurniawan',
  description:
    'Personal notes, engineering thoughts, and honest post-mortems by Muhammad Irfan Kurniawan.',
  ogTitle: 'Blog - Muhammad Irfan Kurniawan',
  ogDescription:
    'Personal notes, engineering thoughts, and honest post-mortems by Muhammad Irfan Kurniawan.'
})
</script>
