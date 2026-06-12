<template>
  <div class="flex flex-col items-center pt-16">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6">Create account</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput v-model="email" label="Email" type="email" required />

        <BaseInput v-model="username" label="Username" type="text" required />

        <BaseInput v-model="password" label="Password" type="password" required />

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

        <BaseButton type="submit" :loading="loading" variant="primary" size="lg" class="w-full">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </BaseButton>
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
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

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
