<template>
  <div class="flex flex-col items-center pt-16">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6">Create account</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="text-sm font-medium block mb-1">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
            :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
          />
        </div>
        <div>
          <label class="text-sm font-medium block mb-1">Username</label>
          <input v-model="username" type="text" required minlength="3"
            class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
            :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
          />
        </div>
        <div>
          <label class="text-sm font-medium block mb-1">Password</label>
          <input v-model="password" type="password" required minlength="8"
            class="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
            :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
          />
        </div>

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-sm text-gray-500 text-center mt-6">
        Already have an account? <router-link to="/login" class="text-accent hover:underline">Sign in</router-link>
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

const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(email.value, username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
