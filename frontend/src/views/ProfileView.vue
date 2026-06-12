<template>
  <div class="pt-6">
    <h1 class="text-2xl font-semibold mb-6">Profile</h1>

    <div class="rounded-xl p-6 border space-y-4"
      :class="timerStore.settings.lightTheme ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'"
    >
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
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTimerStore } from '../stores/timer'

const authStore = useAuthStore()
const timerStore = useTimerStore()

const formattedDate = computed(() => {
  if (!authStore.user?.created_at) return ''
  const d = new Date(authStore.user.created_at)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>
