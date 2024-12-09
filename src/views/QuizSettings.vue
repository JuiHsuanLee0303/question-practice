<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl text-gray-800 font-bold mb-4">測驗設定</h1>

    <div class="max-w-md mx-auto">
      <!-- 選擇章節 -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg text-gray-800 font-semibold">選擇章節</h2>
          <button
            @click="toggleAllChapters"
            class="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {{ isAllSelected ? '取消全選' : '全選' }}
          </button>
        </div>
        <div class="space-y-2">
          <label v-for="chapter in chapters" :key="chapter.id" class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="selectedChapters"
              :value="chapter.id"
              class="form-checkbox"
            />
            <span class="text-gray-800"
              >{{ chapter.name }} ({{ chapter.questions.length }} 題)</span
            >
          </label>
        </div>
      </div>

      <!-- 選擇題數 -->
      <div class="mb-6">
        <h2 class="text-lg text-gray-800 font-semibold mb-2">選擇題數</h2>
        <input
          type="number"
          v-model="numberOfQuestions"
          min="1"
          :max="maxQuestions"
          class="w-full p-2 border rounded text-gray-800"
        />
        <p class="mt-1 text-gray-800">可選擇題數範圍：1 - {{ maxQuestions }} 題</p>
      </div>

      <!-- 開始測驗按鈕 -->
      <div class="flex justify-between">
        <router-link to="/" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          返回
        </router-link>
        <button
          @click="startQuiz"
          :disabled="!canStartQuiz"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          開始測驗
        </button>
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

async function startQuiz() {
  if (!canStartQuiz.value) return

  try {
    await store.startQuiz({
      selectedChapters: selectedChapters.value,
      numberOfQuestions: numberOfQuestions.value,
    })
    await router.push('/quiz')
  } catch (error: Error) {
    alert(`開始測驗時發生錯誤: ${error.message}`)
  }
}
</script>
