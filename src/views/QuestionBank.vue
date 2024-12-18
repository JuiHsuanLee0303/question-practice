<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <h1 class="text-4xl font-bold mb-12 text-center text-gray-800">題庫選擇</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="bank in questionBanks" :key="bank.examId"
        class="bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
        @click="selectBank(bank)">
        <div class="flex flex-col h-full">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">{{ bank.examName }}</h3>
          <p class="text-gray-600 mb-6 flex-grow text-base leading-relaxed">{{ bank.description }}</p>
          <div class="flex items-center justify-between text-gray-500 text-sm border-t pt-4">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              題目數量: {{ bank.questionCount }}
            </span>
            <span class="text-blue-500 font-medium hover:text-blue-600">
              開始練習 →
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { config } from '../config'

interface QuestionBank {
  examId: number
  examName: string
  description: string
  questionCount: number
  difficulty: string
}

const router = useRouter()
const questionBanks = ref<QuestionBank[]>([])

const fetchQuestionBanks = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/questions/question-banks`)
    console.log(response.data)
    questionBanks.value = response.data
  } catch (error) {
    console.error('獲取題庫列表失敗:', error)
  }
}

const selectBank = (bank: QuestionBank) => {
  router.push({
    name: 'exam-settings',
    params: { bankId: bank.examId }
  })
}

onMounted(() => {
  fetchQuestionBanks()
})
</script>
