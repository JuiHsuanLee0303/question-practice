<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 顶部进度条和时间 -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="bg-blue-50 px-4 py-2 rounded-lg">
            <span class="text-blue-600 font-semibold">進度</span>
            <span class="text-blue-800 font-bold ml-2">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          </div>
          <div class="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full transition-all duration-300"
              :style="{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }"></div>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-600 font-semibold">剩餘時間</span>
          <span class="text-red-800 font-bold">{{ formatTime(timeRemaining) }}</span>
        </div>
      </div>
    </div>

    <!-- 题目内容 -->
    <div v-if="currentQuestion" class="bg-white rounded-xl shadow-lg p-8">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-6">
          <span class="bg-blue-500 text-white text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
            {{ currentQuestionIndex + 1 }}
          </span>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ currentQuestion.type === 'single' ? '單選題' : '多選題' }}
          </h2>
        </div>

        <p class="text-gray-700 text-lg leading-relaxed mb-8 pl-16">{{ currentQuestion.content }}</p>

        <div class="space-y-4 pl-16">
          <label v-for="option in currentQuestion.options" :key="option.key"
            class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
            <div class="flex items-center h-6">
              <input :type="currentQuestion.type === 'single' ? 'radio' : 'checkbox'"
                :name="'question-' + currentQuestionIndex" :value="option.key"
                v-model="userAnswers[currentQuestionIndex]" :disabled="isTimeUp"
                class="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300">
            </div>
            <div class="ml-4 flex-1">
              <div class="flex items-center">
                <span
                  class="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  {{ option.key }}
                </span>
                <span class="mx-3 text-gray-300">|</span>
                <span class="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {{ option.value }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="flex items-center justify-between pt-8 border-t border-gray-200">
        <button @click="prevQuestion" :disabled="currentQuestionIndex === 0"
          class="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一題
        </button>

        <div class="flex gap-2">
          <button v-for="(_, index) in questions" :key="index" @click="goToQuestion(index)"
            class="w-3 h-3 rounded-full transition-all duration-300 focus:outline-none" :class="[
              index === currentQuestionIndex ? 'bg-blue-500 transform scale-125' : '',
              userAnswers[index] && userAnswers[index].length > 0 ? 'bg-green-500' : 'bg-gray-300',
              'hover:opacity-75'
            ]">
          </button>
        </div>

        <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion"
          class="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300">
          下一題
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button v-else @click="submitExam" :disabled="!canSubmit"
          class="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
          提交答案
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { config } from '../config'

interface Option {
  key: string
  value: string
}

interface Question {
  id: number
  content: string
  type: 'single' | 'multiple'
  options: Option[]
}

const router = useRouter()
const route = useRoute()
const questions = ref<Question[]>([])
const currentQuestionIndex = ref(0)
const userAnswers = ref<string[][]>([])
const timeRemaining = ref(7200) // 2小時考試時間
const isTimeUp = ref(false)
let timer: number

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

const canSubmit = computed(() => {
  return userAnswers.value.some(answer => answer && answer.length > 0)
})

const fetchQuestions = async () => {
  try {
    const { chapters, questionCount } = route.query
    const response = await axios.get(`${config.apiBaseUrl}/questions/random`, {
      params: {
        chapters,
        count: questionCount
      }
    })
    questions.value = response.data
    userAnswers.value = new Array(questions.value.length).fill([])
  } catch (error) {
    console.error('獲取題目失敗:', error)
  }
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer = window.setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      isTimeUp.value = true
      clearInterval(timer)
      submitExam()
    }
  }, 1000)
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const goToQuestion = (index: number) => {
  currentQuestionIndex.value = index
}

const submitExam = async () => {
  try {
    await axios.post(`${config.apiBaseUrl}/exam-results`, {
      answers: userAnswers.value,
      timeSpent: 7200 - timeRemaining.value
    })
    router.push({
      name: 'exam-result',
      query: {
        answers: JSON.stringify(userAnswers.value),
        timeSpent: (7200 - timeRemaining.value).toString()
      }
    })
  } catch (error) {
    console.error('提交答案失敗:', error)
  }
}

onMounted(() => {
  fetchQuestions()
  startTimer()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
