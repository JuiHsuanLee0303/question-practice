<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl text-gray-800 font-bold mb-4">題庫管理</h1>

    <!-- 題庫上傳 -->
    <div class="mb-8">
      <h2 class="text-xl text-gray-800 font-semibold mb-2">上傳題庫</h2>

      <!-- 檔案上傳 -->
      <div class="mb-4">
        <label class="block text-gray-800 mb-2">從檔案上傳</label>
        <input
          type="file"
          @change="handleFileUpload"
          accept=".txt,.md,.docx"
          class="block w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
        <p class="mt-1 text-gray-800">支援的檔案格式：TXT、Markdown、Word</p>
      </div>

      <!-- 手動輸入 -->
      <div class="mb-4">
        <label class="block text-gray-800 mb-2">或直接輸入題目</label>
        <textarea
          v-model="questionText"
          class="text-gray-800 w-full h-48 p-2 border rounded"
          placeholder="請輸入題庫內容..."
        ></textarea>
      </div>

      <div class="flex space-x-4">
        <button
          @click="importQuestions"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          匯入題目
        </button>
        <button
          v-if="chapters.length > 0"
          @click="togglePreview"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {{ showPreview ? '隱藏預覽' : '顯示預覽' }}
        </button>
        <router-link
          v-if="chapters.length > 0"
          to="/quiz-settings"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          開始測驗
        </router-link>
      </div>
    </div>

    <!-- 題庫預覽 -->
    <div v-if="chapters.length > 0 && showPreview">
      <h2 class="text-xl text-gray-800 font-semibold mb-2">題庫預覽</h2>
      <div v-for="chapter in chapters" :key="chapter.id" class="mb-6">
        <h3 class="text-lg text-gray-800 font-medium mb-2">{{ chapter.name }}</h3>
        <div
          v-for="question in chapter.questions"
          :key="question.id"
          class="mb-4 p-4 bg-gray-50 rounded"
        >
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuestionBankStore } from '@/stores/questionBank'
import mammoth from 'mammoth'

const questionText = ref('')
const showPreview = ref(false)
const store = useQuestionBankStore()
const chapters = store.chapters

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
  } catch (error: Error) {
    alert(`讀取檔案時發生錯誤: ${error.message}`)
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
  } catch (error: Error) {
    alert(`匯入題目時發生錯誤: ${error.message}`)
  }
}
</script>
