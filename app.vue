<template>
  <div class="flex min-h-screen flex-col justify-between">
    <!-- Top Reading Progress Indicator -->
    <LayoutReadingProgress v-if="isBlogPost" />

    <!-- Navigation Header -->
    <LayoutAppHeader />

    <!-- Main Dynamic Route View -->
    <main class="w-full flex-grow">
      <NuxtPage />
    </main>

    <!-- Global Search Modal (Cmd+K) -->
    <LayoutSearchModal />

    <!-- Minimalist Footer -->
    <LayoutAppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { initTheme } = useTheme()

const isBlogPost = computed(() => route.path.startsWith('/blog/'))

onMounted(() => {
  initTheme()
})
</script>
