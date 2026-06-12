<template>
  <div>
    <label v-if="label" class="text-sm font-medium block mb-1" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-accent transition-colors"
      :class="[
        inputBg,
        inputBorder,
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    />
    <p v-if="error" class="text-sm text-red-400 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../stores/timer'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  disabled: Boolean,
  required: Boolean,
})

defineEmits(['update:modelValue'])

const timerStore = useTimerStore()
const inputId = computed(() => 'input-' + Math.random().toString(36).slice(2, 8))

const inputBg = computed(() =>
  timerStore.settings.lightTheme ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'
)

const inputBorder = computed(() =>
  props.error ? 'border-red-500' : ''
)
</script>
