<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">題目轉換器</h1>

    <!-- 考試選擇 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-4">選擇題庫</h2>
      <div class="flex gap-4 mb-4">
        <button
          @click="examMode = 'existing'"
          class="px-4 py-2 rounded"
          :class="examMode === 'existing' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        >
          既有題庫
        </button>
        <button
          @click="examMode = 'new'"
          class="px-4 py-2 rounded"
          :class="examMode === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        >
          新增題庫
        </button>
      </div>

      <!-- 既有題庫選擇 -->
      <div v-if="examMode === 'existing'" class="mb-4">
        <select
          v-model="selectedExamId"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>請選擇題庫</option>
          <option v-for="exam in exams" :key="exam.id" :value="exam.id">
            {{ exam.name }}
          </option>
        </select>
      </div>

      <!-- 新增題庫表單 -->
      <div v-else class="mb-4">
        <div class="space-y-4">
          <div class="flex gap-4">
            <input
              v-model="newExamName"
              type="text"
              placeholder="請輸入題庫名稱"
              class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="newExamCode"
              type="text"
              placeholder="題庫代號（選填）"
              class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="handleCategoryChange"
              >
                <option value="">請選擇題庫類型（選填）</option>
                <option value="programming">程式設計</option>
                <option value="network">網路概論</option>
                <option value="database">資料庫</option>
                <option value="security">資訊安全</option>
                <option value="os">作業系統</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div v-if="selectedCategory === 'other'" class="flex-1">
              <input
                v-model="newExamCategory"
                type="text"
                placeholder="請輸入自訂類型"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <textarea
              v-model="newExamDescription"
              placeholder="題庫描述（選填）"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              @click="createExam"
              class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              :disabled="!newExamName"
            >
              建立題庫
            </button>
          </div>
        </div>
      </div>
    </div>

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
      <label class="block text-gray-700 text-sm font-bold mb-2"> 輸入題目文本 </label>
      <textarea
        v-model="inputText"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        rows="10"
        placeholder="請輸入題目文本..."
      ></textarea>
      <div class="mt-2 text-sm text-gray-600">
        <button @click="loadExampleText" class="text-blue-500 hover:text-blue-700 underline">
          載入範例文本
        </button>
      </div>
    </div>

    <!-- JSON輸入區域 -->
    <div v-else class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2"> 輸入JSON格式題目 </label>
      <textarea
        v-model="jsonInput"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono"
        rows="10"
        placeholder="請輸入JSON格式題目..."
      ></textarea>
      <div class="mt-2 text-sm text-gray-600">
        <button @click="loadExampleJson" class="text-blue-500 hover:text-blue-700 underline">
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
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto">{{
        JSON.stringify(convertedQuestions, null, 2)
      }}</pre>
    </div>

    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <Modal
      :show="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Modal from '@/components/Modal.vue'

interface ExamData {
  id: string
  name: string
  code?: string
  category?: string
  description?: string
}

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
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const examMode = ref<'existing' | 'new'>('existing')
const exams = ref<ExamData[]>([])
const selectedExamId = ref('')
const newExamName = ref('')
const newExamCode = ref('')
const newExamCategory = ref('')
const newExamDescription = ref('')
const selectedCategory = ref('')

// 載入範例JSON
const loadExampleJson = () => {
  const exampleJson = [
    {
      examId: 'EXAM001',
      examName: '範例考卷',
      chapterNum: '1',
      chapterName: '第一章',
      questionNum: '1',
      content: '這是一個範例題目？',
      options: ['選項A', '選項B', '選項C', '選項D'],
      isMultiple: false,
      answer: 'A',
    },
  ]
  jsonInput.value = JSON.stringify(exampleJson, null, 2)
}

// 載入範例文本
const loadExampleText = () => {
  const exampleText = `考試：EXAM001
考試名稱：網路概論期中考
章節：1
章節名稱：網際網路概論

1. 下列何者不是網際網路的特性？
A. 分散式架構
B. 集中式管理
C. 開放性標準
D. 封包交換
答案：B

第3章

3-01. 下列哪些服務屬於網路社群服務?(複選)
(A) Facebook
(B) Microsoft Office
(C) Email
(D) Twitter
答案: AD`

  inputText.value = exampleText
}

