<template>
  <div class="flex flex-col items-center pt-16">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6">Welcome back</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput v-model="username" label="Username" type="text" required />

        <BaseInput v-model="password" label="Password" type="password" required />

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

        <BaseButton type="submit" :loading="loading" variant="primary" size="lg" class="w-full">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </BaseButton>
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
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

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
