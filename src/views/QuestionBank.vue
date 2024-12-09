<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 max-w-6xl py-12">
      <h1
        class="text-3xl text-gray-800 font-bold text-center mb-12 flex items-center justify-center gap-3"
      >
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
        題庫管理
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
      </h1>

      <!-- 題庫目錄 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl text-gray-800 font-semibold flex items-center gap-3">
            <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
            題庫目錄
          </h2>
          <div class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
            共 {{ questionFiles.length }} 個題庫
          </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading" class="flex justify-center items-center py-16">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"
          ></div>
        </div>

        <!-- Question files grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="file in questionFiles"
            :key="file.name"
            @click="loadQuestionFile(file.path)"
            class="group cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
          >
            <div
              class="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <!-- 标题和类型 -->
              <div class="flex justify-between items-start mb-4">
                <h4
                  class="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {{ file.name }}
                </h4>
                <span
                  class="shrink-0 ml-3 px-3 py-1.5 text-sm font-medium rounded-xl"
                  :class="{
                    'bg-blue-50 text-blue-600': file.type === '文字檔',
                    'bg-purple-50 text-purple-600': file.type === 'Word檔',
                  }"
                >
                  {{ file.type }}
                </span>
              </div>

              <div class="space-y-4">
                <div class="flex flex-wrap gap-2" v-if="file.tags && file.tags.length">
                  <span
                    v-for="tag in file.tags"
                    :key="tag"
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-xl"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center space-x-6 text-sm">
                  <div class="flex items-center text-gray-500">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{{ getChapterCount(file.path) }} 章</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ getQuestionCount(file.path) }} 題</span>
                  </div>
                </div>
              </div>

              <div class="mt-5 pt-4 border-t border-gray-200">
                <div
                  class="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span>點擊載入題庫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 題庫上傳和輸入區塊 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl text-gray-800 font-semibold mb-8 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          新增題庫
        </h2>

        <!-- 檔案上傳 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <label class="text-lg text-gray-800 font-medium">從檔案上傳</label>
            <button
              @click="showFormatModal = true"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              輸入格式說明
            </button>
          </div>
          <div class="relative group">
            <input
              type="file"
              @change="handleFileUpload"
              accept=".txt,.md,.docx"
              class="block w-full text-gray-800 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-colors file:cursor-pointer cursor-pointer"
            />
            <div
              class="absolute inset-0 rounded-xl border-2 border-dashed border-gray-300 pointer-events-none group-hover:border-blue-300 transition-colors"
            ></div>
          </div>
          <p class="mt-3 text-sm text-gray-500 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            支援的檔案格式：TXT、Markdown、Word
          </p>
        </div>

        <!-- 手動輸入 -->
        <div class="mb-8">
          <label class="block text-lg text-gray-800 font-medium mb-4">或直接輸入題目</label>
          <textarea
            v-model="questionText"
            class="w-full h-48 p-6 text-gray-800 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
            placeholder="請輸入題庫內容..."
          ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-4 mb-4">
          <button
            @click="importQuestions"
            class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 text-center font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            匯入題目
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-if="store.chapters.length > 0"
            @click="togglePreview"
            class="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 text-center font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
          </button>
          <router-link
            v-if="store.chapters.length > 0"
            to="/quiz-settings"
            class="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 text-center font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            開始測驗
          </router-link>
        </div>
      </div>

      <!-- 題庫預覽 -->
      <div
        v-if="store.chapters.length > 0 && showPreview"
        class="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 class="text-2xl text-gray-800 font-semibold mb-8 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          題庫預覽
        </h2>
        <div v-for="chapter in store.chapters" :key="chapter.id" class="mb-8">
          <h3 class="text-xl text-gray-800 font-medium mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-blue-500/50 rounded-full"></span>
            {{ chapter.name }}
          </h3>
          <div class="space-y-6">
            <div
              v-for="question in chapter.questions"
              :key="question.id"
              class="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
            >
              <p class="text-gray-800 font-medium flex items-start gap-3">
                <span
                  class="bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                >
                  {{ question.questionNumber }}
                </span>
                <span>{{ question.content }}</span>
              </p>
              <div class="ml-11 mt-4 space-y-2">
                <p
                  v-for="option in question.options"
                  :key="option.key"
                  class="text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ({{ option.key }}) {{ option.value }}
                </p>
                <p class="mt-4 text-green-600 font-medium flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  答案: {{ question.answers.join('') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 格式說明 modal -->
      <div
        v-if="showFormatModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showFormatModal = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto p-8 transform transition-all duration-200"
        >
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
              題目格式說明
            </h3>
            <button
              @click="showFormatModal = false"
              class="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-6 text-gray-600">
            <p class="text-lg">請依照以下格式輸入題目：</p>
            <pre
              class="bg-gray-50 p-6 rounded-xl text-sm font-mono whitespace-pre-wrap border border-gray-200"
            >
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
            <div class="space-y-4">
              <p class="text-lg font-medium text-gray-800">注意事項：</p>
              <ul class="space-y-3 ml-4">
                <li class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  章節標題必須以「第X章」開頭
                </li>
                <li class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  題號格式為「章節-題號」，如：1-1、2-3 等
                </li>
                <li class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  選項需以大寫英文字母標示，格式為 (A)、(B)、(C)...
                </li>
                <li class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  答案需以「答案:」開頭，後接大寫英文字母，不需空格
                </li>
                <li class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  複選題直接連續輸入答案字母，如：ABC
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              @click="showFormatModal = false"
              class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
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
