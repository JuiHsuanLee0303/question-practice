<template>
  <div class="min-h-screen">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <h1
        class="text-3xl text-gray-800 font-bold text-center mb-12 flex items-center justify-center gap-3"
      >
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
        測驗設定
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
      </h1>
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-12">
        <!-- 選擇章節 -->
        <div>
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl text-gray-800 font-semibold flex items-center gap-3">
              <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
              選擇章節
            </h2>
            <button
              @click="toggleAllChapters"
              class="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 font-medium flex items-center gap-2"
            >
              <span v-if="isAllSelected" class="i-carbon-checkbox-checked-filled text-lg"></span>
              <span v-else class="i-carbon-checkbox text-lg"></span>
              {{ isAllSelected ? '取消全選' : '全選' }}
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label
              v-for="chapter in chapters"
              :key="chapter.id"
              class="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group relative overflow-hidden"
            >
              <input
                type="checkbox"
                v-model="selectedChapters"
                :value="chapter.id"
                class="w-5 h-5 text-blue-500 border-gray-300 rounded-lg focus:ring-blue-500 cursor-pointer"
              />
              <div class="ml-4 flex-1">
                <span
                  class="text-gray-800 font-medium group-hover:text-blue-600 transition-colors block"
                >
                  {{ chapter.name }}
                </span>
                <span class="text-gray-500 text-sm mt-1 block">
                  共 {{ chapter.questions.length }} 題
                </span>
              </div>
              <div
                class="absolute right-0 top-0 h-full w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </label>
          </div>
        </div>

        <!-- 選擇題數 -->
        <div>
          <h2 class="text-2xl text-gray-800 font-semibold mb-8 flex items-center gap-3">
            <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
            選擇題數
          </h2>
          <div class="max-w-2xl">
            <div class="flex flex-col space-y-6">
              <!-- 快速選擇題數 -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  v-for="count in [10, 20, 50]"
                  :key="count"
                  @click="numberOfQuestions = count"
                  :class="[
                    'relative px-6 py-4 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 overflow-hidden',
                    numberOfQuestions === count
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105 hover:bg-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300',
                  ]"
                >
                  <span class="text-xl">{{ count }}</span>
                  <span>題</span>
                </button>
              </div>

              <!-- 自訂題數 -->
              <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div class="flex items-center justify-center space-x-4">
                  <input
                    type="number"
                    v-model="numberOfQuestions"
                    min="1"
                    :max="maxQuestions"
                    class="w-32 p-4 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg shadow-sm"
                  />
                  <span class="text-gray-700 font-medium text-lg">題</span>
                </div>
                <p class="text-gray-600 text-center mt-4">
                  可選擇題數範圍：1 - {{ maxQuestions }} 題
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <router-link
            to="/"
            class="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-center min-w-[160px]"
          >
            返回
          </router-link>
          <button
            @click="startQuiz"
            :disabled="!canStartQuiz"
            class="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none min-w-[160px]"
          >
            開始測驗
          </button>
        </div>

        <!-- 提示訊息 -->
        <div
          v-if="!canStartQuiz"
          class="p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3"
        >
          <span class="i-carbon-warning-filled text-amber-500 text-xl"></span>
          <p class="text-amber-700">
            {{ getErrorMessage() }}
          </p>
        </div>
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
const numberOfQuestions = ref(1)

// 初始化時全選所有章節
onMounted(() => {
  selectedChapters.value = chapters.map((chapter) => chapter.id)
  numberOfQuestions.value = maxQuestions.value
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
