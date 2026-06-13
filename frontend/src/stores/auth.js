import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api/auth'
import { setOnUnauthorized } from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  function handleUnauthorized() {
    if (refreshToken.value) {
      tryRefresh()
    } else {
      clearTokens()
    }
  }

  setOnUnauthorized(handleUnauthorized)

  async function fetchUser() {
    if (!accessToken.value) return null
    loading.value = true
    try {
      user.value = await authAPI.me()
      return user.value
    } catch {
      const refreshed = await tryRefresh()
      if (refreshed) {
        user.value = await authAPI.me()
        return user.value
      }
      clearTokens()
      return null
    } finally {
      loading.value = false
    }
  }

  async function tryRefresh() {
    if (!refreshToken.value) return false
    try {
      const res = await authAPI.refresh(refreshToken.value)
      setTokens(res.access_token, res.refresh_token)
      return true
    } catch {
      clearTokens()
      return false
    }
  }

  async function login(username, password) {
    const res = await authAPI.login(username, password)
    setTokens(res.access_token, res.refresh_token)
    user.value = await authAPI.me()
  }

  async function register(email, username, password) {
    const res = await authAPI.register(email, username, password)
    setTokens(res.access_token, res.refresh_token)
    user.value = await authAPI.me()
  }

  function logout() {
    clearTokens()
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    fetchUser,
    tryRefresh,
    setTokens,
    clearTokens,
  }
})
