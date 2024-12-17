import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
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
      meta: { requiresAuth: true },
    },
    {
      path: '/question-list',
      name: 'question-list',
      component: () => import('@/views/QuestionList.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = await authStore.checkAuth()

  // 需要認證的路由
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  }
  // 訪客路由（登入/註冊）
  else if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }
  // 其他路由
  else {
    next()
  }
})

export default router
