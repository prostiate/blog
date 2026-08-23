<template>
  <div ref="container" class="interactive-canvas-box not-prose my-6 h-72"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animationFrameId: number | null = null
let particleGroup: THREE.Group | null = null
let particleData: Array<{
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  isAccent: boolean
}> = []
let linesMesh: THREE.LineSegments | null = null
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

const { isDark } = useTheme()

const getThemeColors = () => {
  return {
    nodeColor: isDark.value ? 0xededed : 0x1c1917,
    nodeAccent: isDark.value ? 0x10b981 : 0x059669,
    lineColor: isDark.value ? 0x3f3f46 : 0xd7d3c7,
    lineOpacity: isDark.value ? 0.35 : 0.45
  }
}

const updateTheme = () => {
  const colors = getThemeColors()
  particleData.forEach((p) => {
    ;(p.mesh.material as THREE.MeshBasicMaterial).color.setHex(
      p.isAccent ? colors.nodeAccent : colors.nodeColor
    )
  })
  if (linesMesh) {
    ;(linesMesh.material as THREE.LineBasicMaterial).color.setHex(colors.lineColor)
  }
}

watch(isDark, () => {
  updateTheme()
})

const initThree = () => {
  if (!container.value) return

  const width = container.value.clientWidth || 600
  const height = container.value.clientHeight || 280

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000)
  camera.position.z = 300

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)

  const colors = getThemeColors()
  particleGroup = new THREE.Group()
  scene.add(particleGroup)

  const geo = new THREE.SphereGeometry(2.2, 12, 12)
  const accentGeo = new THREE.SphereGeometry(3.5, 16, 16)
  const mat = new THREE.MeshBasicMaterial({
    color: colors.nodeColor,
    transparent: true,
    opacity: 0.85
  })
  const accentMat = new THREE.MeshBasicMaterial({
    color: colors.nodeAccent,
    transparent: true,
    opacity: 0.95
  })

  particleData = []
  const count = 45
  const bounds = { x: 220, y: 110, z: 90 }

  for (let i = 0; i < count; i++) {
    const isAccent = i % 8 === 0
    const mesh = new THREE.Mesh(
      isAccent ? accentGeo : geo,
      isAccent ? accentMat.clone() : mat.clone()
    )
    const posX = (Math.random() - 0.5) * bounds.x * 2
    const posY = (Math.random() - 0.5) * bounds.y * 2
    const posZ = (Math.random() - 0.5) * bounds.z * 2

    mesh.position.set(posX, posY, posZ)
    particleGroup.add(mesh)

    particleData.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.2
      ),
      isAccent
    })
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: colors.lineColor,
    transparent: true,
    opacity: colors.lineOpacity
  })

  const maxLines = (count * (count - 1)) / 2
  const positions = new Float32Array(maxLines * 6)
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  )

  linesMesh = new THREE.LineSegments(lineGeo, lineMat)
  scene.add(linesMesh)

  animate()
}

const onMouseMove = (e: MouseEvent) => {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  mouse.targetX = x * 35
  mouse.targetY = y * 25
}

const onMouseLeave = () => {
  mouse.targetX = 0
  mouse.targetY = 0
}

const onResize = () => {
  if (!container.value || !renderer || !camera) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight || 280
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  mouse.x += (mouse.targetX - mouse.x) * 0.05
  mouse.y += (mouse.targetY - mouse.y) * 0.05

  if (camera) {
    camera.position.x = mouse.x
    camera.position.y = mouse.y
    camera.lookAt(0, 0, 0)
  }

  if (particleGroup) {
    particleGroup.rotation.y += 0.0015
  }

  const bounds = { x: 220, y: 110, z: 90 }
  let lineIdx = 0
  const posAttr = linesMesh?.geometry.attributes.position
  const positions = posAttr?.array as Float32Array

  for (let i = 0; i < particleData.length; i++) {
    const p = particleData[i]
    if (!p) continue
    p.mesh.position.add(p.velocity)

    if (p.mesh.position.x < -bounds.x || p.mesh.position.x > bounds.x) p.velocity.x *= -1
    if (p.mesh.position.y < -bounds.y || p.mesh.position.y > bounds.y) p.velocity.y *= -1
    if (p.mesh.position.z < -bounds.z || p.mesh.position.z > bounds.z) p.velocity.z *= -1

    for (let j = i + 1; j < particleData.length; j++) {
      const p2 = particleData[j]
      if (!p2) continue
      const dist = p.mesh.position.distanceTo(p2.mesh.position)

      if (dist < 130 && positions) {
        positions[lineIdx++] = p.mesh.position.x
        positions[lineIdx++] = p.mesh.position.y
        positions[lineIdx++] = p.mesh.position.z

        positions[lineIdx++] = p2.mesh.position.x
        positions[lineIdx++] = p2.mesh.position.y
        positions[lineIdx++] = p2.mesh.position.z
      }
    }
  }

  if (linesMesh && posAttr) {
    linesMesh.geometry.setDrawRange(0, lineIdx / 3)
    posAttr.needsUpdate = true
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

onMounted(() => {
  initThree()
  if (container.value) {
    container.value.addEventListener('mousemove', onMouseMove)
    container.value.addEventListener('mouseleave', onMouseLeave)
  }
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (container.value) {
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseleave', onMouseLeave)
  }
  window.removeEventListener('resize', onResize)
  if (renderer) renderer.dispose()
})
</script>
