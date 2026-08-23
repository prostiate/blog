<template>
  <div
    v-if="isSearchOpen"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm"
    @click.self="closeSearch"
  >
    <div
      class="animate-fade-up w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl"
    >
      <div class="flex items-center gap-2 border-b border-[var(--border-subtle)] p-3">
        <svg
          class="h-4 w-4 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search projects, essays, or technologies..."
          class="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          autofocus
        />
        <button
          @click="closeSearch"
          class="rounded border border-[var(--border-subtle)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ESC
        </button>
      </div>

      <div class="max-h-80 divide-y divide-[var(--border-subtle)] overflow-y-auto p-2 text-xs">
        <div
          v-if="searchResults.length === 0 && searchQuery"
          class="p-4 text-center text-[var(--text-muted)]"
        >
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
          class="block cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--bg-surface)]"
        >
          <div class="mb-1 flex items-center justify-between">
            <span class="font-bold text-[var(--text-primary)]">{{ item.title }}</span>
            <span class="mono-font text-[10px] uppercase text-[var(--text-muted)]">{{
              item.type
            }}</span>
          </div>
          <p class="line-clamp-1 text-[11px] text-[var(--text-secondary)]">{{ item.subtitle }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isSearchOpen, searchQuery, closeSearch } = useSearch()

const staticIndex = [
  {
    type: 'Project',
    title: 'OnoToolkit',
    subtitle: 'Privacy-first suite of high-performance browser tools running via WASM & WebGPU',
    link: '/projects'
  },
  {
    type: 'Project',
    title: 'Amazone Monorepo',
    subtitle: 'Unified Bun + Turborepo monorepo powering 6 production retail apps',
    link: '/projects'
  },
  {
    type: 'Project',
    title: 'pg-client-mobile',
    subtitle: 'Android-first Flutter GUI client for PostgreSQL with SQL safety guards',
    link: '/projects'
  },
  {
    type: 'Project',
    title: 'AccessButtons',
    subtitle: 'Premium floating media volume controller for Android built with Kotlin & Compose',
    link: '/projects'
  },
  {
    type: 'Project',
    title: 'Amazone Auth Service',
    subtitle: 'In-house Go GraphQL authentication backend with revocable JWTs',
    link: '/projects'
  },
  {
    type: 'Essay',
    title: '23 MB I Never Load: Ghostscript & ONNX to Cloudflare',
    subtitle: 'How a 14-line Rollup plugin deleted unrequested payloads and cut client size by 45%',
    link: '/blog/23-mb-i-never-load-cloudflare-wasm-payload'
  },
  {
    type: 'Essay',
    title: 'An Inpainting Model That Only Touches Painted Pixels',
    subtitle: 'MI-GAN inpainting through ONNX Runtime Web with byte-identical raster guarantees',
    link: '/blog/inpainting-only-touches-painted-pixels'
  },
  {
    type: 'Essay',
    title: 'One Canvas, Two Frozen Tracks: Screen Recorder Architecture',
    subtitle: 'Overcoming MediaRecorder track limitations during mid-session recording transitions',
    link: '/blog/screen-recorder-frozen-tracks'
  },
  {
    type: 'Essay',
    title: 'You Cannot Polyfill @property',
    subtitle: 'Why shipping legacy CSS polyfills broke modern browsers and how we fixed it',
    link: '/blog/you-cannot-polyfill-css-property-legacy-browser-support'
  },
  {
    type: 'Essay',
    title: 'I Spent a Day Building a Monorepo I Argued Against',
    subtitle: 'Eliminating duplicate UI components across 3 Nuxt applications with Bun & Turborepo',
    link: '/blog/monorepo-i-argued-against-counting-the-duplication'
  },
  {
    type: 'Essay',
    title: 'The Kubernetes Deployment That Taught Me to Measure the Disk',
    subtitle: 'Why baremetal SAS HDD I/O saturation led to retiring K3s in favor of Docker Compose',
    link: '/blog/kubernetes-storage-postmortem-multi-vm-blue-green-automation'
  },
  {
    type: 'Essay',
    title: 'From Copy-Pasted Frontends to One Shared Nuxt Layer',
    subtitle: 'Extracting cashier applications and combining retail frontends cleanly',
    link: '/blog/micro-frontend-evolution-cashier-backoffice-v2-nuxt-monorepo'
  },
  {
    type: 'Essay',
    title: 'Replacing Hosted Authentication Without Wishful Thinking',
    subtitle: 'Migrating from Firebase Auth to in-house Go GraphQL auth with revocable JWTs',
    link: '/blog/replacing-firebase-auth-custom-golang-nuxt-engine'
  },
  {
    type: 'Essay',
    title: 'Self-Hosting the Delivery Loop on a Tight Resource Budget',
    subtitle: 'Joining builds, private registry, secret delivery, and multi-node releases',
    link: '/blog/privacy-first-self-hosted-infrastructure-cicd-observability'
  },
  {
    type: 'Essay',
    title: 'Building a Small VM Platform Without Pretending It Is a Cloud',
    subtitle: 'Managing baremetal Linux VMs and resilient operations with transparency',
    link: '/blog/multi-node-vm-infrastructure-baremetal-os'
  },
  {
    type: 'Essay',
    title: 'Lessons Learned from 13 Rounds of Production Iterations',
    subtitle: 'Mistakes, hotfixes, and architectural evolution across 13 release cycles',
    link: '/blog/lessons-learned-from-13-rounds-of-production-iterations'
  }
]

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return staticIndex.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
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
