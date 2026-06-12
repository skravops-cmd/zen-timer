<template>
  <div class="pt-6">
    <h1 class="text-2xl font-semibold mb-6">Profile</h1>

    <BaseCard padding="lg" class="space-y-4">
      <div>
        <p class="text-xs opacity-60">Username</p>
        <p class="text-sm font-medium">{{ authStore.user?.username }}</p>
      </div>
      <div>
        <p class="text-xs opacity-60">Email</p>
        <p class="text-sm font-medium">{{ authStore.user?.email }}</p>
      </div>
      <div>
        <p class="text-xs opacity-60">Member since</p>
        <p class="text-sm font-medium">{{ formattedDate }}</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import BaseCard from '../components/BaseCard.vue'

const authStore = useAuthStore()

const formattedDate = computed(() => {
  if (!authStore.user?.created_at) return ''
  const d = new Date(authStore.user.created_at)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>
