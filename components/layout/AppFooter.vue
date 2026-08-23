<template>
  <footer
    class="mt-16 border-t border-[var(--border-subtle)] py-8 text-xs text-[var(--text-muted)] transition-colors"
  >
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6"
    >
      <div>
        <p>© 2026 Muhammad Irfan Kurniawan</p>
        <p class="text-[11px] text-[var(--text-dim)]">
          High-Legibility Minimalist · Warm Monochrome
        </p>
      </div>

      <div class="mono-font flex flex-wrap items-center gap-4 text-[11px]">
        <NuxtLink to="/logo" class="hover:text-[var(--text-primary)] hover:underline"
          >Brand & Logo</NuxtLink
        >
        <span>·</span>
        <a
          href="mailto:mail@irfankurniawan.com"
          class="hover:text-[var(--text-primary)] hover:underline"
          >mail@irfankurniawan.com</a
        >
        <span>·</span>
        <a
          href="https://github.com/prostiate"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-[var(--text-primary)] hover:underline"
          >GitHub</a
        >
        <span>·</span>
        <a
          href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-[var(--text-primary)] hover:underline"
          >LinkedIn</a
        >
      </div>
    </div>
  </footer>
</template>
