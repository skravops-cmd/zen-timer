<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm animate-slide-up"
          :class="toastClass(toast.type)"
        >
          <span class="text-lg leading-none">{{ iconFor(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
          <button
            class="text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
            @click="removeToast(toast.id)"
          >
            &times;
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { toasts, useToast } from '../composables/useToast'

const { removeToast } = useToast()

function toastClass(type) {
  return {
    success: 'bg-green-900 border-green-700 text-green-100',
    error: 'bg-red-900 border-red-700 text-red-100',
    info: 'bg-gray-800 border-gray-600 text-gray-100',
  }[type] || 'bg-gray-800 border-gray-600 text-gray-100'
}

function iconFor(type) {
  return {
    success: '\u2713',
    error: '\u2717',
    info: '\u2139',
  }[type] || '\u2139'
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.2s ease-out;
}
</style>
