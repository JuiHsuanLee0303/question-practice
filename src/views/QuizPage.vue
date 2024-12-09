<template>
  <div class="container mx-auto p-4">
    <template v-if="!quizResult">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl text-gray-800 font-bold">測驗進行中</h1>
          <div class="text-lg text-gray-800">進度：{{ currentIndex + 1 }} / {{ quiz.length }}</div>
        </div>

        <div v-if="currentQuestion" class="bg-white p-6 rounded-lg shadow">
          <!-- 題目內容 -->
          <div class="mb-4">
            <h2 class="text-lg text-gray-800 font-medium">
              {{ currentQuestion.questionNumber }}. {{ currentQuestion.content }}
            </h2>
            <p class="mt-1 text-gray-800">
              {{ currentQuestion.isMultipleChoice ? '(複選題)' : '(單選題)' }}
            </p>
          </div>

          <!-- 選項 -->
          <div class="space-y-2">
            <label
              v-for="option in currentQuestion.options"
              :key="option.key"
              class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                v-if="currentQuestion.isMultipleChoice"
                type="checkbox"
                :value="option.key"
                :checked="currentAnswers.includes(option.key)"
                @change="toggleAnswer(option.key)"
                class="mr-2"
              />
              <input
                v-else
                type="radio"
                :value="option.key"
                v-model="currentAnswers"
                class="mr-2"
              />
              <span class="text-gray-800">({{ option.key }}) {{ option.value }}</span>
            </label>
          </div>

          <!-- 導航按鈕 -->
          <div class="flex justify-between mt-6">
            <button
              @click="previousQuestion"
              :disabled="currentIndex === 0"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
            >
              上一題
            </button>
            <button
              v-if="currentIndex < quiz.length - 1"
              @click="nextQuestion"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              下一題
            </button>
            <button
              v-else
              @click="submitQuiz"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              提交測驗
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- 測驗結果 -->
    <template v-else>
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl text-gray-800 font-bold mb-6">測驗結果</h1>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="text-center mb-6">
            <div class="text-4xl font-bold text-blue-600">{{ quizResult.score }}分</div>
            <div class="mt-2 text-gray-800">
              答對 {{ quizResult.correctAnswers }} / {{ quizResult.totalQuestions }} 題
            </div>
          </div>
        </div>

        <!-- 題目檢討 -->
        <div class="space-y-6">
          <div
            v-for="question in quizResult.questions"
            :key="question.id"
            class="bg-white p-6 rounded-lg shadow"
          >
            <div class="mb-4">
              <h2 class="text-lg text-gray-800 font-medium">
                {{ question.questionNumber }}. {{ question.content }}
              </h2>
              <p class="mt-1 text-gray-800">
                {{ question.isMultipleChoice ? '(複選題)' : '(單選題)' }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                v-for="option in question.options"
                :key="option.key"
                class="p-2 rounded"
                :class="{
                  'bg-green-100': question.answers.includes(option.key),
                  'bg-red-100':
                    question.userAnswers.includes(option.key) &&
                    !question.answers.includes(option.key),
                }"
              >
                <span class="text-gray-800">({{ option.key }}) {{ option.value }}</span>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-green-600">正確答案：{{ question.answers.join('') }}</p>
              <p class="text-blue-600">你的答案：{{ question.userAnswers.join('') }}</p>
            </div>
          </div>
        </div>

        <!-- 返回按鈕 -->
        <div class="mt-6">
          <router-link
            to="/"
            class="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
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
