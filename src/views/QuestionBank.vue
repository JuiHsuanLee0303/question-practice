<template>
  <div class="py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-2xl text-gray-800 font-bold mb-4">題庫管理</h1>

      <!-- 題庫上傳 -->
      <div class="mb-8">
        <h2 class="text-xl text-gray-800 font-semibold mb-2">上傳題庫</h2>

        <!-- 題庫目錄 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl text-gray-800 font-semibold">題庫目錄</h3>
            <div class="text-sm text-gray-500">共 {{ questionFiles.length }} 個題庫</div>
          </div>

          <!-- Loading spinner -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
          </div>

          <!-- Question files grid (only show when loading is complete) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="file in questionFiles" :key="file.name" @click="loadQuestionFile(file.path)"
              class="group cursor-pointer">
              <!-- 卡片容器 -->
              <div
                class="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <!-- 卡片頂部：標題和類型 -->
                <div class="flex justify-between items-start mb-3">
                  <h4
                    class="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {{ file.name }}
                  </h4>
                  <span class="shrink-0 ml-2 px-2.5 py-1 text-xs font-medium rounded-full" :class="{
                    'bg-blue-50 text-blue-600': file.type === '文字檔',
                    'bg-purple-50 text-purple-600': file.type === 'Word檔',
                  }">
                    {{ file.type }}
                  </span>
                </div>

                <!-- 標籤和統計信息 -->
                <div class="space-y-3">
                  <!-- 標籤列表 -->
                  <div class="flex flex-wrap gap-2" v-if="file.tags && file.tags.length">
                    <span v-for="tag in file.tags" :key="tag"
                      class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {{ tag }}
                    </span>
                  </div>

                  <!-- 統計信息 -->
                  <div class="flex items-center space-x-4 text-sm">
                    <div class="flex items-center text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{{ getChapterCount(file.path) }} 章</span>
                    </div>
                    <div class="flex items-center text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ getQuestionCount(file.path) }} 題</span>
                    </div>
                  </div>
                </div>

                <!-- 載入提示 -->
                <div class="mt-4 pt-3 border-t border-gray-100">
                  <div class="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    點擊載入題庫
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 檔案上傳 -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-800">從檔案上傳</label>
            <button @click="showFormatModal = true"
              class="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-200 rounded transition-colors">
              輸入格式說明
            </button>
          </div>
          <input type="file" @change="handleFileUpload" accept=".txt,.md,.docx"
            class="block w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
          <p class="mt-1 text-gray-800">支援的檔案格式：TXT、Markdown、Word</p>
        </div>

        <!-- 手動輸入 -->
        <div class="mb-4">
          <label class="block text-gray-800 mb-2">或直接輸入題目</label>
          <textarea v-model="questionText" class="text-gray-800 w-full h-48 p-2 border rounded"
            placeholder="請輸入題庫內容..."></textarea>
        </div>

        <div class="flex space-x-4">
          <button @click="importQuestions" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            匯入題目
          </button>
          <button v-if="store.chapters.length > 0" @click="togglePreview"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
          </button>
          <router-link v-if="store.chapters.length > 0" to="/quiz-settings"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            開始測驗
          </router-link>
        </div>
      </div>

      <!-- 題庫預覽 -->
      <div v-if="store.chapters.length > 0 && showPreview">
        <h2 class="text-xl text-gray-800 font-semibold mb-2">題庫預覽</h2>
        <div v-for="chapter in store.chapters" :key="chapter.id" class="mb-6">
          <h3 class="text-lg text-gray-800 font-medium mb-2">{{ chapter.name }}</h3>
          <div v-for="question in chapter.questions" :key="question.id" class="mb-4 p-4 bg-gray-50 rounded">
            <p class="text-gray-800 font-medium">
              {{ question.questionNumber }}. {{ question.content }}
            </p>
            <div class="ml-4 mt-2">
              <p v-for="option in question.options" :key="option.key" class="text-gray-800 mb-1">
                ({{ option.key }}) {{ option.value }}
              </p>
              <p class="mt-2 text-green-600">答案: {{ question.answers.join('') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 格式說明 Modal -->
      <div v-if="showFormatModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click="showFormatModal = false">
        <div
          class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-0 transform transition-all duration-200 ease-out scale-100"
          @click.stop>
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 class="text-xl font-bold text-gray-800">題庫格式說明</h3>
            <button @click="showFormatModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div class="prose max-w-none">
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-3">基本格式</h4>
                <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 border border-gray-200">
                  第X章 X-XX. 題目內容 (A) 選項A內容 (B) 選項B內容 (C) 選項C內容 (D) 選項D內容 答案:
                  ABC # 複選題可以多選
                </div>
              </div>

              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-3">格式規則</h4>
                <ul class="space-y-2 list-none pl-0">
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span class="text-gray-800">每個章節以「第X章」開始，X 為章節編號</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span class="text-gray-800">題號格式為「章號-題號.」，例如：3-01.</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span class="text-gray-800">選項以「(大寫字母)」開始，例如：(A)、(B)、(C)、(D)</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span class="text-gray-800">答案行以「答案:」開始，後面接大寫字母，不需空格</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span class="text-gray-800">單選題填寫一個答案，複選題可填寫多個答案</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-3">範例</h4>
                <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 border border-gray-200">
                  第3章 3-01. 下列哪些服務屬於網路社群服務?(複選) (A) Facebook (B) Microsoft Office
                  (C) Email (D) Twitter 答案: AD
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl flex justify-end">
            <button @click="showFormatModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
              關閉
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
    const response = await fetch(file.path)
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
    const response = await fetch('/questions/index.json')
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
    showPreview.value = true
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`匯入題目時發生錯誤: ${error.message}`)
    } else {
      alert('匯入題目時發生未知錯誤')
    }
  }
}
</script>
