<template>
  <div
    class="animate-fade-up reading-column mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 sm:py-12"
  >
    <!-- Header -->
    <div class="space-y-4 border-b border-[var(--border-subtle)] pb-6">
      <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        About & Background
      </h1>
      <p class="text-base leading-relaxed text-[var(--text-secondary)]">
        I am a Senior Full Stack Engineer based in Jakarta, Indonesia with 8+ years of professional
        engineering experience spanning web applications, IoT streaming, and distributed edge
        infrastructure.
      </p>
      <div
        class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs italic text-[var(--text-primary)]"
      >
        "Driven by relentless curiosity, sustained by perseverance."
      </div>
    </div>

    <!-- Career Trajectory -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
        Career Trajectory
      </h2>
      <div
        class="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-[2px] before:bg-[var(--border-medium)]"
      >
        <div v-for="(job, idx) in careerTrajectory" :key="idx" class="group relative">
          <span
            class="absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-canvas)] bg-[var(--text-primary)]"
          ></span>
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-baseline justify-between gap-1">
              <h3 class="text-base font-bold text-[var(--text-primary)]">
                {{ job.role }} ·
                <span class="font-medium text-[var(--text-secondary)]">{{ job.company }}</span>
              </h3>
              <span class="mono-font text-xs text-[var(--text-muted)]">{{ job.period }}</span>
            </div>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ job.summary }}</p>
            <ul
              v-if="job.highlights"
              class="list-disc space-y-1 pl-4 pt-1 text-sm text-[var(--text-secondary)]"
            >
              <li v-for="(hl, hIdx) in job.highlights" :key="hIdx">{{ hl }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Engineering Values -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
        Engineering Values
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="(val, idx) in engineeringValues"
          :key="idx"
          class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
        >
          <h3 class="text-base font-bold text-[var(--text-primary)]">{{ val.title }}</h3>
          <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Setup & Workflows -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
        Setup & Workflows
      </h2>
      <div
        class="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-sm"
      >
        <div>
          <span class="mb-1.5 block font-semibold text-[var(--text-primary)]"
            >Hardware & Cloud Estate:</span
          >
          <ul class="list-disc space-y-1.5 pl-4 text-[var(--text-secondary)]">
            <li>Primary Machine: Modern Linux / Unix Development Environment</li>
            <li>
              Personal Infrastructure: 2-node AWS EC2 cluster (m7i-flex.large, Ubuntu 24.04) running
              AI agent harnesses and Tailscale mesh
            </li>
            <li>Display & Input: Ergonomic warm-tone high-legibility display calibration</li>
          </ul>
        </div>
        <div class="border-t border-[var(--border-subtle)] pt-4">
          <span class="mb-1.5 block font-semibold text-[var(--text-primary)]"
            >Software & Tooling:</span
          >
          <ul class="list-disc space-y-1.5 pl-4 text-[var(--text-secondary)]">
            <li>Editor: VS Code / Cursor / Neovim with Geist Mono font</li>
            <li>Terminal: Tmux, zsh, Tailscale mesh networking</li>
            <li>Edge & Runtime: Bun, Node.js, Cloudflare Workers, Docker</li>
            <li>
              AI Practice: Deliberate AI-assisted development (Claude Code, Gemini, Copilot) for
              elevated engineering throughput
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Canonical Contact Block -->
    <div
      class="mono-font space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-code)] p-6 text-center text-xs"
    >
      <p class="font-semibold text-[var(--text-primary)]">Jakarta, Indonesia</p>
      <div
        class="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-secondary)]"
      >
        <a
          href="mailto:mail@irfankurniawan.com"
          class="flex items-center gap-1.5 hover:text-[var(--text-primary)] hover:underline"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          mail@irfankurniawan.com
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://github.com/prostiate"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-[var(--text-primary)] hover:underline"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
            />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          github.com/prostiate
        </a>
        <span class="text-[var(--border-medium)]">·</span>
        <a
          href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-[var(--text-primary)] hover:underline"
        >
          <svg
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const careerTrajectory = [
  {
    period: 'May 2025 - Present',
    role: 'Senior Full Stack Developer',
    company: 'Amazone Indonesia',
    location: 'Jakarta',
    summary:
      'Senior individual contributor owning the frontend monorepo (Bun + Turborepo), Go/GraphQL authentication services, and production deployment topology across 6 business-critical retail applications.',
    highlights: [
      'Consolidated 3 separate Nuxt applications into a unified Bun + Turborepo monorepo with shared @amazone/base layer.',
      'Engineered an in-house Go/GraphQL authentication service with revocable JWT tokens replacing Firebase across all backoffice and POS systems.',
      'Conducted storage benchmarks on baremetal servers, leading the technical decision to retire K3s in favor of zero-downtime Docker Compose rolling deploys.'
    ]
  },
  {
    period: 'Jan 2023 - May 2025',
    role: 'Senior Full Stack Developer',
    company: 'Kompas Gramedia MNP',
    location: 'Tangerang',
    summary:
      'Sole engineer designing and developing the university academic information ecosystem (SIAKAD), digital library systems, and infrastructure observability.',
    highlights: [
      'Built full-stack platforms using Yii, NestJS, React, Next.js, Oracle, and MySQL with Keycloak RBAC and Kong API Gateway.',
      'Automated CI/CD pipelines with GitHub Actions and Jenkins, and established observability with Prometheus, Grafana, Loki, and Jaeger.',
      'Implemented computer-vision visitor tracking with Python, Kafka, and NestJS.'
    ]
  },
  {
    period: 'Jul 2021 - Dec 2022',
    role: 'IT Solutions Consultant',
    company: 'Manufacturing Client',
    location: 'Cikarang',
    summary:
      'Built real-time IoT monitoring dashboards visualizing streaming metrics from 50+ production robotic devices via WebSockets, Laravel, and React.'
  },
  {
    period: 'May 2020 - Nov 2022',
    role: 'Full Stack Developer',
    company: 'PT Bank Rakyat Indonesia Tbk (BRI)',
    location: 'Jakarta',
    summary:
      'Sole developer building internal Human Resource Management Systems (HRMS) and Asset Monitoring applications with CodeIgniter and MySQL.'
  },
  {
    period: 'Apr 2019 - Apr 2020',
    role: 'Full Stack Developer',
    company: 'Vastech Indonesia',
    location: 'Bekasi',
    summary:
      'Mastered accounting domain concepts from scratch (Chart of Accounts, journal ledgers) to build and deploy an inventory and financial management platform reaching 15 pilot customers in 6 months.'
  }
]

const engineeringValues = [
  {
    title: 'Curiosity as the Primary Engine',
    desc: 'Adopting technologies out of genuine desire to understand how they work under the hood - exploring WebGPU in the browser, compiling Ghostscript to WASM, and building edge-native services.'
  },
  {
    title: 'Perseverance in Production',
    desc: 'Staying with complex engineering problems until they are truly resolved for real users - whether troubleshooting disk I/O bottlenecks on baremetal or optimizing UI threads on 10-year-old cashier hardware.'
  },
  {
    title: 'Pragmatic Engineering over Hype',
    desc: 'Unapologetically choosing simpler, rock-solid architectures (like Docker Compose over Kubernetes) when hardware constraints demand it, and writing clear documentation for teammates.'
  },
  {
    title: 'Understanding the Full Vertical',
    desc: 'Taking pride in owning features from database schema design and edge APIs through component implementation and deployment pipelines.'
  }
]

useSeoMeta({
  title: 'About - Muhammad Irfan Kurniawan',
  description:
    'Career trajectory, engineering values, and technical background of Muhammad Irfan Kurniawan.',
  ogTitle: 'About - Muhammad Irfan Kurniawan',
  ogDescription:
    'Career trajectory, engineering values, and technical background of Muhammad Irfan Kurniawan.'
})
</script>
