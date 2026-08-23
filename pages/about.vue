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
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">Career Trajectory</h2>
      <div
        class="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-[2px] before:bg-[var(--border-medium)]"
      >
        <div v-for="(job, idx) in careerTrajectory" :key="idx" class="group relative">
          <span
            class="absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-canvas)] bg-[var(--text-primary)]"
          ></span>
          <div class="space-y-1">
            <div class="flex flex-wrap items-baseline justify-between gap-1">
              <h3 class="text-base font-bold text-[var(--text-primary)]">
                {{ job.role }} ·
                <span class="font-medium text-[var(--text-secondary)]">{{ job.company }}</span>
              </h3>
              <span class="mono-font text-xs text-[var(--text-muted)]">{{ job.period }}</span>
            </div>
            <p class="text-xs leading-relaxed text-[var(--text-secondary)]">{{ job.summary }}</p>
            <ul
              v-if="job.highlights"
              class="list-disc space-y-1 pl-4 pt-1 text-xs text-[var(--text-secondary)]"
            >
              <li v-for="(hl, hIdx) in job.highlights" :key="hIdx">{{ hl }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Engineering Values -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">
        Engineering Values
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="(val, idx) in engineeringValues"
          :key="idx"
          class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
        >
          <h3 class="text-sm font-semibold text-[var(--text-primary)]">{{ val.title }}</h3>
          <p class="text-xs leading-relaxed text-[var(--text-secondary)]">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Setup & Workflows -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight text-[var(--text-primary)]">Setup & Workflows</h2>
      <div
        class="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-xs"
      >
        <div>
          <span class="mb-1.5 block font-semibold text-[var(--text-primary)]"
            >Hardware & Cloud Estate:</span
          >
          <ul class="list-disc space-y-1 pl-4 text-[var(--text-secondary)]">
            <li>Primary Machine: Modern Linux / Unix Development Environment</li>
            <li>
              Personal Infrastructure: 2-node AWS EC2 cluster (m7i-flex.large, Ubuntu 24.04) running
              AI agent harnesses and Tailscale mesh
            </li>
            <li>Display & Input: Ergonomic warm-tone high-legibility display calibration</li>
          </ul>
        </div>
        <div class="border-t border-[var(--border-subtle)] pt-3">
          <span class="mb-1.5 block font-semibold text-[var(--text-primary)]"
            >Software & Tooling:</span
          >
          <ul class="list-disc space-y-1 pl-4 text-[var(--text-secondary)]">
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
      class="mono-font space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-code)] p-6 text-center text-xs"
    >
      <p class="font-semibold text-[var(--text-primary)]">
        Jakarta, Indonesia · +62 813-8545-8341 · mail@irfankurniawan.com
      </p>
      <p class="text-[var(--text-secondary)]">
        irfankurniawan.com · linkedin.com/in/muhammad-irfan-kurniawan · github.com/prostiate
      </p>
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
