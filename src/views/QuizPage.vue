<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <template v-if="!quizResult">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- 進度條 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h1 class="text-2xl text-gray-800 font-bold">測驗進行中</h1>
            <div class="text-lg text-gray-600">{{ currentIndex + 1 }} / {{ quiz.length }}</div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <div v-if="currentQuestion" class="space-y-6">
          <!-- 題目內容 -->
          <div class="space-y-2">
            <h2 class="text-xl text-gray-800 font-medium">
              {{ currentQuestion.questionNumber }}. {{ currentQuestion.content }}
            </h2>
            <p
              class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
            >
              {{ currentQuestion.isMultipleChoice ? '複選題' : '單選題' }}
            </p>
          </div>

          <!-- 選項 -->
          <div class="space-y-3">
            <label
              v-for="option in currentQuestion.options"
              :key="option.key"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <input
                v-if="currentQuestion.isMultipleChoice"
                type="checkbox"
                :value="option.key"
                :checked="currentAnswers.includes(option.key)"
                @change="toggleAnswer(option.key)"
                class="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <input
                v-else
                type="radio"
                :value="option.key"
                v-model="currentAnswers"
                class="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-3 text-gray-700 group-hover:text-gray-900">
                ({{ option.key }}) {{ option.value }}
              </span>
            </label>
          </div>

          <!-- 導航按鈕 -->
          <div class="flex justify-between pt-4">
            <button
              @click="previousQuestion"
              :disabled="currentIndex === 0"
              class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              上一題
            </button>
            <button
              v-if="currentIndex < quiz.length - 1"
              @click="nextQuestion"
              class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              下一題
            </button>
            <button
              v-else
              @click="submitQuiz"
              class="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              提交測驗
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- 測驗結果 -->
    <template v-else>
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 class="text-3xl text-gray-800 font-bold mb-6">測驗結果</h1>
          <div class="inline-flex flex-col items-center p-8 bg-blue-50 rounded-2xl">
            <div class="text-5xl font-bold text-blue-600 mb-2">{{ quizResult.score }}分</div>
            <div class="text-gray-600">
              答對 {{ quizResult.correctAnswers }} / {{ quizResult.totalQuestions }} 題
            </div>
          </div>
        </div>

        <!-- 題目檢討 -->
        <div class="space-y-6">
          <div
            v-for="question in quizResult.questions"
            :key="question.id"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <div class="space-y-4">
              <div class="space-y-2">
                <h2 class="text-xl text-gray-800 font-medium">
                  {{ question.questionNumber }}. {{ question.content }}
                </h2>
                <p
                  class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {{ question.isMultipleChoice ? '複選題' : '單選題' }}
                </p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="option in question.options"
                  :key="option.key"
                  class="p-4 rounded-lg"
                  :class="{
                    'bg-green-50 border border-green-200': question.answers.includes(option.key),
                    'bg-red-50 border border-red-200':
                      question.userAnswers.includes(option.key) &&
                      !question.answers.includes(option.key),
                  }"
                >
                  <span
                    :class="{
                      'text-green-700': question.answers.includes(option.key),
                      'text-red-700':
                        question.userAnswers.includes(option.key) &&
                        !question.answers.includes(option.key),
                      'text-gray-700':
                        !question.answers.includes(option.key) &&
                        !question.userAnswers.includes(option.key),
                    }"
                  >
                    ({{ option.key }}) {{ option.value }}
                  </span>
                </div>
              </div>

              <div class="pt-4 space-y-2">
                <p class="text-green-600 font-medium">正確答案：{{ question.answers.join('') }}</p>
                <p class="text-blue-600 font-medium">
                  你的答案：{{ question.userAnswers.join('') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 返回按鈕 -->
        <div class="flex justify-center">
          <router-link
            to="/"
            class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            返回題庫
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionBankStore } from '@/stores/questionBank'

const router = useRouter()
const store = useQuestionBankStore()
const quiz = store.currentQuiz
const quizResult = computed(() => store.quizResult)

// 如果沒有測驗題目，返回首頁
onMounted(() => {
  if (quiz.length === 0) {
    router.push('/')
  }
})

const currentIndex = ref(0)
const currentAnswers = ref<string[]>([])

const currentQuestion = computed(() => quiz[currentIndex.value])

// 處理多選題的選項切換
function toggleAnswer(key: string) {
  const index = currentAnswers.value.indexOf(key)
  if (index === -1) {
    currentAnswers.value.push(key)
  } else {
    currentAnswers.value.splice(index, 1)
  }
}

// 在切換題目時保存答案
function saveCurrentAnswer() {
  store.submitAnswer(currentQuestion.value.id, currentAnswers.value)
}

function loadCurrentAnswer() {
  currentAnswers.value = currentQuestion.value.userAnswers
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    saveCurrentAnswer()
    currentIndex.value--
    loadCurrentAnswer()
  }
}

function nextQuestion() {
  if (currentIndex.value < quiz.length - 1) {
    saveCurrentAnswer()
    currentIndex.value++
    loadCurrentAnswer()
  }
}

function submitQuiz() {
  saveCurrentAnswer()
  store.calculateResult()
}

// 初始化第一題的答案
if (currentQuestion.value) {
  loadCurrentAnswer()
}
</script>
