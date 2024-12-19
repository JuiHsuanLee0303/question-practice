<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <h1 class="text-4xl font-bold mb-12 text-center text-gray-800">題庫選擇</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="bank in questionBanks" :key="bank.id"
        class="bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border"
        :class="selectedBanks.includes(bank.id) ? 'border-blue-500' : 'border-gray-100'"
        @click="toggleBankSelection(bank)">
        <div class="flex flex-col h-full">
          <div class="mb-4">
            <div class="flex justify-between items-start">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ bank.name }}</h3>
              <div v-if="selectedBanks.includes(bank.id)" class="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{{ bank.category }}</span>
            </div>
          </div>
          <p class="text-gray-600 mb-6 flex-grow text-base leading-relaxed">{{ bank.description }}</p>
          <div class="flex items-center justify-between text-gray-500 text-sm border-t pt-4">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              題目數量: {{ bank.questionNum }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 開始練習按鈕 -->
    <div class="fixed bottom-8 right-8">
      <button
        @click="startPractice"
        :disabled="selectedBanks.length === 0"
        class="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
      >
        開始練習
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { config } from '../config'

interface QuestionBank {
  id: string
  name: string
  code: string
  category: string
  description: string
  questionNum: number
}

const router = useRouter()
const questionBanks = ref<QuestionBank[]>([])
const selectedBanks = ref<string[]>([])

const fetchQuestionBanks = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/exams`)
    questionBanks.value = response.data
  } catch (error) {
    console.error('獲取題庫列表失敗:', error)
  }
}

const toggleBankSelection = (bank: QuestionBank) => {
  const index = selectedBanks.value.indexOf(bank.id)
  if (index === -1) {
    selectedBanks.value.push(bank.id)
  } else {
    selectedBanks.value.splice(index, 1)
  }
}

const startPractice = () => {
  console.log(selectedBanks.value.join(','))
  if (selectedBanks.value.length > 0) {
    router.push({
      name: 'exam-settings',
      query: { bankIds: selectedBanks.value.join(',') }
    })
  }
}

onMounted(() => {
  fetchQuestionBanks()
})
</script>
