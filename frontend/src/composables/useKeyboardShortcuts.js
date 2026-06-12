import { onMounted, onUnmounted } from 'vue'
import { useTimerStore } from '../stores/timer'
import { useRouter } from 'vue-router'

export function useKeyboardShortcuts() {
  const timerStore = useTimerStore()
  const router = useRouter()

  function handler(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        timerStore.toggleTimer()
        break
      case 'KeyR':
        timerStore.resetTimer()
        break
      case 'Digit1':
        timerStore.switchMode('focus')
        break
      case 'Digit2':
        timerStore.switchMode('short_break')
        break
      case 'Digit3':
        timerStore.switchMode('long_break')
        break
      case 'Escape':
        if (router.currentRoute.value.name !== 'timer') {
          router.push('/')
        }
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
  })
}
