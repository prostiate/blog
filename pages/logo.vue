<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16 animate-fade-up">
    
    <!-- Studio Header -->
    <section class="space-y-4 pb-8 border-b border-[var(--border-subtle)]">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Warm Monochrome Visual Identity
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
        The "IK" Monogram & System Mark
      </h1>
      <p class="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
        A bespoke geometric monogram encoding Muhammad Irfan Kurniawan's engineering philosophy: the vertical spine of full-stack systems, diagonal curiosity vectors, and the emerald local-first heartbeat node.
      </p>
    </section>

    <!-- Section 1: Logo Showcase & Render Gallery -->
    <section class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">Logo Variations & Lockups</h2>
        <span class="text-xs mono-font text-[var(--text-muted)]">Vector SVG & High-Res PNG</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Variant A: Dark Charcoal Squircle -->
        <div class="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[#121214] text-white space-y-6 flex flex-col justify-between shadow-lg">
          <div>
            <div class="flex items-center justify-between mb-8">
              <span class="text-[11px] mono-font uppercase tracking-wider text-zinc-400">Primary Mark · Dark Charcoal</span>
              <span class="text-[10px] mono-font px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Default</span>
            </div>
            <div class="flex justify-center py-6">
              <svg id="svg-mark-dark" class="w-36 h-36 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="22" fill="#1C1917"/>
                <rect x="0.5" y="0.5" width="99" height="99" rx="21.5" stroke="#2E2B28" stroke-width="1"/>
                <rect x="23" y="24" width="13" height="52" rx="6.5" fill="#FAF9F5"/>
                <rect x="43" y="24" width="13" height="52" rx="6.5" fill="#FAF9F5"/>
                <path d="M56 50L73.5 28.5C75 26.5 78 26.5 79.5 28.5C81 30.5 81 33.5 79 35.5L67 51L79.5 68.5C81.5 71 81 74 78.5 75.5C76.5 77 73.5 76.5 72 74L56 52" stroke="#FAF9F5" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="49.5" cy="50" r="5" fill="#10B981"/>
              </svg>
            </div>
          </div>
          <div class="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span class="mono-font text-zinc-400">#1C1917 / #FAF9F5 / #10B981</span>
            <a href="/assets/logo/logo-mark-dark.png" download="logo-mark-dark.png" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium mono-font flex items-center gap-1.5 transition-colors">
              <span>Download PNG</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        <!-- Variant B: Warm Paper Alabaster -->
        <div class="p-8 rounded-2xl border border-[#E6E3DA] bg-[#FAF9F5] text-[#1C1917] space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-8">
              <span class="text-[11px] mono-font uppercase tracking-wider text-stone-500">Light Mark · Warm Paper</span>
              <span class="text-[10px] mono-font px-2 py-0.5 rounded bg-[#F0EEE6] border border-[#E6E3DA] text-stone-600">Alabaster</span>
            </div>
            <div class="flex justify-center py-6">
              <svg id="svg-mark-light" class="w-36 h-36 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="22" fill="#F0EEE6"/>
                <rect x="0.5" y="0.5" width="99" height="99" rx="21.5" stroke="#E2DFD4" stroke-width="1"/>
                <rect x="23" y="24" width="13" height="52" rx="6.5" fill="#1C1917"/>
                <rect x="43" y="24" width="13" height="52" rx="6.5" fill="#1C1917"/>
                <path d="M56 50L73.5 28.5C75 26.5 78 26.5 79.5 28.5C81 30.5 81 33.5 79 35.5L67 51L79.5 68.5C81.5 71 81 74 78.5 75.5C76.5 77 73.5 76.5 72 74L56 52" stroke="#1C1917" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="49.5" cy="50" r="5" fill="#059669"/>
              </svg>
            </div>
          </div>
          <div class="pt-4 border-t border-[#E6E3DA] flex items-center justify-between text-xs">
            <span class="mono-font text-stone-500">#F0EEE6 / #1C1917 / #059669</span>
            <a href="/assets/logo/logo-mark-light.png" download="logo-mark-light.png" class="px-3 py-1.5 rounded-lg bg-[#EAE7DC] hover:bg-[#DDD8CA] text-[#1C1917] font-medium mono-font flex items-center gap-1.5 transition-colors">
              <span>Download PNG</span>
              <span>↓</span>
            </a>
          </div>
        </div>

      </div>
    </section>

    <!-- Section 2: Full Horizontal Wordmark Lockup -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">Full Horizontal Lockup</h2>
      
      <div class="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-4 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-subtle)]">
          <div class="flex items-center gap-5">
            <UiLogoMark custom-class="w-14 h-14" />
            <div>
              <span class="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] block">Muhammad Irfan Kurniawan</span>
              <span class="text-xs sm:text-sm font-medium mono-font text-[var(--text-secondary)] tracking-wider uppercase block mt-0.5">Senior Full Stack Engineer</span>
            </div>
          </div>

          <a href="/assets/logo/logo-lockup-dark.png" download="logo-lockup-dark.png" class="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold text-xs mono-font hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap">
            <span>Export Lockup PNG</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Section 3: Anatomy & Symbolism -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">Logo Anatomy & Symbolism</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div class="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs mono-font text-[var(--text-primary)]">
            01
          </div>
          <h3 class="font-semibold text-sm text-[var(--text-primary)]">The Full-Stack Vertical</h3>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            The primary solid column 'I' represents end-to-end systems ownership: from baremetal storage and edge infrastructure up to polished client-side interfaces.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div class="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs mono-font text-[var(--text-primary)]">
            02
          </div>
          <h3 class="font-semibold text-sm text-[var(--text-primary)]">Curiosity Vectors</h3>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            The upper diagonal ray branches outwards into unexplored technology territory: WebGPU, WASM, local-first syncing, and edge runtimes.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div class="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs mono-font text-[var(--text-primary)]">
            03
          </div>
          <h3 class="font-semibold text-sm text-[var(--text-primary)]">Perseverance Anchor</h3>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            The grounded lower diagonal establishes stability: seeing problems through to production, load testing, and engineering resilient runbooks.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div class="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs mono-font text-[var(--text-primary)]">
            04
          </div>
          <h3 class="font-semibold text-sm text-[var(--text-primary)]">The Emerald Node</h3>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            The focal green circle represents active system health, local-first device synchronization, and the pulse of live production code.
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Brand Identity & Logo Studio - Muhammad Irfan Kurniawan',
  description: 'Design tokens, geometry breakdown, and high-resolution PNG brand assets for Muhammad Irfan Kurniawan.',
  ogTitle: 'Brand Identity & Logo Studio - Muhammad Irfan Kurniawan'
})
</script>
