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
        Senior Full Stack & Systems Engineer based in Jakarta, Indonesia. 8+ years of experience
        architecting, shipping, and maintaining high-concurrency retail platforms, internal systems,
        and distributed web applications—taking products from schema design to baremetal deployment.
      </p>
    </header>

    <!-- Career Trajectory -->
    <section class="space-y-6">
      <div class="flex items-baseline justify-between">
        <h2 class="font-serif text-2xl font-semibold text-[var(--color-text)]">
          Career Trajectory
        </h2>
        <span class="mono-font text-xs text-[var(--color-text-muted)]">2019 — Present</span>
      </div>
      <div
        class="relative space-y-10 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-[1px] before:bg-[var(--color-border)]"
      >
        <div v-for="(job, idx) in careerTrajectory" :key="idx" class="group relative">
          <span
            class="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-accent)]"
          ></span>
          <div class="space-y-2">
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
              class="list-disc space-y-1.5 pl-4 pt-1 text-sm text-[var(--color-text-muted)]"
            >
              <li v-for="(hl, hIdx) in job.highlights" :key="hIdx" class="leading-relaxed">
                {{ hl }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Engineering Principles -->
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
      'Sole frontend and application infrastructure owner across 6 live production systems (Head Office Backoffice, Nationwide Cashier/POS, Multi-tenant Inventory, HSE, Payout, and Auth Admin) for a nationwide retail arcade group.',
    highlights: [
      'Consolidated 3 independent Nuxt applications into a Bun + Turborepo monorepo with a shared @amazone/base layer (27 components, 8 composables, unified auth contract), cutting CI/CD build times by ~2x.',
      'Designed and built an in-house Go/GraphQL authentication service and Nuxt admin console replacing Firebase Auth across 5 backends and 6 frontends with revocable server sessions, rotating refresh tokens, and zero cutover downtime.',
      'Piloted a K3s GitOps cluster, benchmarked storage I/O, and made the evidence-based call to retire it after exposing a baremetal SAS HDD bottleneck (10–15 MB/s); rebuilt zero-downtime rolling deploys on Docker Compose + Jenkins with per-node rollback isolation.',
      'Diagnosed and resolved severe form freezes on aging in-store terminals (Chrome 109 / Windows 7) by re-architecting the interaction into server-paginated flows instead of requiring expensive store hardware upgrades.'
    ]
  },
  {
    period: 'Jan 2023 - May 2025',
    role: 'Senior Full Stack Developer',
    company: 'Kompas Gramedia (MNP)',
    location: 'Tangerang',
    summary:
      'Sole engineer designing, developing, and operating the academic information ecosystem (SIA/SIAKAD), digital library systems, and infrastructure end-to-end.',
    highlights: [
      'Engineered full-stack educational platforms with Yii (PHP), NestJS, React, Next.js, Oracle, and MySQL.',
      'Unified cross-service identity with Keycloak RBAC and integrated a Kong API Gateway for secure traffic management.',
      'Automated multi-environment CI/CD with Jenkins and GitHub Actions on Docker, and established full observability with Grafana, Prometheus, Loki, and Jaeger.',
      'Built an AI library visitor tracking system using Python, OpenCV, Kafka, and NestJS, reaching 95% check-in accuracy.'
    ]
  },
  {
    period: 'Jul 2021 - Dec 2022',
    role: 'IT Solutions Consultant',
    company: 'Manufacturing Client',
    location: 'Cikarang',
    summary:
      'Engineered real-time IoT monitoring dashboards visualizing streaming metrics from 50+ production robotic devices across factory lines via WebSockets, Laravel, MySQL, and React.'
  },
  {
    period: 'May 2020 - Nov 2022',
    role: 'Full Stack Developer',
    company: 'PT Bank Rakyat Indonesia Tbk (BRI)',
    location: 'Jakarta',
    summary:
      'Single-fighter developer building internal enterprise tooling, including a Human Resource Management System (HRMS) and Asset Monitoring applications with PHP and MySQL (+20% operational efficiency).'
  },
  {
    period: 'Apr 2019 - Apr 2020',
    role: 'Full Stack Developer',
    company: 'Vastech Indonesia',
    location: 'Bekasi',
    summary:
      'Joined an early-stage team to build an enterprise accounting and inventory management SaaS from the ground up, mastering financial accounting concepts (Chart of Accounts, journal ledgers, inventory tracking) and deploying to 15 pilot customers in 6 months.'
  }
]

const engineeringValues = [
  {
    title: 'Finisher, Not a Prototyper',
    desc: 'Six live production applications currently operate under my ownership. I build systems intended for real users under real operational constraints, not just demos.'
  },
  {
    title: 'Evidence Over Hype',
    desc: 'Willing to make pragmatic calls based on measured data—such as retiring Kubernetes when baremetal disk I/O bottlenecks were exposed, and rebuilding reliable rolling deploys on Docker Compose instead.'
  },
  {
    title: 'Engineering for Constrained Reality',
    desc: 'Prioritizing real end-users on aging, slow field hardware (like in-store Chrome 109 / Windows 7 cashiers), solving performance bottlenecks through architecture rather than demanding costly fleet upgrades.'
  },
  {
    title: 'High Clarity & Written Documentation',
    desc: 'Belief that written documentation is a core engineering deliverable. Authored 57+ implementation rounds, gap analyses, and integration guides to keep teams aligned with zero friction.'
  }
]

useSeoMeta({
  title: 'About - Muhammad Irfan Kurniawan',
  description:
    'Career trajectory, engineering principles, and technical background of Muhammad Irfan Kurniawan.',
  ogTitle: 'About - Muhammad Irfan Kurniawan',
  ogDescription:
    'Career trajectory, engineering principles, and technical background of Muhammad Irfan Kurniawan.'
})
</script>
