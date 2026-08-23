<template>
  <div class="animate-fade-up mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
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

    <!-- Article List -->
    <div class="divide-y divide-[var(--border-subtle)]">
      <article
        v-for="post in filteredPosts"
        :key="post.path || post.title"
        class="group cursor-pointer space-y-2 py-6"
      >
        <NuxtLink :to="post.path" class="block">
          <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
            <h2 class="text-lg font-bold text-[var(--text-primary)] group-hover:underline">
              {{ post.title }}
            </h2>
            <div class="mono-font whitespace-nowrap text-xs text-[var(--text-muted)]">
              {{ post.date }} · {{ post.readTime }}
            </div>
          </div>
          <p class="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ post.description }}
          </p>
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]"
            >
              #{{ tag }}
            </span>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTag = ref('All')

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

useSeoMeta({
  title: 'Blog - Muhammad Irfan Kurniawan',
  description:
    'Personal notes, engineering thoughts, and honest post-mortems by Muhammad Irfan Kurniawan.',
  ogTitle: 'Blog - Muhammad Irfan Kurniawan',
  ogDescription:
    'Personal notes, engineering thoughts, and honest post-mortems by Muhammad Irfan Kurniawan.'
})
</script>
