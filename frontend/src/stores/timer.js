import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { sessionsAPI } from '../api/sessions'

const STORAGE_KEY = 'zenTimerState'

const MODES = {
  focus: { label: 'Focus', defaultMinutes: 25 },
  short_break: { label: 'Short Break', defaultMinutes: 5 },
  long_break: { label: 'Long Break', defaultMinutes: 15 },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveState(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useTimerStore = defineStore('timer', () => {
  const saved = loadState()

  const mode = ref(saved?.mode || 'focus')
  const settings = ref(saved?.settings || {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    lightTheme: false,
  })

  const remaining = ref(saved?.remaining ?? MODES.focus.defaultMinutes * 60 * 1000)
  const isRunning = ref(false)
  const sessionCount = ref(saved?.sessionCount || 0)
  const startTime = ref(null)
  const rafId = ref(null)

  const currentLabel = computed(() => MODES[mode.value]?.label || 'Focus')
  const circumference = 565.48
  const progress = computed(() => {
    const total = getDefaultMinutes(mode.value)
    const totalMs = total * 60 * 1000
    return 1 - (remaining.value / totalMs)
  })

  function getDefaultMinutes(m) {
    switch (m) {
      case 'focus': return settings.value.focusMinutes
      case 'short_break': return settings.value.shortBreakMinutes
      case 'long_break': return settings.value.longBreakMinutes
      default: return 25
    }
  }

  function persist() {
    saveState({
      mode: mode.value,
      settings: settings.value,
      remaining: remaining.value,
      sessionCount: sessionCount.value,
    })
  }

  function switchMode(newMode) {
    if (isRunning.value) pauseTimer()
    mode.value = newMode
    const mins = getDefaultMinutes(newMode)
    remaining.value = mins * 60 * 1000
    persist()
  }

  function startTimer() {
    if (isRunning.value) return
    isRunning.value = true
    startTime.value = Date.now()
    tick()
  }

  function pauseTimer() {
    isRunning.value = false
    if (rafId.value) {
      cancelAnimationFrame(rafId.value)
      rafId.value = null
    }
    persist()
  }

  function toggleTimer() {
    if (isRunning.value) pauseTimer()
    else startTimer()
  }

  function resetTimer() {
    pauseTimer()
    const mins = getDefaultMinutes(mode.value)
    remaining.value = mins * 60 * 1000
    persist()
  }

  function tick() {
    if (!isRunning.value) return
    const elapsed = Date.now() - startTime.value
    remaining.value = Math.max(0, remaining.value - elapsed)
    startTime.value = Date.now()

    if (remaining.value <= 0) {
      handleTimerEnd()
      return
    }
    rafId.value = requestAnimationFrame(tick)
  }

  function handleTimerEnd() {
    pauseTimer()
    playBeep()
    showNotification()
    sessionCount.value++

    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      const totalMs = getDefaultMinutes(mode.value) * 60 * 1000
      sessionsAPI.create({
        mode: mode.value,
        duration_seconds: Math.round(totalMs / 1000),
      }).catch(() => {})
    }

    if (mode.value === 'focus') {
      if (sessionCount.value % 4 === 0) {
        mode.value = 'long_break'
      } else {
        mode.value = 'short_break'
      }
      if (settings.value.autoStartBreaks) {
        startTimer()
      }
    } else {
      mode.value = 'focus'
      if (settings.value.autoStartPomodoros) {
        startTimer()
      }
    }

    const mins = getDefaultMinutes(mode.value)
    remaining.value = mins * 60 * 1000
    persist()
  }

  function playBeep() {
    if (!settings.value.soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 440
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
      osc.start()
      osc.stop(ctx.currentTime + 1)
    } catch { /* ignore */ }
  }

  function showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Zen Timer', {
        body: `${currentLabel.value} session complete!`,
      })
    }
  }

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    if (!isRunning.value) {
      const mins = getDefaultMinutes(mode.value)
      remaining.value = mins * 60 * 1000
    }
    persist()
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('light', settings.value.lightTheme)
  }

  return {
    mode, settings, remaining, isRunning, sessionCount,
    currentLabel, progress, circumference,
    switchMode, startTimer, pauseTimer, toggleTimer, resetTimer,
    updateSettings, applyTheme, requestNotificationPermission,
  }
})
