<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-up">
    
    <div class="space-y-2 pb-6 border-b border-[var(--border-subtle)]">
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">Writing & Essays</h1>
      <p class="text-sm text-[var(--text-secondary)]">
        Deep-dives into browser performance, systems architecture, real-world hardware limits, and local-first software.
      </p>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-1.5 pt-4">
        <button 
          v-for="tag in allTags" 
          :key="tag"
          @click="activeTag = tag"
          :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', activeTag === tag ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]']"
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
        class="py-6 group cursor-pointer space-y-2"
      >
        <NuxtLink :to="post.path" class="block">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h2 class="text-lg font-bold text-[var(--text-primary)] group-hover:underline">
              {{ post.title }}
            </h2>
            <div class="text-xs mono-font text-[var(--text-muted)] whitespace-nowrap">
              {{ post.date }} · {{ post.readTime }}
            </div>
          </div>
          <p class="text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
            {{ post.description }}
          </p>
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span 
              v-for="tag in post.tags" 
              :key="tag" 
              class="text-[10px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
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
  return queryCollection('blog')
    .order('date', 'DESC')
    .all()
})

const allTags = computed(() => {
  const set = new Set(['All'])
  ;(posts.value || []).forEach(post => {
    ;(post.tags || []).forEach((t: string) => set.add(t))
  })
  return Array.from(set)
})

const filteredPosts = computed(() => {
  const list = posts.value || []
  if (activeTag.value === 'All') return list
  return list.filter(p => (p.tags || []).includes(activeTag.value))
})

useSeoMeta({
  title: 'Writing & Essays - Muhammad Irfan Kurniawan',
  description: 'Technical essays, browser performance deep-dives, and systems architecture notes by Muhammad Irfan Kurniawan.',
  ogTitle: 'Writing & Essays - Muhammad Irfan Kurniawan',
  ogDescription: 'Technical essays, browser performance deep-dives, and systems architecture notes by Muhammad Irfan Kurniawan.'
})
</script>
