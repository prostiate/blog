<template>
  <div
    v-if="isSearchOpen"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-16 backdrop-blur-sm sm:pt-24"
    @click.self="closeSearch"
  >
    <div
      class="animate-fade-up w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl"
    >
      <!-- Search Input Bar -->
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
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search projects, blog posts, technologies..."
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

      <!-- Search Content Area -->
      <div class="max-h-96 overflow-y-auto p-2 text-xs">
        <!-- If Query has No Matches -->
        <div
          v-if="searchResults.length === 0 && searchQuery"
          class="p-6 text-center text-[var(--text-muted)]"
        >
          No results found for "<span class="font-medium text-[var(--text-primary)]">{{
            searchQuery
          }}</span
          >".
        </div>

        <!-- Filtered Results when Searching -->
        <div v-else-if="searchQuery" class="space-y-1">
          <NuxtLink
            v-for="(item, idx) in searchResults"
            :key="idx"
            :to="item.link"
            @click="closeSearch"
            class="block cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-[var(--bg-surface)]"
          >
            <div class="mb-0.5 flex items-center justify-between">
              <span class="font-semibold text-[var(--text-primary)]">{{ item.title }}</span>
              <span
                class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
              >
                {{ item.type }}
              </span>
            </div>
            <p class="line-clamp-1 text-[11px] text-[var(--text-secondary)]">{{ item.subtitle }}</p>
          </NuxtLink>
        </div>

        <!-- Default State: Quick Navigation & Suggestions when Query is Empty -->
        <div v-else class="space-y-4 p-1">
          <!-- Section 1: Navigation -->
          <div>
            <span
              class="mono-font mb-1.5 block px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
            >
              Quick Navigation
            </span>
            <div class="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              <NuxtLink
                to="/"
                @click="closeSearch"
                class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
              >
                <svg
                  class="h-3.5 w-3.5 text-[var(--text-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </NuxtLink>

              <NuxtLink
                to="/projects"
                @click="closeSearch"
                class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
              >
                <svg
                  class="h-3.5 w-3.5 text-[var(--text-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Projects
              </NuxtLink>

              <NuxtLink
                to="/blog"
                @click="closeSearch"
                class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
              >
                <svg
                  class="h-3.5 w-3.5 text-[var(--text-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
                Blog
              </NuxtLink>

              <NuxtLink
                to="/about"
                @click="closeSearch"
                class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
              >
                <svg
                  class="h-3.5 w-3.5 text-[var(--text-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                About
              </NuxtLink>
            </div>
          </div>

          <!-- Section 2: Recommended Deep Dives -->
          <div>
            <span
              class="mono-font mb-1.5 block px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
            >
              Suggested Reading & Projects
            </span>
            <div class="space-y-1">
              <NuxtLink
                v-for="(item, idx) in suggestedItems"
                :key="idx"
                :to="item.link"
                @click="closeSearch"
                class="block cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-[var(--bg-surface)]"
              >
                <div class="mb-0.5 flex items-center justify-between">
                  <span class="font-semibold text-[var(--text-primary)]">{{ item.title }}</span>
                  <span
                    class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
                  >
                    {{ item.type }}
                  </span>
                </div>
                <p class="line-clamp-1 text-[11px] text-[var(--text-secondary)]">
                  {{ item.subtitle }}
                </p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Hint -->
      <div
        class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-[10px] text-[var(--text-muted)]"
      >
        <span>Search documentation, projects & blog posts</span>
        <div class="flex items-center gap-2">
          <span
            ><kbd class="rounded border border-[var(--border-subtle)] px-1">ESC</kbd> to close</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isSearchOpen, searchQuery, closeSearch } = useSearch()

const suggestedItems = [
  {
    type: 'Project',
    title: 'OnoToolkit',
    subtitle: 'Privacy-first suite of browser tools running via WASM, WebGPU, and ONNX Runtime Web',
    link: '/projects'
  },
  {
    type: 'Essay',
    title: 'The Kubernetes Deployment That Taught Me to Measure the Disk',
    subtitle: 'Why baremetal SAS HDD I/O saturation led to retiring K3s in favor of Docker Compose',
    link: '/blog/kubernetes-storage-postmortem-multi-vm-blue-green-automation'
  },
  {
    type: 'Essay',
    title: '23 MB I Never Load: Ghostscript & ONNX to Cloudflare',
    subtitle: 'How a 14-line Rollup plugin deleted unrequested payloads and cut client size by 45%',
    link: '/blog/23-mb-i-never-load-cloudflare-wasm-payload'
  },
  {
    type: 'Project',
    title: 'AccessButtons',
    subtitle: 'Premium floating media volume controller for Android built with Kotlin & Compose',
    link: '/projects'
  }
]

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
    type: 'Project',
    title: 'Baremetal CI/CD & Platform Modernization',
    subtitle: 'Health-gated rolling deployment pipeline on Docker Compose + Jenkins',
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
      if (!isSearchOpen.value) {
        searchQuery.value = ''
      }
    }
    if (e.key === 'Escape' && isSearchOpen.value) {
      closeSearch()
    }
  })
})
</script>
