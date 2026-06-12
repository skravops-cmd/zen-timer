import { onMounted, onUnmounted } from 'vue'
import { useTimerStore } from '../stores/timer'

export function useTheme() {
  const timerStore = useTimerStore()
  let mediaQuery = null

  function applySystemPreference(e) {
    if (!timerStore.settings.lightTheme) {
      const prefersLight = e.matches
      timerStore.updateSettings({ lightTheme: prefersLight })
    }
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    if (!localStorage.getItem('zenTimerState')) {
      timerStore.updateSettings({ lightTheme: mediaQuery.matches })
    }
    mediaQuery.addEventListener('change', applySystemPreference)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', applySystemPreference)
    }
  })
}
