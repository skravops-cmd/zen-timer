<template>
  <div class="min-h-screen" :class="{ 'light': timerStore.settings.lightTheme }">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm">
      Skip to main content
    </a>
    <AppHeader />
    <main id="main-content" class="max-w-2xl mx-auto px-4 py-8">
      <router-view />
    </main>
    <ToastNotification />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useAuthStore } from './stores/auth'
import { useTimerStore } from './stores/timer'
import { useTheme } from './composables/useTheme'

const authStore = useAuthStore()
const timerStore = useTimerStore()

useTheme()

onMounted(async () => {
  timerStore.applyTheme()
  timerStore.requestNotificationPermission()
  if (authStore.accessToken) {
    await authStore.fetchUser()
  }
})
</script>