// 驗證JSON格式
const validateQuestionData = (question: any): string | null => {
  if (!question.examId || typeof question.examId !== 'string') return '缺少或無效的 examId'
  if (!question.examName || typeof question.examName !== 'string') return '缺少或無效的 examName'
  if (!question.questionNum || typeof question.questionNum !== 'string')
    return '缺少或無效的 questionNum'
  if (!question.content || typeof question.content !== 'string') return '缺少或無效的 content'
  if (!Array.isArray(question.options) || question.options.length < 2)
    return '選項必須是陣列且至少包含兩個選項'
  if (typeof question.isMultiple !== 'boolean') return 'isMultiple 必須是布林值'

  // 驗證答案格式
  if (question.isMultiple) {
    if (!Array.isArray(question.answer)) return '多選題答案必須是陣列'
    if (!question.answer.every((ans: any) => typeof ans === 'string' && /^[A-D]$/.test(ans))) {
      return '多選題答案必須是A-D的字母列'
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
    if (!Array.isArray(data)) {
      error.value = '無效的JSON格式：必須是題目陣列'
      return
    }

    // 驗證每個題目
    for (let i = 0; i < data.length; i++) {
      const validationError = validateQuestionData(data[i])
      if (validationError) {
        error.value = `第 ${i + 1} 題驗證失敗：${validationError}`
        return
      }
    }

    // 驗證通過，設置轉換結果
    convertedQuestions.value = data
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

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)

    if (lines.length < 3) {
      error.value = '輸入格式不正確，請確保包含題目和選項'
      return
    }

    let currentQuestion: Partial<QuestionData> | null = null
    let examId = '1'
    let examName = '預設考卷'
    let chapterNum = ''
    let chapterName = ''
    let currentIndex = 0
    const questions: QuestionData[] = []

    // 解析考試ID
    const examIdMatch = lines[currentIndex].match(/^考試[:：]\s*(.+)/)
    if (examIdMatch) {
      examId = examIdMatch[1]
      currentIndex++
    }

    // 解析考試名稱
    const examNameMatch = lines[currentIndex].match(/^考試名稱[:：]\s*(.+)/)
    if (examNameMatch) {
      examName = examNameMatch[1]
      currentIndex++
    }

    // 解析章節編號
    const chapterNumMatch = lines[currentIndex].match(/^章節[:：]\s*(.+)/)
    if (chapterNumMatch) {
      chapterNum = chapterNumMatch[1]
      currentIndex++
    }

    // 解析章節名稱
    const chapterNameMatch = lines[currentIndex].match(/^章節名稱[:：]\s*(.+)/)
    if (chapterNameMatch) {
      chapterName = chapterNameMatch[1]
      currentIndex++
    }

    for (let i = currentIndex; i < lines.length; i++) {
      const line = lines[i]

      // 解析章節標題
      const chapterTitleMatch = line.match(/^第(\d+)章/)
      if (chapterTitleMatch) {
        chapterNum = chapterTitleMatch[1]
        chapterName = line
        continue
      }

      // 解析新題目（支持多種格式）
      const questionMatch =
        line.match(/^(\d+[-\d]*)[.、\s]+(.+)/) || line.match(/^(\d+-\d+)[.、\s]+(.+)/)
      if (questionMatch) {
        // 如果有前一個題目，保存它
        if (currentQuestion && currentQuestion.options?.length) {
          convertedQuestions.value.push(currentQuestion as QuestionData)
        }

        // 檢查是否為多選題
        const isMultiple =
          questionMatch[2].includes('(複選)') || questionMatch[2].includes('（複選）')
        const content = questionMatch[2].replace(/[(\（]複選[)\）]/g, '').trim()

        currentQuestion = {
          examId,
          examName,
          chapterNum,
          chapterName,
          questionNum: questionMatch[1],
          content,
          options: [],
          isMultiple,
          answer: '',
        }
        continue
      }

      // 解析選項（支持帶括號和不帶括號的格式）
      const optionMatch =
        line.match(/^[(（]?([A-D])[)）]?[.、\s]+(.+)/) || line.match(/^([A-D])[.、\s]+(.+)/)
      if (optionMatch && currentQuestion) {
        currentQuestion.options = currentQuestion.options || []
        currentQuestion.options.push(optionMatch[2])
        continue
      }

      // 解析答案（支持多種格式）
      const answerMatch = line.match(/^答案[:：]?\s*([A-Da-d\s,]+)/)
      if (answerMatch && currentQuestion) {
        const answerText = answerMatch[1].toUpperCase().replace(/[\s,]/g, '')
        if (answerText.length > 1 || currentQuestion.isMultiple) {
          currentQuestion.isMultiple = true
          currentQuestion.answer = answerText.split('')
        } else {
          currentQuestion.isMultiple = false
          currentQuestion.answer = answerText
        }

        // 保存當前題目
        convertedQuestions.value.push(currentQuestion as QuestionData)
        currentQuestion = null
      }
    }

    // 檢查是否還有最後一個未保存的題目
    if (currentQuestion && currentQuestion.options?.length) {
      convertedQuestions.value.push(currentQuestion as QuestionData)
    }

    if (convertedQuestions.value.length === 0) {
      error.value = '無法解析任何有效題目'
      return
    }
  } catch (e) {
    error.value = '轉換過程中發生錯誤，請檢查輸入格式'
    console.error(e)
  }
}

// 載入題庫列表
const fetchExams = async () => {
  try {
    const response = await axios.get('/exams')
    exams.value = response.data
  } catch (e) {
    error.value = '載入題庫列表失敗'
    console.error(e)
  }
}

// 建立新題庫
const createExam = async () => {
  try {
    const examData = {
      name: newExamName.value,
      code: newExamCode.value || undefined,
      category: selectedCategory.value === 'other' ? newExamCategory.value || undefined : selectedCategory.value || undefined,
      description: newExamDescription.value || undefined
    }

    const response = await axios.post('/exams', examData)
    selectedExamId.value = response.data.id
    examMode.value = 'existing'
    await fetchExams()
    showModal.value = true
    modalTitle.value = '成功'
    modalMessage.value = '題庫建立成功！'
    
    // 清空表單
    newExamName.value = ''
    newExamCode.value = ''
    selectedCategory.value = ''
    newExamCategory.value = ''
    newExamDescription.value = ''
  } catch (e) {
    error.value = '建立題庫失敗'
    console.error(e)
  }
}

// 修改提交到後端的方法
const submitToBackend = async () => {
  try {
    error.value = ''
    if (!convertedQuestions.value.length) {
      error.value = '請先轉換題目'
      return
    }

    if (!selectedExamId.value && examMode.value === 'existing') {
      error.value = '請選擇題庫'
      return
    }

    const examId = selectedExamId.value
    const response = await axios.post(`/exams/${examId}/questions`, convertedQuestions.value)
    modalTitle.value = '成功'
    modalMessage.value = '題目提交成功！'
    showModal.value = true
  } catch (e) {
    error.value = '提交失敗，請稍後再試'
    console.error(e)
  }
}

const handleCategoryChange = () => {
  if (selectedCategory.value !== 'other') {
    newExamCategory.value = selectedCategory.value
  } else {
    newExamCategory.value = ''
  }
}

onMounted(() => {
  fetchExams()
})
</script>
