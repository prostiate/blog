<template>
  <div 
    v-if="isSearchOpen" 
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
    @click.self="closeSearch"
  >
    <div class="w-full max-w-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden animate-fade-up">
      <div class="p-3 border-b border-[var(--border-subtle)] flex items-center gap-2">
        <svg class="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search projects, essays, or technologies..." 
          class="w-full bg-transparent text-sm text-[var(--text-primary)] focus:outline-none placeholder-[var(--text-muted)]"
          autofocus
        />
        <button @click="closeSearch" class="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">ESC</button>
      </div>

      <div class="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)] text-xs">
        <div v-if="searchResults.length === 0 && searchQuery" class="p-4 text-center text-[var(--text-muted)]">
          No results found for "{{ searchQuery }}".
        </div>
        <div v-if="!searchQuery" class="p-4 text-center text-[var(--text-muted)]">
          Type to search across projects, technical notes, and architecture essays.
        </div>
        <NuxtLink 
          v-for="(item, idx) in searchResults" 
          :key="idx"
          :to="item.link"
          @click="closeSearch"
          class="block p-3 hover:bg-[var(--bg-surface)] rounded-lg transition-colors cursor-pointer"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-[var(--text-primary)]">{{ item.title }}</span>
            <span class="mono-font text-[10px] text-[var(--text-muted)] uppercase">{{ item.type }}</span>
          </div>
          <p class="text-[var(--text-secondary)] line-clamp-1 text-[11px]">{{ item.subtitle }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isSearchOpen, searchQuery, closeSearch } = useSearch()

const staticIndex = [
  { type: 'Project', title: 'OnoToolkit', subtitle: 'Privacy-first suite of high-performance browser tools running via WASM & WebGPU', link: '/projects' },
  { type: 'Project', title: 'onowarung', subtitle: 'Local-first multi-tenant POS SaaS for Indonesian warungs', link: '/projects' },
  { type: 'Project', title: 'Amazone Monorepo', subtitle: 'Unified Bun + Turborepo monorepo powering 6 production retail apps', link: '/projects' },
  { type: 'Project', title: 'pg-client-mobile', subtitle: 'Android-first Flutter GUI client for PostgreSQL with SQL safety guards', link: '/projects' },
  { type: 'Project', title: 'AccessButtons', subtitle: 'Premium floating media volume controller for Android built with Kotlin & Compose', link: '/projects' },
  { type: 'Project', title: 'Amazone Auth Service', subtitle: 'In-house Go GraphQL authentication backend with revocable JWTs', link: '/projects' },
  { type: 'Essay', title: 'Retiring Kubernetes', subtitle: 'Why we moved 6 production services back to Docker Compose', link: '/blog/retiring-kubernetes-docker-compose-production' },
  { type: 'Essay', title: 'Running ONNX Models in Browser', subtitle: 'Zero-server privacy architecture with WebGPU & WASM', link: '/blog/in-browser-onnx-webgpu-privacy-tools' },
  { type: 'Essay', title: 'Designing for Chrome 109 on Windows 7', subtitle: 'Solving real-world UI thread freezes on 10-year-old cashier machines', link: '/blog/designing-for-chrome-109-windows-7-retail-pos' },
  { type: 'Essay', title: 'Edge-First Architecture with Cloudflare & Neon', subtitle: 'Multi-tenant local-first sync pipeline with sub-50ms latency', link: '/blog/edge-first-architecture-cloudflare-hono-neon' }
]

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return staticIndex.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.subtitle.toLowerCase().includes(q)
  )
})

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isSearchOpen.value = !isSearchOpen.value
    }
    if (e.key === 'Escape' && isSearchOpen.value) {
      closeSearch()
    }
  })
})
</script>
