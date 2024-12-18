import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/question-bank',
      name: 'question-bank',
      component: () => import('@/views/QuestionBank.vue'),
    },
    {
      path: '/quiz-settings',
      name: 'quiz-settings',
      component: () => import('@/views/QuizSettings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/QuizPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { guest: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/UserHistory.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/question-converter',
      name: 'question-converter',
      component: () => import('@/views/QuestionConverter.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/question-list',
      name: 'question-list',
      component: () => import('@/views/QuestionList.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// 導航守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn
  const isAdmin = authStore.user?.role === 'admin'

  // 檢查是否需要管理員權限
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }

  // 檢查是否需要登入
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // 已登入用戶不能訪問訪客頁面
  if (to.meta.guest && isAuthenticated) {
    return next('/')
  }

  next()
})

export default router
