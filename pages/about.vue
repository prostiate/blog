<template>
  <div class="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
    <!-- Header -->
    <header class="border-b border-[var(--color-border)] pb-8">
      <p class="section-label">Background & Trajectory</p>
      <h1
        class="mb-3 font-serif text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
      >
        About & Engineering Background
      </h1>
      <p class="mb-0 text-base leading-relaxed text-[var(--color-text-muted)]">
        Senior Full Stack Engineer based in Jakarta, Indonesia with 8+ years of professional
        engineering experience spanning web applications, IoT streaming, distributed systems, and
        edge infrastructure.
      </p>
    </header>

    <!-- Career Trajectory -->
    <section class="space-y-6">
      <h2 class="font-serif text-2xl font-semibold text-[var(--color-text)]">Career Trajectory</h2>
      <div
        class="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-[1px] before:bg-[var(--color-border)]"
      >
        <div v-for="(job, idx) in careerTrajectory" :key="idx" class="group relative">
          <span
            class="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-accent)]"
          ></span>
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="font-serif text-base font-semibold text-[var(--color-text)]">
                {{ job.role }} ·
                <span class="font-sans font-medium text-[var(--color-text-muted)]">{{
                  job.company
                }}</span>
              </h3>
              <span class="mono-font text-xs text-[var(--color-text-muted)]">{{ job.period }}</span>
            </div>
            <p class="text-sm leading-relaxed text-[var(--color-text-muted)]">{{ job.summary }}</p>
            <ul
              v-if="job.highlights"
              class="list-disc space-y-1 pl-4 pt-1 text-sm text-[var(--color-text-muted)]"
            >
              <li v-for="(hl, hIdx) in job.highlights" :key="hIdx">{{ hl }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Engineering Values -->
    <section class="space-y-6">
      <h2 class="font-serif text-2xl font-semibold text-[var(--color-text)]">
        Engineering Principles
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="(val, idx) in engineeringValues"
          :key="idx"
          class="space-y-2 rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
        >
          <h3 class="font-serif text-base font-semibold text-[var(--color-text)]">
            {{ val.title }}
          </h3>
          <p class="text-sm leading-relaxed text-[var(--color-text-muted)]">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Canonical Contact Block -->
    <div
      class="mono-font space-y-3 rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 text-center text-xs"
    >
      <p class="font-semibold text-[var(--color-text)]">Jakarta, Indonesia</p>
      <div
        class="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]"
      >
        <a
          href="mailto:mail@irfankurniawan.com"
          class="flex items-center gap-1.5 hover:text-[var(--color-accent)]"
        >
          mail@irfankurniawan.com
        </a>
        <span class="text-[var(--color-border)]">·</span>
        <a
          href="https://github.com/prostiate"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-[var(--color-accent)]"
        >
          github.com/prostiate
        </a>
        <span class="text-[var(--color-border)]">·</span>
        <a
          href="https://www.linkedin.com/in/muhammad-irfan-kurniawan/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-[var(--color-accent)]"
        >
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
