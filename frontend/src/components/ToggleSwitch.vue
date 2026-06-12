<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isOn"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :disabled="disabled"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
    class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-opacity duration-200"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : ''"
  >
    <span
      class="flex items-center rounded-full transition-colors duration-200"
      :class="[trackSizeClasses, trackColorClasses]"
    >
      <span
        class="rounded-full bg-white shadow-sm ring-0 transition-transform duration-200"
        :class="[knobSizeClasses, knobPositionClasses]"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleColor = 'accent' | 'green' | 'blue' | 'red' | 'amber'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  label?: string
  size?: ToggleSize
  color?: ToggleColor
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  label: '',
  size: 'md',
  color: 'accent',
})

const emit = defineEmits<Emits>()

const isOn = computed(() => props.modelValue)

const sizeMap: Record<ToggleSize, { track: string; knob: string }> = {
  sm: { track: 'w-8 h-4', knob: 'w-3 h-3' },
  md: { track: 'w-11 h-6', knob: 'w-5 h-5' },
  lg: { track: 'w-14 h-8', knob: 'w-7 h-7' },
}

const offsetMap: Record<ToggleSize, { off: string; on: string }> = {
  sm: { off: 'translate-x-[2px]', on: 'translate-x-[18px]' },
  md: { off: 'translate-x-[3px]', on: 'translate-x-[21px]' },
  lg: { off: 'translate-x-[3px]', on: 'translate-x-[25px]' },
}

const colorMap: Record<ToggleColor, string> = {
  accent: 'bg-accent',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
}

const trackSizeClasses = computed(() => sizeMap[props.size].track)
const knobSizeClasses = computed(() => sizeMap[props.size].knob)

const knobPositionClasses = computed(() => {
  const offsets = offsetMap[props.size]
  return isOn.value ? offsets.on : offsets.off
})

const trackColorClasses = computed(() => {
  if (!isOn.value) return 'bg-gray-300 dark:bg-gray-600'
  return colorMap[props.color]
})

function toggle() {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>
