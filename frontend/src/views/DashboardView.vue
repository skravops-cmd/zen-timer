<template>
  <div class="pt-6">
    <h1 class="text-2xl font-semibold mb-6">
      Dashboard
    </h1>

    <ErrorState
      v-if="error"
      title="Failed to load stats"
      :message="error"
      retry-label="Retry"
      @retry="fetchStats"
    />

    <div
      v-else-if="loading"
      class="text-center text-gray-500 py-12"
    >
      Loading stats...
    </div>

    <template v-else-if="stats">
      <StatsCards
        :cards="statCards"
        :light="timerStore.settings.lightTheme"
      />

      <div class="mt-8">
        <h2 class="text-sm font-medium opacity-60 mb-3">
          Last 30 Days
        </h2>
        <BaseCard padding="sm">
          <div class="flex items-end gap-1 h-24">
            <div
              v-for="day in stats.daily_stats"
              :key="day.date"
              class="flex-1 rounded-t transition-all hover:opacity-80 relative group"
              :style="{ height: barHeight(day.total_seconds) + '%', backgroundColor: day.total_seconds > 0 ? '#7c3aed' : '#1f2937' }"
              :class="{ 'bg-gray-200': timerStore.settings.lightTheme && day.total_seconds === 0 }"
            >
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                {{ formatDate(day.date) }}: {{ Math.round(day.total_seconds / 60) }}m
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="mt-8">
        <h2 class="text-sm font-medium opacity-60 mb-3">
          Mode Breakdown
        </h2>
        <div class="space-y-2">
          <BaseCard
            v-for="mode in stats.mode_breakdown"
            :key="mode.mode"
            padding="sm"
            class="flex items-center justify-between"
          >
            <span class="text-sm capitalize">{{ mode.mode.replace('_', ' ') }}</span>
            <span class="text-sm tabular-nums text-gray-400">
              {{ Math.round(mode.total_seconds / 60) }} min · {{ mode.session_count }} sessions
            </span>
          </BaseCard>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-sm font-medium opacity-60 mb-3">
          This Month
        </h2>
        <BaseCard padding="sm">
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="day in monthlyHeatmap"
              :key="day.date"
              class="aspect-square rounded transition-colors relative group"
              :style="{ backgroundColor: heatmapColor(day.total_seconds) }"
            >
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                {{ formatDate(day.date) }}: {{ Math.round(day.total_seconds / 60) }}m
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </template>

    <EmptyState
      v-else-if="!loading && !stats"
      title="No stats yet"
      message="Complete a few focus sessions to see your progress."
      action-label="Start a timer"
      action-link="/"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { statsAPI } from '../api/stats'
import { useTimerStore } from '../stores/timer'
import StatsCards from '../components/StatsCards.vue'
import BaseCard from '../components/BaseCard.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'
import { useToast } from '../composables/useToast'

const timerStore = useTimerStore()
const stats = ref(null)
const loading = ref(true)
const error = ref(null)
const { error: toastError } = useToast()

async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    stats.value = await statsAPI.get()
  } catch (e) {
    stats.value = null
    error.value = e.message || 'Could not load stats'
    toastError('Failed to load dashboard stats')
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)

const statCards = computed(() => {
  if (!stats.value) return []
  const focusHours = Math.round(stats.value.total_focus_seconds / 3600 * 10) / 10
  const avgMin = Math.round(stats.value.average_session_seconds / 60)
  return [
    { label: 'Total Focus Time', value: `${focusHours}h` },
    { label: 'Sessions', value: stats.value.total_sessions },
    { label: 'Current Streak', value: `${stats.value.current_streak} days` },
    { label: 'Avg Session', value: `${avgMin} min` },
  ]
})

const monthlyHeatmap = computed(() => {
  if (!stats.value) return []
  return stats.value.monthly_heatmap
})

function barHeight(seconds) {
  if (!stats.value) return 0
  const max = Math.max(...stats.value.daily_stats.map(d => d.total_seconds), 1)
  return Math.max((seconds / max) * 100, 2)
}

function heatmapColor(seconds) {
  if (seconds === 0) return '#1f2937'
  if (seconds < 600) return '#3b0764'
  if (seconds < 1800) return '#5b21b6'
  if (seconds < 3600) return '#7c3aed'
  return '#a78bfa'
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
