<template>
  <Teleport to="body">
    <div v-if="show" @click.self="$emit('close')"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-sm mx-4 rounded-2xl p-6 border shadow-xl"
        :class="timerStore.settings.lightTheme ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Settings</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>

        <div class="space-y-5">
          <div v-for="slider in sliders" :key="slider.key">
            <label class="flex items-center justify-between text-sm mb-2">
              <span>{{ slider.label }}</span>
              <span class="tabular-nums text-gray-400">{{ slider.value }} min</span>
            </label>
            <input type="range" :min="slider.min" :max="slider.max" :value="slider.value"
              @input="updateSlider(slider.key, +$event.target.value)"
              class="w-full accent-accent"
            />
          </div>

          <div v-for="toggle in toggles" :key="toggle.key" class="flex items-center justify-between">
            <span class="text-sm">{{ toggle.label }}</span>
            <button @click="toggleSetting(toggle.key)"
              class="w-10 h-5 rounded-full transition-colors relative"
              :class="toggle.value ? 'bg-accent' : 'bg-gray-700'"
            >
              <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                :class="toggle.value ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../stores/timer'

defineProps({ show: Boolean })
defineEmits(['close'])

const timerStore = useTimerStore()

const sliders = computed(() => [
  { key: 'focusMinutes', label: 'Focus Duration', value: timerStore.settings.focusMinutes, min: 1, max: 60 },
  { key: 'shortBreakMinutes', label: 'Short Break', value: timerStore.settings.shortBreakMinutes, min: 1, max: 30 },
  { key: 'longBreakMinutes', label: 'Long Break', value: timerStore.settings.longBreakMinutes, min: 1, max: 60 },
])

const toggles = computed(() => [
  { key: 'autoStartBreaks', label: 'Auto-start Breaks', value: timerStore.settings.autoStartBreaks },
  { key: 'autoStartPomodoros', label: 'Auto-start Pomodoros', value: timerStore.settings.autoStartPomodoros },
  { key: 'soundEnabled', label: 'Sound', value: timerStore.settings.soundEnabled },
  { key: 'lightTheme', label: 'Light Theme', value: timerStore.settings.lightTheme },
])

function updateSlider(key, value) {
  timerStore.updateSettings({ [key]: value })
}

function toggleSetting(key) {
  timerStore.updateSettings({ [key]: !timerStore.settings[key] })
}
</script>
