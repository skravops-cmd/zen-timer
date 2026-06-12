import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TimerView from '../views/TimerView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const DashboardView = () => import('../views/DashboardView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  { path: '/', name: 'timer', component: TimerView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
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
