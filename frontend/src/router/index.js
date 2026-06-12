import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TimerView from '../views/TimerView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  { path: '/', name: 'timer', component: TimerView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated && !authStore.accessToken) {
      next('/login')
      return
    }
    if (!authStore.isAuthenticated && authStore.accessToken) {
      authStore.fetchUser().then(() => {
        if (!authStore.isAuthenticated) next('/login')
        else next()
      })
      return
    }
  }
  next()
})

export default router
