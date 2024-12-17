<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">題目列表</h1>

    <!-- 篩選器 -->
    <div class="mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-gray-700 text-sm font-bold mb-2">考卷</label>
        <select
          v-model="filters.examId"
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">全部</option>
          <option v-for="exam in exams" :key="exam.id" :value="exam.id">
            {{ exam.name }}
          </option>
        </select>
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block text-gray-700 text-sm font-bold mb-2">章節</label>
        <select
          v-model="filters.chapterNum"
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">全部</option>
          <option v-for="chapter in chapters" :key="chapter.num" :value="chapter.num">
            {{ chapter.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 題目列表 -->
    <div class="space-y-6">
      <div v-for="question in filteredQuestions" :key="question.questionNum" class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-semibold">
            第 {{ question.questionNum }} 題
            <span class="text-sm font-normal text-gray-500">
              ({{ question.isMultiple ? '多選題' : '單選題' }})
            </span>
          </h2>
          <div class="text-sm text-gray-500">
            {{ question.examName }}
            <span v-if="question.chapterName">- {{ question.chapterName }}</span>
          </div>
        </div>
        
        <p class="mb-4">{{ question.content }}</p>
        
        <div class="space-y-2">
          <div
            v-for="(option, index) in question.options"
            :key="index"
            class="flex items-start gap-2"
            :class="{
              'text-green-600 font-medium': isCorrectAnswer(question, index)
            }"
          >
            <span class="font-medium">{{ String.fromCharCode(65 + index) }}.</span>
            <span>{{ option }}</span>
          </div>
        </div>
        
        <div class="mt-4 text-sm text-gray-600">
          答案：{{ formatAnswer(question.answer) }}
        </div>
      </div>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">載入中...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

interface Question {
  examId: string
  examName: string
  chapterNum?: string
  chapterName?: string
  questionNum: string
  content: string
  options: string[]
  isMultiple: boolean
  answer: string | string[]
}

interface Exam {
  id: string
  name: string
}

interface Chapter {
  num: string
  name: string
}

const questions = ref<Question[]>([])
const exams = ref<Exam[]>([])
const chapters = ref<Chapter[]>([])
const loading = ref(false)
const error = ref('')

const filters = ref({
  examId: '',
  chapterNum: ''
})

// 根據篩選條件過濾題目
const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    if (filters.value.examId && q.examId !== filters.value.examId) return false
    if (filters.value.chapterNum && q.chapterNum !== filters.value.chapterNum) return false
    return true
  })
})

// 檢查選項是否為正確答案
const isCorrectAnswer = (question: Question, index: number) => {
  const answerChar = String.fromCharCode(65 + index)
  if (Array.isArray(question.answer)) {
    return question.answer.includes(answerChar)
  }
  return question.answer === answerChar
}

// 格式化答案顯示
const formatAnswer = (answer: string | string[]) => {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  return answer
}

// 載入所有題目
const loadQuestions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('/questions')
    questions.value = response.data
    console.log(questions.value)

    // 整理考卷列表
    const uniqueExams = new Map<string, Exam>()
    questions.value.forEach(q => {
      if (!uniqueExams.has(q.examId)) {
        uniqueExams.set(q.examId, {
          id: q.examId,
          name: q.examName
        })
      }
    })
    exams.value = Array.from(uniqueExams.values())

    // 整理章節列表
    const uniqueChapters = new Map<string, Chapter>()
    questions.value.forEach(q => {
      if (q.chapterNum && !uniqueChapters.has(q.chapterNum)) {
        uniqueChapters.set(q.chapterNum, {
          num: q.chapterNum,
          name: q.chapterName || q.chapterNum
        })
      }
    })
    chapters.value = Array.from(uniqueChapters.values())
  } catch (e) {
    error.value = '載入題目失敗，請稍後再試'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuestions()
})
</script> 