<template>
  <header class="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-canvas)]/90 border-b border-[var(--border-subtle)] transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      
      <!-- Brand Logo Lockup -->
      <NuxtLink to="/" class="group flex items-center gap-2.5">
        <UiLogoMark />
        <span class="font-semibold text-sm tracking-tight text-[var(--text-primary)]">Irfan Kurniawan</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
        <NuxtLink 
          to="/" 
          :class="['px-3 py-1.5 rounded-lg transition-colors', isCurrent('/') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]']"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/projects" 
          :class="['px-3 py-1.5 rounded-lg transition-colors', isCurrent('/projects') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]']"
        >
          Projects
        </NuxtLink>
        <NuxtLink 
          to="/blog" 
          :class="['px-3 py-1.5 rounded-lg transition-colors', isCurrent('/blog') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]']"
        >
          Writing
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          :class="['px-3 py-1.5 rounded-lg transition-colors', isCurrent('/about') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]']"
        >
          About
        </NuxtLink>
      </nav>

      <!-- Right Actions: Search + Theme Switcher -->
      <div class="flex items-center gap-2">
        <button 
          @click="openSearch" 
          class="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-1.5 text-xs"
          title="Search (Cmd+K)"
          aria-label="Search"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="hidden sm:inline-block mono-font text-[11px] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)]">⌘K</span>
        </button>

        <UiThemeToggle />
      </div>
    </div>

    <!-- Mobile Subnavigation Bar -->
    <div class="md:hidden flex items-center justify-around border-t border-[var(--border-subtle)] px-2 py-1.5 text-xs font-medium">
      <NuxtLink to="/" :class="['px-3 py-1 rounded-md', isCurrent('/') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]']">Home</NuxtLink>
      <NuxtLink to="/projects" :class="['px-3 py-1 rounded-md', isCurrent('/projects') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]']">Projects</NuxtLink>
      <NuxtLink to="/blog" :class="['px-3 py-1 rounded-md', isCurrent('/blog') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]']">Writing</NuxtLink>
      <NuxtLink to="/about" :class="['px-3 py-1 rounded-md', isCurrent('/about') ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]']">About</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { openSearch } = useSearch()

const isCurrent = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
