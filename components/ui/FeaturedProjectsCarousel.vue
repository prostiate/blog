<template>
  <div class="space-y-6">
    <!-- Carousel Header Bar: Title + Tab Selectors + Arrow Navigation -->
    <div
      class="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center"
    >
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
          Featured Projects
        </h2>
        <span
          class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
        >
          {{ activeIndex + 1 }} / {{ projects.length }}
        </span>
      </div>

      <!-- Carousel Navigation Controls -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/projects"
          class="mr-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
          View all {{ projects.length }} projects →
        </NuxtLink>

        <div class="flex items-center gap-1">
          <button
            @click="prevProject"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
            title="Previous Project (Left Arrow)"
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            @click="nextProject"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
            title="Next Project (Right Arrow)"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Project Tab Strip with Drag-to-Scroll & Touch Navigation -->
    <div
      ref="tabsContainerRef"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
      :class="[
        'no-scrollbar flex touch-pan-x select-none items-center gap-2 overflow-x-auto scroll-smooth pb-1',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      ]"
    >
      <button
        v-for="(p, idx) in projects"
        :key="p.id || p.title"
        @click="selectTab(idx)"
        :class="[
          'mono-font flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-all',
          activeIndex === idx
            ? 'scale-[1.02] bg-[var(--text-primary)] font-semibold text-[var(--bg-canvas)] shadow-sm'
            : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
        ]"
      >
        <span>0{{ idx + 1 }}.</span>
        <span>{{ p.title }}</span>
      </button>
    </div>

    <!-- Active Featured Project Split Card -->
    <Transition name="carousel-fade" mode="out-in">
      <div
        v-if="currentProject"
        :key="currentProject.title"
        class="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all sm:p-8"
      >
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <!-- Left Column: Specs & Architectural Context (7 cols) -->
          <div class="space-y-5 lg:col-span-7">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2.5 py-0.5 text-xs text-[var(--text-secondary)]"
              >
                {{ currentProject.category }}
              </span>
              <span
                v-if="currentProject.featured"
                class="mono-font rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                Featured
              </span>
            </div>

            <div class="space-y-2">
              <NuxtLink v-if="currentProject.path" :to="currentProject.path" class="group block">
                <h3
                  class="text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:underline sm:text-2xl"
                >
                  {{ currentProject.title }}
                </h3>
              </NuxtLink>
              <h3
                v-else
                class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
              >
                {{ currentProject.title }}
              </h3>
              <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
                {{ currentProject.description }}
              </p>
            </div>

            <!-- Problem Solved Callout -->
            <div
              v-if="currentProject.problemSolved"
              class="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 text-xs"
            >
              <span class="block font-semibold text-[var(--text-primary)]"
                >Key Architectural Challenge:</span
              >
              <p class="leading-relaxed text-[var(--text-secondary)]">
                {{ currentProject.problemSolved }}
              </p>
            </div>

            <!-- Tech Badges -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="tag in currentProject.tags || []"
                :key="tag"
                class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Action Links -->
            <div class="mono-font flex flex-wrap items-center gap-3 pt-2 text-xs">
              <NuxtLink
                v-if="currentProject.path"
                :to="currentProject.path"
                class="flex items-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-3.5 py-2 font-semibold text-[var(--bg-canvas)] transition-opacity hover:opacity-90"
              >
                <span>Details</span>
                <span>→</span>
              </NuxtLink>

              <a
                v-if="currentProject.liveUrl"
                :href="currentProject.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path
                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"
                  />
                </svg>
                Live Demo ↗
              </a>

              <a
                v-if="currentProject.githubUrl"
                :href="currentProject.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-medium)] hover:bg-[var(--bg-code)]"
              >
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                  />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Source Code ↗
              </a>
            </div>
          </div>

          <!-- Right Column: Interactive Dynamic Architecture Visualizer (5 cols) -->
          <div class="lg:col-span-5">
            <div
              class="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5 shadow-inner"
            >
              <div
                class="mono-font mb-3 flex items-center justify-between text-[11px] text-[var(--text-muted)]"
              >
                <span class="flex items-center gap-1.5">
                  <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                  Interactive Architecture Console
                </span>
                <span>SYS.ACTV // 0{{ activeIndex + 1 }}</span>
              </div>

              <!-- Visualizer Variant 1: OnoToolkit (WASM / WebGPU Pipeline) -->
              <div
                v-if="
                  currentProject.id?.includes('onotoolkit') ||
                  currentProject.title?.includes('OnoToolkit')
                "
                class="space-y-4 py-2"
              >
                <div class="space-y-2">
                  <div
                    class="flex items-center justify-between text-xs text-[var(--text-secondary)]"
                  >
                    <span>WASM In-Browser Pipeline:</span>
                    <span class="mono-font font-semibold text-emerald-600 dark:text-emerald-400"
                      >100% Client-Side</span
                    >
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                    >
                      <div class="mono-font font-bold text-[var(--text-primary)]">ONNX Web</div>
                      <div class="text-[var(--text-muted)]">WebGPU / MI-GAN</div>
                    </div>
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                    >
                      <div class="mono-font font-bold text-[var(--text-primary)]">Ghostscript</div>
                      <div class="text-[var(--text-muted)]">WASM PDF Engine</div>
                    </div>
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                    >
                      <div class="mono-font font-bold text-[var(--text-primary)]">Canvas 60fps</div>
                      <div class="text-[var(--text-muted)]">Screen Recorder</div>
                    </div>
                  </div>
                </div>

                <div
                  class="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300"
                >
                  <div class="mono-font flex items-center gap-1.5 font-bold">
                    <span>✓ Zero Server Uploads</span>
                  </div>
                  <p class="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                    All file buffers, tensor matrix multiplications, and video rendering stay
                    isolated in client RAM.
                  </p>
                </div>
              </div>

              <!-- Visualizer Variant 2: Frontend Monorepo -->
              <div
                v-else-if="
                  currentProject.id?.includes('monorepo') ||
                  currentProject.title?.includes('Monorepo')
                "
                class="space-y-3 py-2"
              >
                <div class="mono-font text-xs text-[var(--text-secondary)]">
                  Shared Architecture Topology:
                </div>
                <div class="space-y-2 text-xs">
                  <div
                    class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                  >
                    <div
                      class="flex items-center justify-between font-semibold text-[var(--text-primary)]"
                    >
                      <span>📦 @amazone/ui-layer</span>
                      <span class="mono-font text-[10px] text-emerald-600 dark:text-emerald-400"
                        >Nuxt 3 Layer</span
                      >
                    </div>
                    <div class="mono-font mt-1 text-[11px] text-[var(--text-muted)]">
                      Shared design system, pinia auth store & composables
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[11px]">
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">Cashier PWA</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Point of Sale Client
                      </div>
                    </div>
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">Backoffice V2</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Inventory & Reports
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-muted)]"
                >
                  <span>Bundler: Bun + Turborepo</span>
                  <span class="text-emerald-600 dark:text-emerald-400">0% Code Duplication</span>
                </div>
              </div>

              <!-- Visualizer Variant 3: Go Auth Service -->
              <div
                v-else-if="
                  currentProject.id?.includes('auth') || currentProject.title?.includes('Auth')
                "
                class="space-y-3 py-2"
              >
                <div class="mono-font text-xs text-[var(--text-secondary)]">
                  Zero-Trust JWT Flow:
                </div>
                <div class="space-y-2 text-xs">
                  <div
                    class="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                  >
                    <div>
                      <div class="font-bold text-[var(--text-primary)]">Go GraphQL Engine</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        gqlgen + Argon2id Hashing
                      </div>
                    </div>
                    <span
                      class="mono-font rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400"
                      >&lt; 15ms</span
                    >
                  </div>
                  <div
                    class="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5"
                  >
                    <div>
                      <div class="font-bold text-[var(--text-primary)]">Redis Token Blacklist</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Instant session revocation & replay guard
                      </div>
                    </div>
                    <span class="mono-font text-[10px] text-[var(--text-muted)]">O(1) Check</span>
                  </div>
                </div>
                <div
                  class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-muted)]"
                >
                  <span>Replaced: Firebase Auth</span>
                  <span class="text-emerald-600 dark:text-emerald-400">Self-Hosted Go Runtime</span>
                </div>
              </div>

              <!-- Visualizer Variant 4: K8s to Docker Migration -->
              <div
                v-else-if="
                  currentProject.id?.includes('docker') ||
                  currentProject.id?.includes('k8s') ||
                  currentProject.title?.includes('Docker')
                "
                class="space-y-3 py-2"
              >
                <div class="mono-font text-xs text-[var(--text-secondary)]">
                  Measured SAS Storage Optimization:
                </div>
                <div class="space-y-2 text-xs">
                  <div
                    class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                  >
                    <div class="flex justify-between font-semibold text-[var(--text-primary)]">
                      <span>Sequential Compose Rollouts</span>
                      <span class="mono-font text-emerald-600 dark:text-emerald-400"
                        >14ms Latency</span
                      >
                    </div>
                    <div class="mono-font mt-1 text-[10px] text-[var(--text-muted)]">
                      Eliminated 150ms I/O queue thrashing on SAS HDDs
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[11px]">
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">HAProxy Ingress</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Blue/Green Routing
                      </div>
                    </div>
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">Tailscale Mesh</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Zero-Exposed Ports
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-muted)]"
                >
                  <span>Guarantees: Zero-Downtime</span>
                  <span class="text-emerald-600 dark:text-emerald-400">4.5x Faster Deploys</span>
                </div>
              </div>

              <!-- Visualizer Variant 5: PG Client Mobile -->
              <div
                v-else-if="
                  currentProject.id?.includes('pg-client') ||
                  currentProject.title?.includes('PostgreSQL')
                "
                class="space-y-3 py-2"
              >
                <div class="mono-font text-xs text-[var(--text-secondary)]">
                  Secure Mobile Tunnel Topology:
                </div>
                <div class="space-y-2 text-xs">
                  <div
                    class="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                  >
                    <div>
                      <div class="font-bold text-[var(--text-primary)]">Flutter Client App</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Offline SQLite Schema Cache
                      </div>
                    </div>
                    <span class="mono-font text-[10px] text-emerald-600 dark:text-emerald-400"
                      >P2P Mesh</span
                    >
                  </div>
                  <div
                    class="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5"
                  >
                    <div>
                      <div class="font-bold text-[var(--text-primary)]">WireGuard / SSH Tunnel</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Direct remote database administration
                      </div>
                    </div>
                    <span class="mono-font text-[10px] text-[var(--text-muted)]">AES-256</span>
                  </div>
                </div>
                <div
                  class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-muted)]"
                >
                  <span>Stack: Flutter + Dart</span>
                  <span class="text-emerald-600 dark:text-emerald-400">Encrypted Admin</span>
                </div>
              </div>

              <!-- Visualizer Variant 6: Default / Access Buttons -->
              <div v-else class="space-y-3 py-2">
                <div class="mono-font text-xs text-[var(--text-secondary)]">
                  Enterprise Systems Architecture:
                </div>
                <div class="space-y-2 text-xs">
                  <div
                    class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] p-2.5"
                  >
                    <div class="flex justify-between font-semibold text-[var(--text-primary)]">
                      <span>Granular RBAC Engine</span>
                      <span class="mono-font text-emerald-600 dark:text-emerald-400"
                        >Micro-App Event Bus</span
                      >
                    </div>
                    <div class="mono-font mt-1 text-[11px] text-[var(--text-muted)]">
                      Dynamic navigation matrix across enterprise roles
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[11px]">
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">Vue 3 / TypeScript</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Composable Stores
                      </div>
                    </div>
                    <div
                      class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                    >
                      <div class="font-bold text-[var(--text-primary)]">Tailwind UI</div>
                      <div class="mono-font text-[10px] text-[var(--text-muted)]">
                        Accessible Design
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mono-font flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-muted)]"
                >
                  <span>Scale: Multi-Tenant Enterprise</span>
                  <span class="text-emerald-600 dark:text-emerald-400">High Reliability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export interface ProjectItem {
  id?: string
  title: string
  category: string
  description: string
  problemSolved?: string
  architecture?: string[]
  tags?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  featured?: boolean
  path?: string
}

