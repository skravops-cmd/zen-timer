<template>
  <div class="flex flex-col items-center pt-8">
    <TimerDisplay />
    <TimerControls />

    <div v-if="!authStore.isAuthenticated" class="mt-6 text-xs text-gray-600 text-center">
      Guest mode — <router-link to="/register" class="text-accent hover:underline">register</router-link> to track progress
    </div>

    <TaskList />

    <button @click="showSettings = true" class="mt-6 text-sm text-gray-500 hover:text-white transition-colors">
      Settings
    </button>

    <SettingsModal :show="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TimerDisplay from '../components/TimerDisplay.vue'
import TimerControls from '../components/TimerControls.vue'
import TaskList from '../components/TaskList.vue'
import SettingsModal from '../components/SettingsModal.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const showSettings = ref(false)
</script>
