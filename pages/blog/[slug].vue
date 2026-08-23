<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-up">
    
    <!-- Back Button -->
    <NuxtLink to="/blog" class="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 mb-8">
      ← Back to all essays
    </NuxtLink>

    <div v-if="post" class="flex flex-col lg:flex-row justify-between items-start gap-10 xl:gap-16">
      
      <!-- Main Article Column (Strictly 65ch to 68ch) -->
      <article class="w-full max-w-[68ch] flex-grow">
        
        <header class="space-y-4 pb-8 border-b border-[var(--border-subtle)]">
          <div class="flex items-center gap-2 text-xs mono-font text-[var(--text-muted)]">
            <span>{{ post.date }}</span>
            <span>·</span>
            <span>{{ post.readTime }}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            {{ post.title }}
          </h1>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span 
              v-for="tag in post.tags" 
              :key="tag" 
              class="text-[11px] mono-font px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
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
        <div class="mt-12 p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 not-prose">
          <div class="flex items-center gap-3">
            <UiLogoMark custom-class="w-10 h-10" />
            <div>
              <h4 class="font-semibold text-sm text-[var(--text-primary)]">Muhammad Irfan Kurniawan</h4>
              <p class="text-xs text-[var(--text-secondary)]">Senior Full Stack Engineer · Jakarta, Indonesia</p>
            </div>
          </div>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            Writing about production architecture, frontend ergonomics, browser performance, and practical systems engineering.
          </p>
        </div>
      </article>

      <!-- Desktop Table of Contents Side-Rail -->
      <aside v-if="post.body?.toc?.links && post.body.toc.links.length" class="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-24 self-start pl-6 border-l border-[var(--border-subtle)] space-y-4 not-prose">
        <div class="space-y-3 text-xs">
          <span class="font-semibold uppercase tracking-wider text-[var(--text-muted)] block mono-font text-[11px]">
            Table of Contents
          </span>
          
          <nav class="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
            <template v-for="(link, lIdx) in post.body.toc.links" :key="link.id">
              <a 
                :href="`#${link.id}`" 
                :class="['toc-link', activeId === link.id ? 'active' : '']"
              >
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

          <div class="pt-4 border-t border-[var(--border-subtle)]">
            <span class="text-[11px] text-[var(--text-muted)] block mb-1.5">Share this essay:</span>
            <button 
              @click="copyArticleLink" 
              class="w-full text-left px-2.5 py-1.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-code)] text-[var(--text-primary)] border border-[var(--border-subtle)] mono-font text-[11px] flex items-center justify-between transition-colors"
            >
              <span v-if="copied" class="text-emerald-600 dark:text-emerald-400 font-semibold">Copied to Clipboard!</span>
              <span v-else>Copy Link</span>
              <span>{{ copied ? '✓' : '📋' }}</span>
            </button>
          </div>
        </div>
      </aside>

    </div>

    <!-- 404 fallback if not found -->
    <div v-else class="text-center py-20 space-y-4">
      <h2 class="text-xl font-bold text-[var(--text-primary)]">Essay not found</h2>
      <p class="text-sm text-[var(--text-secondary)]">The requested article could not be located.</p>
      <NuxtLink to="/blog" class="inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-canvas)]">
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { rootMargin: '0px 0px -70% 0px' })

  headings.forEach(h => observer.observe(h))
})
</script>
