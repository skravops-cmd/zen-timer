<template>
  <div class="flex flex-col items-center pt-16">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6">Welcome back</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="text-sm font-medium block mb-1">Username</label>
          <input v-model="username" type="text" required
            class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
            :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
          />
        </div>
        <div>
          <label class="text-sm font-medium block mb-1">Password</label>
          <input v-model="password" type="password" required
            class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
            :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
          />
        </div>

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-sm text-gray-500 text-center mt-6">
        No account? <router-link to="/register" class="text-accent hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTimerStore } from '../stores/timer'

const router = useRouter()
const authStore = useAuthStore()
const timerStore = useTimerStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
