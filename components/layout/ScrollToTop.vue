<template>
  <button
    @click="scrollToTop"
    :class="[
      'fixed bottom-6 right-6 z-30 flex h-9 w-9 items-center justify-center rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] shadow-none transition-all duration-300 ease-in-out hover:border-[var(--color-accent)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] sm:bottom-8 sm:right-8',
      isVisible
        ? 'pointer-events-auto translate-y-0 opacity-100'
        : 'pointer-events-none translate-y-3 opacity-0'
    ]"
    title="Scroll to top"
    aria-label="Scroll to top"
  >
    <svg
      class="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      ></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
const isVisible = ref(false)
let ticking = false

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      isVisible.value = window.scrollY > 300
      ticking = false
    })
    ticking = true
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
