<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <span class="text-3xl mb-4 opacity-40">&#9888;</span>
    <h3 v-if="title" class="text-sm font-medium opacity-60 mb-1">{{ title }}</h3>
    <p v-if="message" class="text-sm text-gray-500 mb-4">{{ message }}</p>
    <button v-if="retryLabel" @click="$emit('retry')"
      class="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Something went wrong' },
  message: String,
  retryLabel: String,
})

defineEmits(['retry'])
</script>
