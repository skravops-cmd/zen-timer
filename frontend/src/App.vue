<template>
  <div class="min-h-screen" :class="{ 'light': timerStore.settings.lightTheme }">
    <AppHeader />
    <main class="max-w-2xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import { useAuthStore } from './stores/auth'
import { useTimerStore } from './stores/timer'

const authStore = useAuthStore()
const timerStore = useTimerStore()

onMounted(async () => {
  timerStore.applyTheme()
  timerStore.requestNotificationPermission()
  if (authStore.accessToken) {
    await authStore.fetchUser()
  }
})
</script>
