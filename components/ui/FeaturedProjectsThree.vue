<template>
  <div class="space-y-6">
    <div
      class="flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
          <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Featured Projects (Option 2: Three.js 3D Mesh)
          </h2>
        </div>
        <p class="text-xs text-[var(--text-secondary)]">
          Interactive real-time WebGL 3D architectural mesh. Drag to rotate the 3D topology.
        </p>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center gap-2">
        <span
          class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
        >
          0{{ activeIndex + 1 }} / 0{{ projects.length }}
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="prevProject"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
            title="Previous (Left Arrow)"
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            @click="nextProject"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
            title="Next (Right Arrow)"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Horizontal Tabs -->
    <div
      ref="tabsRef"
      class="no-scrollbar flex touch-pan-x select-none items-center gap-2 overflow-x-auto scroll-smooth pb-1"
    >
      <button
        v-for="(p, idx) in projects"
        :key="p.id || p.title"
        @click="activeIndex = idx"
        :class="[
          'mono-font flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-all',
          activeIndex === idx
            ? 'bg-[var(--text-primary)] font-semibold text-[var(--bg-canvas)] shadow-sm'
            : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
        ]"
      >
        <span>0{{ idx + 1 }}.</span>
        <span>{{ p.title }}</span>
      </button>
    </div>

    <!-- 3D Interactive Card Showcase -->
    <div
      v-if="currentProject"
      class="grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm lg:grid-cols-12"
    >
      <!-- Left: Three.js Interactive WebGL 3D Canvas (5 cols) -->
      <div
        class="relative flex flex-col justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 lg:col-span-5 lg:border-b-0 lg:border-r"
      >
        <div
          class="mono-font z-10 flex items-center justify-between text-[11px] text-[var(--text-muted)]"
        >
          <span class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
            WebGL 3D Topology Mesh
          </span>
          <span>Rotate: Drag Mouse</span>
        </div>

        <!-- Canvas Container -->
        <div
          ref="canvasContainer"
          class="relative my-2 h-64 w-full cursor-grab active:cursor-grabbing sm:h-72"
          @mousedown="onCanvasMouseDown"
          @mousemove="onCanvasMouseMove"
          @mouseup="onCanvasMouseUp"
          @mouseleave="onCanvasMouseUp"
        ></div>

        <!-- 3D Architecture Badge Overlay -->
        <div
          class="mono-font bg-[var(--bg-surface)]/80 z-10 flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-[11px] backdrop-blur-sm"
        >
          <span class="text-[var(--text-secondary)]">{{ meshModeName }}</span>
          <span class="text-emerald-600 dark:text-emerald-400">60 FPS Hardware Rendered</span>
        </div>
      </div>

      <!-- Right: Project Specifications (7 cols) -->
      <div class="flex flex-col justify-between space-y-6 p-6 sm:p-8 lg:col-span-7">
        <div class="space-y-4">
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

          <!-- Problem Solved Section -->
          <div
            v-if="currentProject.problemSolved"
            class="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 text-xs"
          >
            <span class="block font-semibold text-[var(--text-primary)]"
              >Architecture Problem Solved:</span
            >
            <p class="leading-relaxed text-[var(--text-secondary)]">
              {{ currentProject.problemSolved }}
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="tag in currentProject.tags || []"
              :key="tag"
              class="mono-font rounded border border-[var(--border-subtle)] bg-[var(--bg-code)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div
          class="mono-font flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-4 text-xs"
        >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

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
const tabsRef = ref<HTMLElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)

const { isDark } = useTheme()

// Three.js State
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animFrame: number | null = null
let activeMeshGroup: THREE.Group | null = null
let isVisible = true

// Drag interaction state
let isDraggingCanvas = false
let previousMousePosition = { x: 0, y: 0 }
let targetRotationX = 0
let targetRotationY = 0

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

const meshModeName = computed(() => {
  const idx = activeIndex.value
  if (idx === 0) return 'Topology: WebGPU Tensor Ring'
  if (idx === 1) return 'Topology: Monorepo Package Graph'
  if (idx === 2) return 'Topology: JWT Cryptographic Vault'
  if (idx === 3) return 'Topology: Cluster Node Matrix'
  if (idx === 4) return 'Topology: WireGuard Tunnel Mesh'
  return 'Topology: RBAC Permissions Plane'
})

const nextProject = () => {
  if (!props.projects.length) return
  activeIndex.value = (activeIndex.value + 1) % props.projects.length
}

const prevProject = () => {
  if (!props.projects.length) return
  activeIndex.value = (activeIndex.value - 1 + props.projects.length) % props.projects.length
}

// Auto-track active tab into view
watch(activeIndex, async (idx) => {
  await nextTick()
  if (!tabsRef.value) return
  const buttons = tabsRef.value.querySelectorAll('button')
  const target = buttons[idx]
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }
  rebuildMesh(idx)
})

const getThemeColors = () => {
  return {
    primary: isDark.value ? 0xf4f4f5 : 0x1c1917,
    accent: isDark.value ? 0x10b981 : 0x059669,
    subtle: isDark.value ? 0x3f3f46 : 0xd4d0c5,
    wire: isDark.value ? 0x27272a : 0xe4e0d6
  }
}

watch(isDark, () => {
  rebuildMesh(activeIndex.value)
})

