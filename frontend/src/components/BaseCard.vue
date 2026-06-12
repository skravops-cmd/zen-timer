<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../stores/timer'

const props = defineProps({
  padding: { type: String, default: 'md' },
  hover: { type: Boolean, default: false },
})

const timerStore = useTimerStore()

const padMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const classes = computed(() => [
  'rounded-xl border',
  timerStore.settings.lightTheme ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800',
  padMap[props.padding] || padMap.md,
  props.hover ? 'transition-colors hover:border-gray-600' : '',
])
</script>
