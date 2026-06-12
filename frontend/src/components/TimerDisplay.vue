<template>
  <div class="relative flex items-center justify-center">
    <svg class="timer-ring w-72 h-72" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="4"
        class="text-gray-800" :class="{ 'text-gray-200': timerStore.settings.lightTheme }" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#7c3aed" stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - timerStore.progress)"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-7xl font-light tabular-nums tracking-tight">
        {{ formattedTime }}
      </span>
      <span class="text-sm mt-2 opacity-60">{{ timerStore.currentLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../stores/timer'

const timerStore = useTimerStore()
const circumference = 565.48

const formattedTime = computed(() => {
  const totalSeconds = Math.ceil(timerStore.remaining / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})
</script>
