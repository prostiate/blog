<template>
  <div
    id="reading-progress"
    :style="{ width: `${progress}%` }"
    class="fixed left-0 top-0 z-50 h-[2.5px] bg-[var(--color-accent)] transition-all duration-75"
  ></div>
</template>

<script setup lang="ts">
const progress = ref(0)

const updateProgress = () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight > 0) {
    progress.value = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>