const props = defineProps<{
  projects: ProjectItem[]
}>()

const activeIndex = ref(0)
const tabsContainerRef = ref<HTMLElement | null>(null)

// Drag-to-scroll state
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
let hasMoved = false

const currentProject = computed<ProjectItem>(() => {
  const defaultProj: ProjectItem = {
    title: 'Project',
    category: 'Full Stack',
    description: '',
    tags: []
  }
  const list = props.projects || []
  if (!list.length) return defaultProj
  return list[activeIndex.value] ?? list[0] ?? defaultProj
})

// Auto-track and smoothly scroll active button into view
watch(activeIndex, async (idx) => {
  await nextTick()
  if (!tabsContainerRef.value) return
  const buttons = tabsContainerRef.value.querySelectorAll('button')
  const targetBtn = buttons[idx] as HTMLElement
  if (targetBtn) {
    targetBtn.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }
})

const nextProject = () => {
  if (!props.projects.length) return
  activeIndex.value = (activeIndex.value + 1) % props.projects.length
}

const prevProject = () => {
  if (!props.projects.length) return
  activeIndex.value = (activeIndex.value - 1 + props.projects.length) % props.projects.length
}

const onMouseDown = (e: MouseEvent) => {
  if (!tabsContainerRef.value) return
  isDragging.value = true
  hasMoved = false
  startX.value = e.pageX - tabsContainerRef.value.offsetLeft
  scrollLeft.value = tabsContainerRef.value.scrollLeft
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !tabsContainerRef.value) return
  e.preventDefault()
  const x = e.pageX - tabsContainerRef.value.offsetLeft
  const walk = (x - startX.value) * 1.5
  if (Math.abs(walk) > 4) {
    hasMoved = true
  }
  tabsContainerRef.value.scrollLeft = scrollLeft.value - walk
}

const onMouseUp = () => {
  isDragging.value = false
}

const onMouseLeave = () => {
  isDragging.value = false
}

const selectTab = (idx: number) => {
  if (!hasMoved) {
    activeIndex.value = idx
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextProject()
  } else if (e.key === 'ArrowLeft') {
    prevProject()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.carousel-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.carousel-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
