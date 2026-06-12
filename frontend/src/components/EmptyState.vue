<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <slot name="icon">
      <span class="text-3xl mb-4 opacity-40">&#9744;</span>
    </slot>
    <h3 v-if="title" class="text-sm font-medium opacity-60 mb-1">{{ title }}</h3>
    <p v-if="message" class="text-sm text-gray-500 mb-4">{{ message }}</p>
    <slot name="action">
      <router-link v-if="actionLink" :to="actionLink" class="text-sm text-accent hover:underline">
        {{ actionLabel || 'Go' }}
      </router-link>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  actionLabel: String,
  actionLink: String,
})
</script>
