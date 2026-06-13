<template>
  <div class="flex flex-col items-center gap-6 mt-8">
    <div class="flex gap-2">
      <button
        v-for="m in modes"
        :key="m.key"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="timerStore.mode === m.key
          ? 'bg-accent text-white'
          : timerStore.settings.lightTheme
            ? 'bg-gray-200 text-gray-600'
            : 'bg-gray-800 text-gray-400 hover:text-white'"
        @click="timerStore.switchMode(m.key)"
      >
        {{ m.label }}
      </button>
    </div>

    <div class="flex gap-4">
      <button
        class="px-8 py-3 rounded-xl bg-accent text-white font-semibold text-lg hover:opacity-90 transition-opacity min-w-[120px]"
        @click="timerStore.toggleTimer()"
      >
        {{ timerStore.isRunning ? 'Pause' : 'Start' }}
      </button>
      <button
        class="px-6 py-3 rounded-xl bg-gray-800 text-gray-400 font-medium hover:text-white transition-colors"
        :class="{ 'bg-gray-200 text-gray-600': timerStore.settings.lightTheme }"
        @click="timerStore.resetTimer()"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from '../stores/timer'

const timerStore = useTimerStore()

const modes = [
  { key: 'focus', label: 'Focus' },
  { key: 'short_break', label: 'Short Break' },
  { key: 'long_break', label: 'Long Break' },
]
</script>
