<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isOn"
    :aria-label="label"
    :disabled="disabled"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
    class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    :class="[
      isOn ? 'bg-accent' : 'bg-gray-700',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <span
      class="inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200"
      :class="isOn ? 'translate-x-[22px]' : 'translate-x-[2px]'"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOn = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>
