import { createRouter, createWebHistory } from 'vue-router'
import QuestionBank from '@/views/QuestionBank.vue'
import QuizSettings from '@/views/QuizSettings.vue'
import QuizPage from '@/views/QuizPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'questionBank',
      component: QuestionBank,
    },
    {
      path: '/quiz-settings',
      name: 'quizSettings',
      component: QuizSettings,
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizPage,
    },
  ],
})

export default router
