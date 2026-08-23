<template>
  <svg
    :class="[
      'rounded-lg shadow-sm transition-transform group-hover:scale-105',
      customClass || 'h-8 w-8'
    ]"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="22" class="fill-[#1C1917] dark:fill-[#F0EEE6]" />
    <!-- 'I' Column (Full Vertical Stack) -->
    <rect
      x="23"
      y="24"
      width="13"
      height="52"
      rx="6.5"
      class="fill-[#FAF9F5] dark:fill-[#1C1917]"
    />
    <!-- 'K' Pillar -->
    <rect
      x="43"
      y="24"
      width="13"
      height="52"
      rx="6.5"
      class="fill-[#FAF9F5] dark:fill-[#1C1917]"
    />
    <!-- 'K' Dynamic Rays (Curiosity & Perseverance) -->
    <path
      d="M56 50L73.5 28.5C75 26.5 78 26.5 79.5 28.5C81 30.5 81 33.5 79 35.5L67 51L79.5 68.5C81.5 71 81 74 78.5 75.5C76.5 77 73.5 76.5 72 74L56 52"
      class="stroke-[#FAF9F5] dark:stroke-[#1C1917]"
      stroke-width="11"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Emerald Status / Pulse Node -->
    <circle cx="49.5" cy="50" r="5" class="fill-[#10B981] dark:fill-[#059669]" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>()
</script>