const rebuildMesh = (index: number) => {
  if (!scene) return
  if (activeMeshGroup) {
    scene.remove(activeMeshGroup)
    activeMeshGroup.clear()
  }

  activeMeshGroup = new THREE.Group()
  const colors = getThemeColors()

  const primaryMat = new THREE.MeshStandardMaterial({
    color: colors.primary,
    roughness: 0.3,
    metalness: 0.2,
    wireframe: true
  })

  const accentMat = new THREE.MeshStandardMaterial({
    color: colors.accent,
    roughness: 0.2,
    metalness: 0.4
  })

  const subtleWireMat = new THREE.MeshBasicMaterial({
    color: colors.subtle,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  })

  if (index === 0) {
    // OnoToolkit: Torus + Orbiting Spheres (WebGPU tensor pipelines)
    const torusGeo = new THREE.TorusGeometry(32, 10, 16, 60)
    const torus = new THREE.Mesh(torusGeo, primaryMat)
    activeMeshGroup.add(torus)

    const ringCount = 8
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2
      const nodeGeo = new THREE.SphereGeometry(2.5, 12, 12)
      const node = new THREE.Mesh(nodeGeo, accentMat)
      node.position.set(Math.cos(angle) * 32, Math.sin(angle) * 32, i % 2 === 0 ? 8 : -8)
      activeMeshGroup.add(node)
    }
  } else if (index === 1) {
    // Amazone Monorepo: 3 Interconnected Tiered Polygonal Layers
    for (let layer = 0; layer < 3; layer++) {
      const y = (layer - 1) * 22
      const cylinderGeo = new THREE.CylinderGeometry(28 - layer * 5, 28 - layer * 5, 4, 6)
      const cyl = new THREE.Mesh(cylinderGeo, layer === 0 ? primaryMat : subtleWireMat)
      cyl.position.y = y
      activeMeshGroup.add(cyl)

      const coreNode = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 12), accentMat)
      coreNode.position.set(0, y, 0)
      activeMeshGroup.add(coreNode)
    }
  } else if (index === 2) {
    // Amazone Auth Service: Cryptographic Octahedron / Icosahedron Security Vault
    const icoGeo = new THREE.IcosahedronGeometry(30, 1)
    const ico = new THREE.Mesh(icoGeo, primaryMat)
    activeMeshGroup.add(ico)

    const innerGeo = new THREE.OctahedronGeometry(16, 0)
    const inner = new THREE.Mesh(innerGeo, accentMat)
    activeMeshGroup.add(inner)
  } else if (index === 3) {
    // K3s / Docker Migration: 3D Cluster Rack Matrix (Nodes in 3D grid)
    const boxGeo = new THREE.BoxGeometry(10, 10, 10)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isCenter = x === 0 && y === 0 && z === 0
          const isAccent = (x + y + z) % 2 === 0
          const box = new THREE.Mesh(
            boxGeo,
            isCenter ? accentMat : isAccent ? primaryMat : subtleWireMat
          )
          box.position.set(x * 20, y * 20, z * 20)
          activeMeshGroup.add(box)
        }
      }
    }
  } else if (index === 4) {
    // PG Client Mobile: WireGuard Encrypted Tunnel Cylinder
    const cylGeo = new THREE.CylinderGeometry(24, 24, 60, 16, 8, true)
    const tunnel = new THREE.Mesh(cylGeo, primaryMat)
    tunnel.rotation.x = Math.PI / 2
    activeMeshGroup.add(tunnel)

    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(2.5, 8, 8), accentMat)
      p.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (i - 2.5) * 10)
      activeMeshGroup.add(p)
    }
  } else {
    // Access Buttons: Multi-Layer Matrix Plane
    const planeGeo = new THREE.PlaneGeometry(55, 55, 6, 6)
    const plane = new THREE.Mesh(planeGeo, primaryMat)
    plane.rotation.x = -Math.PI / 3
    activeMeshGroup.add(plane)

    const accentSphere = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), accentMat)
    accentSphere.position.set(0, 10, 0)
    activeMeshGroup.add(accentSphere)
  }

  scene.add(activeMeshGroup)
}

const onCanvasMouseDown = (e: MouseEvent) => {
  isDraggingCanvas = true
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

const onCanvasMouseMove = (e: MouseEvent) => {
  if (!isDraggingCanvas || !activeMeshGroup) return
  const deltaX = e.clientX - previousMousePosition.x
  const deltaY = e.clientY - previousMousePosition.y

  targetRotationY += deltaX * 0.008
  targetRotationX += deltaY * 0.008

  previousMousePosition = { x: e.clientX, y: e.clientY }
}

const onCanvasMouseUp = () => {
  isDraggingCanvas = false
}

const initThree = () => {
  if (!canvasContainer.value) return
  const width = canvasContainer.value.clientWidth || 300
  const height = canvasContainer.value.clientHeight || 280

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.z = 110

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.innerHTML = ''
  canvasContainer.value.appendChild(renderer.domElement)

  // Subtle ambient + directional lights
  const ambient = new THREE.AmbientLight(0xffffff, 1.2)
  scene.add(ambient)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8)
  dirLight.position.set(50, 60, 80)
  scene.add(dirLight)

  rebuildMesh(activeIndex.value)
  animate()
}

const animate = () => {
  if (!isVisible) {
    animFrame = requestAnimationFrame(animate)
    return
  }

  animFrame = requestAnimationFrame(animate)

  if (activeMeshGroup) {
    if (!isDraggingCanvas) {
      activeMeshGroup.rotation.y += 0.006
      activeMeshGroup.rotation.x += 0.003
    } else {
      activeMeshGroup.rotation.y += (targetRotationY - activeMeshGroup.rotation.y) * 0.1
      activeMeshGroup.rotation.x += (targetRotationX - activeMeshGroup.rotation.x) * 0.1
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const onResize = () => {
  if (!canvasContainer.value || !renderer || !camera) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight || 280
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)

  // IntersectionObserver to pause rendering when off-screen
  if (canvasContainer.value) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        isVisible = entry.isIntersecting
      }
    })
    observer.observe(canvasContainer.value)
  }
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', onResize)
  if (renderer) renderer.dispose()
})
</script>
