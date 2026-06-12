<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="card in cards" :key="card.label"
      class="rounded-xl p-4 border"
      :class="light ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'"
    >
      <p class="text-xs opacity-60 mb-1">{{ card.label }}</p>
      <p class="text-2xl font-semibold tabular-nums">{{ card.value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cards: Array,
  light: Boolean,
})
</script>
