<template>
  <div class="p-5 md:p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm my-6 not-prose">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <h4 class="font-semibold text-base text-[var(--text-primary)]">Interactive Disk I/O & Rollout Simulator</h4>
        </div>
        <p class="text-xs text-[var(--text-secondary)] mt-0.5">Simulate concurrent image extraction on 1x shared SAS HDD (Measured 10-15 MB/s cap)</p>
      </div>
      <div class="flex items-center gap-3 bg-[var(--bg-code)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
        <label for="concurrency-range" class="text-xs text-[var(--text-muted)] whitespace-nowrap">Concurrent Services:</label>
        <span class="font-bold mono-font text-[var(--text-primary)] text-sm w-4 text-center">{{ concurrency }}</span>
      </div>
    </div>

    <div class="py-4">
      <input 
        id="concurrency-range" 
        v-model.number="concurrency" 
        type="range" 
        min="1" 
        max="8" 
        class="w-full accent-[var(--text-primary)] cursor-pointer h-1.5 bg-[var(--border-medium)] rounded-lg"
      />
      <div class="flex justify-between text-[11px] text-[var(--text-muted)] mono-font mt-1">
        <span>1 service (Quiet)</span>
        <span>4 services (Typical staging rollout)</span>
        <span>8 services (Multi-cluster sync)</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <!-- K3s / Argo Rollouts Card -->
      <div class="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        <div class="flex items-center justify-between mb-3">
          <span class="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            K3s + Argo CD
          </span>
          <span class="text-[11px] mono-font text-[var(--text-muted)]">Parallel Pull Topology</span>
        </div>

        <div class="space-y-2.5">
          <div>
            <div class="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
              <span>Disk I/O Wait Latency</span>
              <span class="mono-font font-medium">{{ metrics.k8s.latency }} ms</span>
            </div>
            <div class="w-full h-2 bg-[var(--bg-code)] rounded-full overflow-hidden">
              <div 
                class="h-full bg-amber-500 rounded-full transition-all duration-300" 
                :style="{ width: `${Math.min(100, (metrics.k8s.latency / 250) * 100)}%` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Per-Pod I/O Throughput:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]">{{ metrics.k8s.bandwidth }} MB/s</span>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Rollout Duration:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]">{{ metrics.k8s.deployTime }}s</span>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Liveness Probe Status:</span>
            <span :class="['mono-font font-medium', metrics.k8s.statusColor]">{{ metrics.k8s.risk }}</span>
          </div>
        </div>
      </div>

      <!-- Docker Compose Card -->
      <div class="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        <div class="flex items-center justify-between mb-3">
          <span class="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Docker Compose + Jenkins
          </span>
          <span class="text-[11px] mono-font text-[var(--text-muted)]">Health-Gated Rolling Deploy</span>
        </div>

        <div class="space-y-2.5">
          <div>
            <div class="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
              <span>Disk I/O Wait Latency</span>
              <span class="mono-font font-medium">{{ metrics.compose.latency }} ms</span>
            </div>
            <div class="w-full h-2 bg-[var(--bg-code)] rounded-full overflow-hidden">
              <div 
                class="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                :style="{ width: `${Math.min(100, (metrics.compose.latency / 250) * 100)}%` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Sequential Layer Caching:</span>
            <span class="mono-font font-medium text-emerald-600 dark:text-emerald-400">Layer Reused</span>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Rollout Duration:</span>
            <span class="mono-font font-medium text-[var(--text-primary)]">{{ metrics.compose.deployTime }}s</span>
          </div>

          <div class="flex justify-between items-center text-xs py-1 border-t border-[var(--border-subtle)]">
            <span class="text-[var(--text-muted)]">Deployment Outcome:</span>
            <span class="mono-font font-medium text-emerald-600 dark:text-emerald-400">Zero-Downtime Pass</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed">
      <strong>Key Takeaway:</strong> When 2 VMs share a physical SAS magnetic hard drive capped at ~14 MB/s, concurrent K3s image pulls cause disk wait spikes over 150ms, triggering false-positive liveness probe timeouts. Health-gated sequential Docker Compose deployments eliminate I/O queue thrashing while preserving zero-downtime rollback guarantees.
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
  const k8sDeployTimeSec = Math.round((280 / perServiceK8sBandwidth) + (c * 15))
  const k8sHealthCheckTimeoutRisk = c >= 4 ? (c >= 6 ? 'High (85% failure risk)' : 'Moderate (42% timeout)') : 'Low'

  const composeDiskLatencyMs = Math.round(12 + c * 3.5)
  const composeDeployTimeSec = Math.round(45 + c * 6)

  return {
    k8s: {
      bandwidth: perServiceK8sBandwidth.toFixed(1),
      latency: k8sDiskLatencyMs,
      deployTime: k8sDeployTimeSec,
      risk: k8sHealthCheckTimeoutRisk,
      statusColor: c >= 4 ? 'text-amber-600 dark:text-amber-400' : 'text-stone-700 dark:text-zinc-300'
    },
    compose: {
      latency: composeDiskLatencyMs,
      deployTime: composeDeployTimeSec
    }
  }
})
</script>
