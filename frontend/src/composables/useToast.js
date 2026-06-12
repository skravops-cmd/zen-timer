import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function addToast(type, message, duration = 4000) {
    const id = ++nextId
    toasts.value.push({ id, type, message })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  function removeToast(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function success(message, duration) {
    return addToast('success', message, duration)
  }

  function error(message, duration) {
    return addToast('error', message, duration)
  }

  function info(message, duration) {
    return addToast('info', message, duration)
  }

  return { toasts, addToast, removeToast, success, error, info }
}

export { toasts }
