<template>
  <header
    class="bg-[var(--color-bg)]/95 sticky top-0 z-40 border-b border-[var(--color-border)] backdrop-blur-sm transition-colors"
  >
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
      <!-- Editorial Brand Lockup -->
      <NuxtLink to="/" class="text-decoration-none group flex items-center gap-2">
        <UiLogoMark custom-class="w-6 h-6 text-[var(--color-text)]" />
        <span
          class="font-serif text-base font-semibold tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]"
        >
          Muhammad Irfan Kurniawan
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-6 font-mono text-xs md:flex">
        <NuxtLink
          to="/"
          :class="[
            'transition-colors hover:text-[var(--color-accent)] hover:no-underline',
            isCurrent('/')
              ? 'font-semibold text-[var(--color-accent)] underline decoration-1 underline-offset-4'
              : 'text-[var(--color-text-muted)] no-underline'
          ]"
        >
          Writing
        </NuxtLink>
        <NuxtLink
          to="/projects"
          :class="[
            'transition-colors hover:text-[var(--color-accent)] hover:no-underline',
            isCurrent('/projects')
              ? 'font-semibold text-[var(--color-accent)] underline decoration-1 underline-offset-4'
              : 'text-[var(--color-text-muted)] no-underline'
          ]"
        >
          Projects
        </NuxtLink>
        <NuxtLink
          to="/about"
          :class="[
            'transition-colors hover:text-[var(--color-accent)] hover:no-underline',
            isCurrent('/about')
              ? 'font-semibold text-[var(--color-accent)] underline decoration-1 underline-offset-4'
              : 'text-[var(--color-text-muted)] no-underline'
          ]"
        >
          About
        </NuxtLink>
      </nav>

      <!-- Right Actions: Search + Theme Switcher -->
      <div class="flex items-center gap-3">
        <button
          @click="openSearch"
          class="mono-font flex items-center gap-1.5 rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
          title="Search (Cmd+K)"
          aria-label="Search"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span class="hidden sm:inline-block">⌘K</span>
        </button>

        <UiThemeToggle />
      </div>
    </div>

    <!-- Mobile Subnavigation Bar -->
    <div
      class="flex items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-2 font-mono text-xs md:hidden"
    >
      <NuxtLink
        to="/"
        :class="[
          'no-underline transition-colors',
          isCurrent('/')
            ? 'font-semibold text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)]'
        ]"
      >
        Writing
      </NuxtLink>
      <NuxtLink
        to="/projects"
        :class="[
          'no-underline transition-colors',
          isCurrent('/projects')
            ? 'font-semibold text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)]'
        ]"
      >
        Projects
      </NuxtLink>
      <NuxtLink
        to="/about"
        :class="[
          'no-underline transition-colors',
          isCurrent('/about')
            ? 'font-semibold text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)]'
        ]"
      >
        About
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { openSearch } = useSearch()

const isCurrent = (path: string) => {
  if (path === '/') return route.path === '/' || route.path.startsWith('/blog')
  return route.path.startsWith(path)
}
</script>
