<template>
  <div class="flex min-h-screen flex-col justify-between">
    <!-- Top Reading Progress Indicator -->
    <LayoutReadingProgress v-if="isReadingPage" />

    <!-- Navigation Header -->
    <LayoutAppHeader />

    <!-- Main Dynamic Route View -->
    <main class="w-full flex-grow">
      <NuxtPage />
    </main>

    <!-- Global Search Modal (Cmd+K) -->
    <LayoutSearchModal />

    <!-- Global Floating Scroll-To-Top Button -->
    <LayoutScrollToTop />

    <!-- Minimalist Footer -->
    <LayoutAppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { initTheme } = useTheme()

const isReadingPage = computed(() => {
  const p = route.path
  return (
    (p.startsWith('/blog/') && p !== '/blog') || (p.startsWith('/projects/') && p !== '/projects')
  )
})

onMounted(() => {
  initTheme()
})
</script>
