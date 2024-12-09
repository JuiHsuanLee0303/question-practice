<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 max-w-6xl py-8 space-y-6">
      <h1 class="text-2xl text-gray-800 font-bold text-center">題庫管理</h1>

      <!-- 題庫目錄 -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl text-gray-800 font-semibold">題庫目錄</h2>
          <div class="text-sm text-gray-500">共 {{ questionFiles.length }} 個題庫</div>
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
        </div>

        <!-- Question files grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div v-for="file in questionFiles" :key="file.name" @click="loadQuestionFile(file.path)"
            class="group cursor-pointer">
            <div
              class="bg-gray-50 border border-gray-200 rounded-xl p-4 lg:p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <!-- 标题和类型 -->
              <div class="flex justify-between items-start mb-2 lg:mb-3">
                <h4
                  class="text-base lg:text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {{ file.name }}
                </h4>
                <span class="shrink-0 ml-2 px-2 lg:px-2.5 py-0.5 lg:py-1 text-xs font-medium rounded-full" :class="{
                  'bg-blue-50 text-blue-600': file.type === '文字檔',
                  'bg-purple-50 text-purple-600': file.type === 'Word檔',
                }">
                  {{ file.type }}
                </span>
              </div>

              <div class="space-y-2 lg:space-y-3">
                <div class="flex-wrap gap-1.5 lg:gap-2 hidden lg:flex" v-if="file.tags && file.tags.length">
                  <span v-for="tag in file.tags" :key="tag"
                    class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm">
                  <div class="flex items-center text-gray-500">
                    <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="hidden lg:inline">{{ getChapterCount(file.path) }} 章</span>
                    <span class="lg:hidden">{{ getChapterCount(file.path) }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="hidden lg:inline">{{ getQuestionCount(file.path) }} 題</span>
                    <span class="lg:hidden">{{ getQuestionCount(file.path) }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-gray-100">
                <div
                  class="flex items-center text-xs lg:text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                  <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span class="hidden lg:inline">點擊載入題庫</span>
                  <span class="lg:hidden">載入題庫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 題庫上傳和輸入區塊 -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl text-gray-800 font-semibold mb-6">新增題庫</h2>

        <!-- 檔案上傳 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-800 font-medium">從檔案上傳</label>
            <button @click="showFormatModal = true"
              class="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              輸入格式說明
            </button>
          </div>
          <input type="file" @change="handleFileUpload" accept=".txt,.md,.docx"
            class="block w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-colors" />
          <p class="mt-2 text-sm text-gray-500">支援的檔案格式：TXT、Markdown、Word</p>
        </div>

        <!-- 手動輸入 -->
        <div class="mb-6">
          <label class="block text-gray-800 font-medium mb-2">或直接輸入題目</label>
          <textarea v-model="questionText"
            class="w-full h-48 p-4 text-gray-800 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            placeholder="請輸入題庫內容..."></textarea>
        </div>

        <div class="flex-wrap gap-4 grid grid-cols-1 mb-4">
          <button @click="importQuestions"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center">
            匯入題目
          </button>
        </div>
        <div class="flex-wrap gap-4 grid grid-cols-2">
          <button v-if="store.chapters.length > 0" @click="togglePreview"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-center">
            {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
          </button>
          <router-link v-if="store.chapters.length > 0" to="/quiz-settings"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center">
            開始測驗
          </router-link>
        </div>
      </div>

      <!-- 題庫預覽 -->
      <div v-if="store.chapters.length > 0 && showPreview" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl text-gray-800 font-semibold mb-6">題庫預覽</h2>
        <div v-for="chapter in store.chapters" :key="chapter.id" class="mb-6">
          <h3 class="text-lg text-gray-800 font-medium mb-4">{{ chapter.name }}</h3>
          <div v-for="question in chapter.questions" :key="question.id"
            class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p class="text-gray-800 font-medium">
              {{ question.questionNumber }}. {{ question.content }}
            </p>
            <div class="ml-4 mt-2 space-y-1">
              <p v-for="option in question.options" :key="option.key" class="text-gray-700">
                ({{ option.key }}) {{ option.value }}
              </p>
              <p class="mt-2 text-green-600 font-medium">答案: {{ question.answers.join('') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 格式說明 modal -->
      <div v-if="showFormatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-800">題目格式說明</h3>
            <button @click="showFormatModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4 text-gray-600">
            <p>請依照以下格式輸入題目：</p>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
第一章
1-1.這是第一題的內容
(A)選項一
(B)選項二
(C)選項三
(D)選項四
答案:A

1-2.這是第二題的內容（複選題）
(A)選項一
(B)選項二
(C)選項三
(D)選項四
答案:ABC

第二章
2-1.這是第二章第一題
...
            </pre>
            <div class="space-y-2">
              <p>注意事項：</p>
              <ul class="list-disc list-inside space-y-1">
                <li>章節標題必須以「第X章」開頭</li>
                <li>題號格式為「章節-題號」，如：1-1、2-3 等</li>
                <li>選項需以大寫英文字母標示，格式為 (A)、(B)、(C)...</li>
                <li>答案需以「答案:」開頭，後接大寫英文字母，不需空格</li>
                <li>複選題直接連續輸入答案字母，如：ABC</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="showFormatModal = false"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              我知道了
            </button>
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
  tags: string[]
}

const questionText = ref('')
const showPreview = ref(false)
const showFormatModal = ref(false)
const store = useQuestionBankStore()
const questionFiles = ref<QuestionFile[]>([])
const isLoading = ref(true)

// 快取檔案內容
const fileContentsCache = new Map<string, string>()

// 獲取章節數量
const getChapterCount = (filePath: string): number => {
  const content = fileContentsCache.get(filePath)
  if (!content) return 0
  // 簡化正則表達式，只匹配 "第X章"
  const matches = content.match(/第[0-9]+章/g) || []
  return matches.length
}

// 獲取題目數量
const getQuestionCount = (filePath: string): number => {
  const content = fileContentsCache.get(filePath)
  if (!content) return 0
  // 簡化正則表達式，只匹配 "X-XX."
  const matches = content.match(/[0-9]+-[0-9]+\./g) || []
  return matches.length
}

// 載入檔案內容到快取
const loadFileContent = async (file: QuestionFile) => {
  try {
    const basePath = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${basePath}${file.path}`)
    if (!response.ok) throw new Error(`無法載入檔案 ${file.path}`)

    let content: string
    if (file.type === 'Word檔') {
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      content = result.value
    } else {
      content = await response.text()
    }

    // 標準化內容格式
    content = content
      .replace(/\r\n/g, '\n') // 統一換行符
      .replace(/\n+/g, '\n') // 移除多餘空行
      .trim() // 移除首尾空白

    fileContentsCache.set(file.path, content)
  } catch (error) {
    console.error(`載入檔案 ${file.path} 失敗:`, error)
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    const basePath = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${basePath}questions/index.json`)
    if (!response.ok) throw new Error('無法載入題庫目錄')
    const data = await response.json()
    questionFiles.value = data.files || data

    // 預先載入所有檔案的內容到快取
    await Promise.all(questionFiles.value.map(loadFileContent))
  } catch (error) {
    console.error('載入題庫目錄失敗:', error)
  } finally {
    isLoading.value = false
  }
})

async function loadQuestionFile(path: string) {
  try {
    const response = await fetch(path)
    if (!response.ok) throw new Error('無法載入題目檔案')

    let text: string
    if (path.endsWith('.docx')) {
      const blob = await response.blob()
      const arrayBuffer = await new Response(blob).arrayBuffer()
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
      const arrayBuffer = await new Response(file).arrayBuffer()
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
