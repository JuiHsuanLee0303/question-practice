<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-3xl text-gray-800 font-bold mb-8">題庫管理</h1>

    <!-- 題庫上傳區塊 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-2xl text-gray-800 font-semibold mb-6">上傳題庫</h2>

      <!-- 題庫目錄 -->
      <div class="mb-8">
        <h3 class="text-xl text-gray-800 font-medium mb-4">題庫目錄</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="file in questionFiles"
            :key="file.name"
            @click="loadQuestionFile(file.path)"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="font-medium text-gray-800 mb-1">{{ file.name }}</div>
            <div class="text-sm text-gray-500">{{ file.type }}</div>
          </button>
        </div>
      </div>

      <!-- 檔案上傳 -->
      <div class="mb-8">
        <label class="block text-lg text-gray-800 font-medium mb-3">從檔案上傳</label>
        <input
          type="file"
          @change="handleFileUpload"
          accept=".txt,.md,.docx"
          class="block w-full text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-colors file:cursor-pointer cursor-pointer"
        />
        <p class="mt-2 text-sm text-gray-600">支援的檔案格式：TXT、Markdown、Word</p>
      </div>

      <!-- 手動輸入 -->
      <div class="mb-8">
        <label class="block text-lg text-gray-800 font-medium mb-3">或直接輸入題目</label>
        <textarea
          v-model="questionText"
          class="w-full h-48 p-4 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="請輸入題庫內容..."
        ></textarea>
      </div>

      <div class="flex flex-wrap gap-4">
        <button
          @click="importQuestions"
          class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          匯入題目
        </button>
        <button
          v-if="store.chapters.length > 0"
          @click="togglePreview"
          class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
        </button>
        <router-link
          v-if="store.chapters.length > 0"
          to="/quiz-settings"
          class="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          開始測驗
        </router-link>
      </div>
    </div>

    <!-- 題庫預覽 -->
    <div v-if="store.chapters.length > 0 && showPreview" class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl text-gray-800 font-semibold mb-6">題庫預覽</h2>
      <div v-for="chapter in store.chapters" :key="chapter.id" class="mb-8">
        <h3 class="text-xl text-gray-800 font-medium mb-4">{{ chapter.name }}</h3>
        <div class="space-y-4">
          <div
            v-for="question in chapter.questions"
            :key="question.id"
            class="p-5 bg-gray-50 rounded-lg border border-gray-100"
          >
            <p class="text-gray-800 font-medium mb-3">
              {{ question.questionNumber }}. {{ question.content }}
            </p>
            <div class="space-y-2 ml-4">
              <p v-for="option in question.options" :key="option.key" class="text-gray-700">
                ({{ option.key }}) {{ option.value }}
              </p>
              <p class="mt-3 text-green-600 font-medium">答案：{{ question.answers.join('') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuestionBankStore } from '@/stores/questionBank'
import mammoth from 'mammoth'

interface QuestionFile {
  name: string
  path: string
  type: string
}

const questionText = ref('')
const showPreview = ref(false)
const store = useQuestionBankStore()
const questionFiles = ref<QuestionFile[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/questions/index.json')
    if (!response.ok) throw new Error('無法載入題庫目錄')
    questionFiles.value = await response.json()
  } catch (error) {
    console.error('載入題庫目錄失敗:', error)
  }
})

async function loadQuestionFile(path: string) {
  try {
    const response = await fetch(path)
    if (!response.ok) throw new Error('無法載入題目檔案')

    let text: string
    if (path.endsWith('.docx')) {
      const arrayBuffer = await response.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      text = result.value
    } else {
      text = await response.text()
    }

    questionText.value = text
    await importQuestions()
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`載入題目檔案時發生錯誤: ${error.message}`)
    } else {
      alert('載入題目檔案時發生未知錯誤')
    }
  }
}

function togglePreview() {
  showPreview.value = !showPreview.value
}

async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    let text = ''

    if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      text = result.value
    } else {
      text = await file.text()
    }

    questionText.value = text
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`讀取檔案時發生錯誤: ${error.message}`)
    } else {
      alert('讀取檔案時發生未知錯誤')
    }
  }
}

async function importQuestions() {
  if (!questionText.value.trim()) {
    alert('請輸入題庫內容或上傳檔案')
    return
  }
  try {
    await store.importQuestions(questionText.value)
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`匯入題目時發生錯誤: ${error.message}`)
    } else {
      alert('匯入題目時發生未知錯誤')
    }
  }
}
</script>
