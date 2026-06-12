<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])

const variantClasses = {
  primary: 'bg-accent text-white hover:opacity-90 disabled:opacity-50',
  secondary: 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700 disabled:opacity-50',
  ghost: 'text-gray-500 hover:text-white disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:opacity-90 disabled:opacity-50',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3 text-base rounded-xl',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  variantClasses[props.variant] || variantClasses.primary,
  sizeClasses[props.size] || sizeClasses.md,
  (props.disabled || props.loading) ? 'cursor-not-allowed' : 'cursor-pointer',
])
</script>
