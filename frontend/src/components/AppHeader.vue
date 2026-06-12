<template>
  <header role="banner" class="sticky top-0 z-50 backdrop-blur-md border-b border-gray-800"
    :class="{ 'border-gray-200': timerStore.settings.lightTheme }">
    <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="text-lg font-semibold tracking-tight hover:opacity-80" aria-label="Zen Timer home">
        Zen Timer
      </router-link>

      <nav aria-label="Main navigation" class="flex items-center gap-4 text-sm">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="hover:text-accent transition-colors">Dashboard</router-link>
          <router-link to="/profile" class="hover:text-accent transition-colors">Profile</router-link>
          <button @click="authStore.logout()" class="hover:text-red-400 transition-colors">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="hover:text-accent transition-colors">Login</router-link>
          <router-link to="/register"
            class="px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity">
            Register
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useTimerStore } from '../stores/timer'

const authStore = useAuthStore()
const timerStore = useTimerStore()
</script>
