<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-bold text-center mb-12 text-gray-800">測驗設定</h1>
    <div class="bg-white rounded-xl shadow-xl p-10 border border-gray-100">
      <div class="mb-10">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">已選擇的題庫</h3>
        <div class="space-y-4">
          <div v-for="bank in selectedBanks" :key="bank.id"
            class="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
            <div class="flex flex-col">
              <span class="text-gray-800 font-medium text-lg">{{ bank.name }}</span>
              <span class="text-sm text-gray-500">共 {{ bank.questions.length }} 題</span>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{{ bank.category }}</span>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">題目數量設定</h3>
        <div class="flex flex-col md:flex-row items-start md:items-center md:gap-4 bg-gray-50 p-8 rounded-xl">
          <div class="flex flex-col gap-4 w-full md:w-1/2">
            <label class="text-gray-700 font-medium text-lg">選擇題目數量</label>
            <div class="relative">
              <input type="number" v-model="selectedQuestionCount" :min="1" :max="totalAvailableQuestions"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-300"
                :class="{ 'opacity-50 cursor-not-allowed': !hasSelectedBanks }">
            </div>
          </div>

          <div class="flex flex-col gap-4 w-full md:w-1/2">
            <label class="text-gray-700 font-medium text-lg opacity-0">提示訊息</label>
            <div class="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-xl font-semibold text-blue-700">可選題數：1-{{ totalAvailableQuestions }} 題</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-12">
        <button @click="goBack"
          class="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
        <button @click="startExam" :disabled="!canStartExam"
          class="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2">
          開始測驗
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { config } from '../config'

interface Question {
  id: string
  question: string
  options: string[]
  answer: string
}

interface QuestionBank {
  id: string
  name: string
  code: string
  category: string
  description: string
  questions: Question[]
}

const router = useRouter()
const route = useRoute()
const selectedBanks = ref<QuestionBank[]>([])
const selectedQuestionCount = ref(0)

const bankIds = computed(() => {
  const ids = route.query.bankIds as string
  return ids ? ids.split(',') : []
})

const fetchSelectedBanks = async () => {
  try {
    const promises = bankIds.value.map(id => 
      axios.get(`${config.apiBaseUrl}/exams/${id}`)
    )
    const responses = await Promise.all(promises)
    selectedBanks.value = responses.map(response => response.data)
    console.log(selectedBanks.value)
  } catch (error) {
    console.error('獲取題庫資訊失敗:', error)
  }
}

const totalAvailableQuestions = computed(() => {
  return selectedBanks.value.reduce((total, bank) => total + bank.questions.length, 0)
})

const hasSelectedBanks = computed(() => {
  return selectedBanks.value.length > 0
})

const canStartExam = computed(() => {
  return hasSelectedBanks.value &&
    selectedQuestionCount.value > 0 &&
    selectedQuestionCount.value <= totalAvailableQuestions.value
})

const startExam = () => {
  router.push({
    name: 'exam',
    query: {
      bankIds: bankIds.value.join(','),
      questionCount: selectedQuestionCount.value.toString()
    }
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchSelectedBanks()
})
</script>
