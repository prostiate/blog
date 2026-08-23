<template>
  <div
    class="not-prose my-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-sm md:p-6"
  >
    <div
      class="flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
          <h4 class="text-base font-semibold text-[var(--text-primary)]">
            Interactive Disk I/O & Rollout Simulator
          </h4>
        </div>
        <p class="mt-0.5 text-xs text-[var(--text-secondary)]">
          Simulate concurrent image extraction on 1x shared SAS HDD (Measured 10-15 MB/s cap)
        </p>
      </div>
      <div
        class="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-code)] px-3 py-1.5"
      >
        <label for="concurrency-range" class="whitespace-nowrap text-xs text-[var(--text-muted)]"
          >Concurrent Services:</label
        >
        <span class="mono-font w-4 text-center text-sm font-bold text-[var(--text-primary)]">{{
          concurrency
        }}</span>
      </div>
    </div>

    <div class="py-4">
      <input
        id="concurrency-range"
        v-model.number="concurrency"
        type="range"
        min="1"
        max="8"
        class="h-1.5 w-full cursor-pointer rounded-lg bg-[var(--border-medium)] accent-[var(--text-primary)]"
      />
      <div class="mono-font mt-1 flex justify-between text-[11px] text-[var(--text-muted)]">
        <span>1 service (Quiet)</span>
        <span>4 services (Typical staging rollout)</span>
        <span>8 services (Multi-cluster sync)</span>
      </div>
    </div>

    <div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- K3s / Argo Rollouts Card -->
      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            K3s + Argo CD
          </span>
          <span class="mono-font text-[11px] text-[var(--text-muted)]">Parallel Pull Topology</span>
        </div>

        <div class="space-y-2.5">
          <div>
            <div class="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Disk I/O Wait Latency</span>
              <span class="mono-font font-medium">{{ metrics.k8s.latency }} ms</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-code)]">
              <div
                class="h-full rounded-full bg-amber-500 transition-all duration-300"
                :style="{ width: `${Math.min(100, (metrics.k8s.latency / 250) * 100)}%` }"
              ></div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Per-Pod I/O Throughput:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]"
              >{{ metrics.k8s.bandwidth }} MB/s</span
            >
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Rollout Duration:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]"
              >{{ metrics.k8s.deployTime }}s</span
            >
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Liveness Probe Status:</span>
            <span :class="['mono-font font-medium', metrics.k8s.statusColor]">{{
              metrics.k8s.risk
            }}</span>
          </div>
        </div>
      </div>

      <!-- Docker Compose Card -->
      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Docker Compose + Jenkins
          </span>
          <span class="mono-font text-[11px] text-[var(--text-muted)]"
            >Health-Gated Rolling Deploy</span
          >
        </div>

        <div class="space-y-2.5">
          <div>
            <div class="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Disk I/O Wait Latency</span>
              <span class="mono-font font-medium">{{ metrics.compose.latency }} ms</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-code)]">
              <div
                class="h-full rounded-full bg-emerald-500 transition-all duration-300"
                :style="{ width: `${Math.min(100, (metrics.compose.latency / 250) * 100)}%` }"
              ></div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Sequential Layer Caching:</span>
            <span class="mono-font font-medium text-emerald-600 dark:text-emerald-400"
              >Layer Reused</span
            >
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Rollout Duration:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]"
              >{{ metrics.compose.deployTime }}s</span
            >
          </div>

          <div
            class="flex items-center justify-between border-t border-[var(--border-subtle)] py-1 text-xs"
          >
            <span class="text-[var(--text-muted)]">Deployment Outcome:</span>
            <span class="mono-font font-medium text-emerald-600 dark:text-emerald-400"
              >Zero-Downtime Pass</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-4 border-t border-[var(--border-subtle)] pt-3 text-xs leading-relaxed text-[var(--text-secondary)]"
    >
      <strong>Key Takeaway:</strong> When 2 VMs share a physical SAS magnetic hard drive capped at
      ~14 MB/s, concurrent K3s image pulls cause disk wait spikes over 150ms, triggering
      false-positive liveness probe timeouts. Health-gated sequential Docker Compose deployments
      eliminate I/O queue thrashing while preserving zero-downtime rollback guarantees.
    </div>
  </div>
</template>

<script setup lang="ts">
const concurrency = ref(4)

const metrics = computed(() => {
  const c = concurrency.value
  const rawBandwidthCap = 14.2
  const perServiceK8sBandwidth = Math.max(1.2, rawBandwidthCap / c)
  const k8sDiskLatencyMs = Math.round(18 + c * 24 + Math.pow(c, 1.6))
  const k8sDeployTimeSec = Math.round(280 / perServiceK8sBandwidth + c * 15)
  const k8sHealthCheckTimeoutRisk =
    c >= 4 ? (c >= 6 ? 'High (85% failure risk)' : 'Moderate (42% timeout)') : 'Low'

  const composeDiskLatencyMs = Math.round(12 + c * 3.5)
  const composeDeployTimeSec = Math.round(45 + c * 6)

  return {
    k8s: {
      bandwidth: perServiceK8sBandwidth.toFixed(1),
      latency: k8sDiskLatencyMs,
      deployTime: k8sDeployTimeSec,
      risk: k8sHealthCheckTimeoutRisk,
      statusColor:
        c >= 4 ? 'text-amber-600 dark:text-amber-400' : 'text-stone-700 dark:text-zinc-300'
    },
    compose: {
      latency: composeDiskLatencyMs,
      deployTime: composeDeployTimeSec
    }
  }
})
</script>
