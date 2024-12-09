<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-3xl text-gray-800 font-bold mb-8">測驗設定</h1>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- 選擇章節 -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl text-gray-800 font-semibold">選擇章節</h2>
          <button
            @click="toggleAllChapters"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {{ isAllSelected ? '取消全選' : '全選' }}
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            v-for="chapter in chapters"
            :key="chapter.id"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <input
              type="checkbox"
              v-model="selectedChapters"
              :value="chapter.id"
              class="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div class="ml-3">
              <span class="text-gray-800 font-medium group-hover:text-gray-900">
                {{ chapter.name }}
              </span>
              <span class="ml-2 text-gray-500 text-sm"> ({{ chapter.questions.length }} 題) </span>
            </div>
          </label>
        </div>
      </div>

      <!-- 選擇題數 -->
      <div class="mb-8">
        <h2 class="text-2xl text-gray-800 font-semibold mb-4">選擇題數</h2>
        <div class="max-w-xs">
          <div class="flex items-center space-x-4">
            <input
              type="number"
              v-model="numberOfQuestions"
              min="1"
              :max="maxQuestions"
              class="w-24 p-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <span class="text-gray-700">題</span>
          </div>
          <p class="mt-2 text-gray-600">可選擇題數範圍：1 - {{ maxQuestions }} 題</p>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex flex-wrap gap-4">
        <router-link
          to="/"
          class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          返回
        </router-link>
        <button
          @click="startQuiz"
          :disabled="!canStartQuiz"
          class="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          開始測驗
        </button>
      </div>

      <!-- 提示訊息 -->
      <div v-if="!canStartQuiz" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-yellow-700">
          {{ getErrorMessage() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionBankStore } from '@/stores/questionBank'

const router = useRouter()
const store = useQuestionBankStore()
const chapters = store.chapters

const selectedChapters = ref<string[]>([])
const numberOfQuestions = ref(10)

// 初始化時全選所有章節
onMounted(() => {
  selectedChapters.value = chapters.map((chapter) => chapter.id)
})

const isAllSelected = computed(() => {
  return selectedChapters.value.length === chapters.length
})

function toggleAllChapters() {
  if (isAllSelected.value) {
    selectedChapters.value = []
  } else {
    selectedChapters.value = chapters.map((chapter) => chapter.id)
  }
}

const maxQuestions = computed(() => {
  return chapters
    .filter((chapter) => selectedChapters.value.includes(chapter.id))
    .reduce((sum, chapter) => sum + chapter.questions.length, 0)
})

const canStartQuiz = computed(() => {
  return (
    selectedChapters.value.length > 0 &&
    numberOfQuestions.value > 0 &&
    numberOfQuestions.value <= maxQuestions.value
  )
})

function getErrorMessage() {
  if (selectedChapters.value.length === 0) {
    return '請至少選擇一個章節'
  }
  if (numberOfQuestions.value <= 0) {
    return '題數必須大於 0'
  }
  if (numberOfQuestions.value > maxQuestions.value) {
    return `題數不能超過 ${maxQuestions.value}`
  }
  return ''
}

async function startQuiz() {
  if (!canStartQuiz.value) return

  try {
    await store.startQuiz({
      selectedChapters: selectedChapters.value,
      numberOfQuestions: numberOfQuestions.value,
    })
    await router.push('/quiz')
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`開始測驗時發生錯誤: ${error.message}`)
    } else {
      alert('開始測驗時發生未知錯誤')
    }
  }
}
</script>
