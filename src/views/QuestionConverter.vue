<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">題目轉換器</h1>
    
    <!-- 輸入模式選擇 -->
    <div class="mb-6">
      <div class="flex gap-4">
        <button
          @click="inputMode = 'text'"
          class="px-4 py-2 rounded"
          :class="inputMode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        >
          文本格式
        </button>
        <button
          @click="inputMode = 'json'"
          class="px-4 py-2 rounded"
          :class="inputMode === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        >
          JSON格式
        </button>
      </div>
    </div>
    
    <!-- 文本輸入區域 -->
    <div v-if="inputMode === 'text'" class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        輸入題目文本
      </label>
      <textarea
        v-model="inputText"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        rows="10"
        placeholder="請輸入題目文本..."
      ></textarea>
    </div>

    <!-- JSON輸入區域 -->
    <div v-else class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        輸入JSON格式題目
      </label>
      <textarea
        v-model="jsonInput"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono"
        rows="10"
        placeholder="請輸入JSON格式題目..."
      ></textarea>
      <div class="mt-2 text-sm text-gray-600">
        <button
          @click="loadExampleJson"
          class="text-blue-500 hover:text-blue-700 underline"
        >
          載入範例JSON
        </button>
      </div>
    </div>

    <div class="flex gap-4 mb-6">
      <button
        @click="inputMode === 'text' ? convertQuestion() : validateAndConvertJson()"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {{ inputMode === 'text' ? '轉換' : '驗證並轉換' }}
      </button>
      <button
        @click="submitToBackend"
        :disabled="!convertedQuestions.length"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        提交到後端
      </button>
    </div>

    <div v-if="convertedQuestions.length" class="mb-6">
      <h2 class="text-xl font-bold mb-2">轉換結果</h2>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto">{{ JSON.stringify({ questions: convertedQuestions }, null, 2) }}</pre>
    </div>

    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface QuestionData {
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

const inputMode = ref<'text' | 'json'>('text')
const inputText = ref('')
const jsonInput = ref('')
const convertedQuestions = ref<QuestionData[]>([])
const error = ref('')

// 載入範例JSON
const loadExampleJson = () => {
  const exampleJson = {
    "questions": [
      {
        "examId": "EXAM001",
        "examName": "範例考卷",
        "chapterNum": "1",
        "chapterName": "第一章",
        "questionNum": "1",
        "content": "這是一個範例題目？",
        "options": ["選項A", "選項B", "選項C", "選項D"],
        "isMultiple": false,
        "answer": "A"
      }
    ]
  }
  jsonInput.value = JSON.stringify(exampleJson, null, 2)
}

// 驗證JSON格式
const validateQuestionData = (question: any): string | null => {
  if (!question.examId || typeof question.examId !== 'string') return '缺少或無效的 examId'
  if (!question.examName || typeof question.examName !== 'string') return '缺少或無效的 examName'
  if (!question.questionNum || typeof question.questionNum !== 'string') return '缺少或無效的 questionNum'
  if (!question.content || typeof question.content !== 'string') return '缺少或無效的 content'
  if (!Array.isArray(question.options) || question.options.length < 2) return '選項必須是陣列且至少包含兩個選項'
  if (typeof question.isMultiple !== 'boolean') return 'isMultiple 必須是布林值'
  
  // 驗證答案格式
  if (question.isMultiple) {
    if (!Array.isArray(question.answer)) return '多選題答案必須是陣列'
    if (!question.answer.every((ans: any) => typeof ans === 'string' && /^[A-D]$/.test(ans))) {
      return '多選題答案必須是A-D的字母陣列'
    }
  } else {
    if (typeof question.answer !== 'string' || !/^[A-D]$/.test(question.answer)) {
      return '單選題答案必須是A-D其中一個字母'
    }
  }

  return null
}

const validateAndConvertJson = () => {
  error.value = ''
  convertedQuestions.value = []
  
  try {
    const data = JSON.parse(jsonInput.value)
    
    // 驗證基本結構
    if (!data.questions || !Array.isArray(data.questions)) {
      error.value = '無效的JSON格式：必須包含 questions 陣列'
      return
    }

    // 驗證每個題目
    for (let i = 0; i < data.questions.length; i++) {
      const validationError = validateQuestionData(data.questions[i])
      if (validationError) {
        error.value = `第 ${i + 1} 題驗證失敗：${validationError}`
        return
      }
    }

    // 驗證通過，設置轉換結果
    convertedQuestions.value = data.questions
  } catch (e) {
    error.value = '無效的JSON格式：請檢查JSON語法'
    console.error(e)
  }
}

const convertQuestion = () => {
  try {
    error.value = ''
    convertedQuestions.value = []
    
    const text = inputText.value.trim()
    if (!text) {
      error.value = '請輸入題目文本'
      return
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    if (lines.length < 3) {
      error.value = '輸入格式不正確，請確保包含題目和選項'
      return
    }

    const questionMatch = lines[0].match(/^(\d+)[.、\s]+(.+)/)
    if (!questionMatch) {
      error.value = '無法解析題目編號和內容'
      return
    }

    const questionNum = questionMatch[1]
    const content = questionMatch[2]

    const options: string[] = []
    const optionPattern = /^[A-D][.、\s]+(.+)/
    let isMultiple = false
    let answer: string | string[] = ''

    for (let i = 1; i < lines.length; i++) {
      const optionMatch = lines[i].match(optionPattern)
      if (optionMatch) {
        options.push(optionMatch[1])
      }
    }

    const lastLine = lines[lines.length - 1].toLowerCase()
    if (lastLine.includes('答案') || lastLine.includes('answer')) {
      const answerText = lastLine.replace(/答案[:：]/i, '').replace(/answer[:：]/i, '').trim()
      if (answerText.length > 1) {
        isMultiple = true
        answer = answerText.split('').filter(char => /[A-Da-d]/.test(char))
      } else {
        answer = answerText.toUpperCase()
      }
    }

    convertedQuestions.value = [{
      examId: '1',
      examName: '預設考卷',
      questionNum,
      content,
      options,
      isMultiple,
      answer
    }]
  } catch (e) {
    error.value = '轉換過程中發生錯誤，請檢查輸入格式'
    console.error(e)
  }
}

const submitToBackend = async () => {
  try {
    error.value = ''
    if (!convertedQuestions.value.length) {
      error.value = '請先轉換題目'
      return
    }

    const response = await axios.post('/questions', {
      questions: convertedQuestions.value
    })
    alert('題目提交成功！')
  } catch (e) {
    error.value = '提交失敗，請稍後再試'
    console.error(e)
  }
}
</script> 