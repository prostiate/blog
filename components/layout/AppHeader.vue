<template>
  <header
    class="bg-[var(--bg-canvas)]/90 sticky top-0 z-40 border-b border-[var(--border-subtle)] backdrop-blur-md transition-colors"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <!-- Brand Logo Lockup -->
      <NuxtLink to="/" class="group flex items-center gap-2.5">
        <UiLogoMark />
        <span class="text-sm font-semibold tracking-tight text-[var(--text-primary)]"
          >Irfan Kurniawan</span
        >
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 text-sm font-medium md:flex">
        <NuxtLink
          to="/"
          :class="[
            'rounded-lg px-3 py-1.5 transition-colors',
            isCurrent('/')
              ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/projects"
          :class="[
            'rounded-lg px-3 py-1.5 transition-colors',
            isCurrent('/projects')
              ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          Projects
        </NuxtLink>
        <NuxtLink
          to="/blog"
          :class="[
            'rounded-lg px-3 py-1.5 transition-colors',
            isCurrent('/blog')
              ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          Writing
        </NuxtLink>
        <NuxtLink
          to="/about"
          :class="[
            'rounded-lg px-3 py-1.5 transition-colors',
            isCurrent('/about')
              ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          ]"
        >
          About
        </NuxtLink>
      </nav>

      <!-- Right Actions: Search + Theme Switcher -->
      <div class="flex items-center gap-2">
        <button
          @click="openSearch"
          class="flex items-center gap-1.5 rounded-lg p-2 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          title="Search (Cmd+K)"
          aria-label="Search"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span
            class="mono-font hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-1.5 py-0.5 text-[11px] sm:inline-block"
            >⌘K</span
          >
        </button>

        <UiThemeToggle />
      </div>
    </div>

    <!-- Mobile Subnavigation Bar -->
    <div
      class="flex items-center justify-around border-t border-[var(--border-subtle)] px-2 py-1.5 text-xs font-medium md:hidden"
    >
      <NuxtLink
        to="/"
        :class="[
          'rounded-md px-3 py-1',
          isCurrent('/')
            ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)]'
        ]"
        >Home</NuxtLink
      >
      <NuxtLink
        to="/projects"
        :class="[
          'rounded-md px-3 py-1',
          isCurrent('/projects')
            ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)]'
        ]"
        >Projects</NuxtLink
      >
      <NuxtLink
        to="/blog"
        :class="[
          'rounded-md px-3 py-1',
          isCurrent('/blog')
            ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)]'
        ]"
        >Writing</NuxtLink
      >
      <NuxtLink
        to="/about"
        :class="[
          'rounded-md px-3 py-1',
          isCurrent('/about')
            ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)]'
        ]"
        >About</NuxtLink
      >
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
