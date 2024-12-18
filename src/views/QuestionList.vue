<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">題目列表</h1>

    <!-- 搜索和篩選 -->
    <div class="mb-6 flex gap-4">
      <input v-model="searchQuery" type="text" placeholder="搜索題目..."
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <select v-model="selectedExam"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">所有考試</option>
        <option v-for="exam in examList" :key="exam.examId" :value="exam.examId">
          {{ exam.examName }}
        </option>
      </select>
    </div>

    <!-- 题目列表 -->
    <div class="space-y-6">
      <div v-for="question in filteredQuestions" :key="question.id" class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold mb-2">
              {{ question.examName }} - 第{{ question.chapterNum }}章 - 題號{{
                question.questionNum
              }}
            </h3>
            <p class="text-gray-700">{{ question.content }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="editQuestion(question)"
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              修改
            </button>
            <button @click="confirmDelete(question)"
              class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
              刪除
            </button>
          </div>
        </div>

        <!-- 選項列表 -->
        <div class="space-y-2 ml-4">
          <div v-for="(option, index) in question.options" :key="index" class="text-gray-600">
            {{ ['A', 'B', 'C', 'D'][index] }}. {{ option }}
          </div>
        </div>

        <div class="mt-4 text-sm text-gray-500">
          答案: {{ formatAnswer(question.answer) }} ({{ question.isMultiple ? '多選' : '單選' }})
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <Modal v-if="showEditModal" :show="showEditModal" :title="'編輯題目'" :message="''" @close="showEditModal = false">
      <template #default>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">題目內容</label>
            <textarea v-model="editingQuestion.content" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>

          <div v-for="(option, index) in editingQuestion.options" :key="index">
            <label class="block text-sm font-medium text-gray-700">選項 {{ ['A', 'B', 'C', 'D'][index] }}</label>
            <input v-model="editingQuestion.options[index]" type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">答案</label>
            <div class="mt-1 space-x-2">
              <template v-if="editingQuestion.isMultiple">
                <label v-for="opt in ['A', 'B', 'C', 'D']" :key="opt" class="inline-flex items-center">
                  <input type="checkbox" :value="opt" v-model="editingQuestion.answer"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">{{ opt }}</span>
                </label>
              </template>
              <template v-else>
                <label v-for="opt in ['A', 'B', 'C', 'D']" :key="opt" class="inline-flex items-center">
                  <input type="radio" :value="opt" v-model="editingQuestion.answer"
                    class="border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">{{ opt }}</span>
                </label>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            取消
          </button>
          <button @click="saveQuestion"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            保存
          </button>
        </div>
      </template>
    </Modal>

    <!-- 删除确认模态框 -->
    <Modal v-if="showDeleteModal" :show="showDeleteModal" title="確認刪除" :message="'確定要刪除這個題目嗎？此操作無法撤銷。'"
      @close="showDeleteModal = false">
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            取消
          </button>
          <button @click="deleteQuestion"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            確認刪除
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Modal from '@/components/Modal.vue'

interface Question {
  id: string
  examId: string
  examName: string
  chapterNum: string
  chapterName: string
  questionNum: string
  content: string
  options: string[]
  isMultiple: boolean
  answer: string | string[]
}

const questions = ref<Question[]>([])
const examList = ref<{ examId: string; examName: string }[]>([])
const searchQuery = ref('')
const selectedExam = ref('')
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingQuestion = ref<Question>({
  id: '',
  examId: '',
  examName: '',
  chapterNum: '',
  chapterName: '',
  questionNum: '',
  content: '',
  options: ['', '', '', ''],
  isMultiple: false,
  answer: '',
})
const deletingQuestion = ref<Question | null>(null)

// 获取题目列表
const fetchQuestions = async () => {
  try {
    const response = await axios.get('/questions')
    questions.value = response.data
  } catch (error) {
    console.error('Failed to fetch questions:', error)
  }
}

// 获取考试列表
const fetchExams = async () => {
  try {
    const response = await axios.get('/questions/question-banks')
    console.log(response.data)
    examList.value = response.data
  } catch (error) {
    console.error('Failed to fetch exams:', error)
  }
}

// 筛选题目
const filteredQuestions = computed(() => {
  return questions.value.filter((q) => {
    const matchesSearch =
      searchQuery.value === '' ||
      q.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      q.questionNum.includes(searchQuery.value)
    const matchesExam = selectedExam.value === '' || q.examId === selectedExam.value
    return matchesSearch && matchesExam
  })
})

// 格式化答案显示
const formatAnswer = (answer: string | string[]) => {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  return answer
}

// 编辑题目
const editQuestion = (question: Question) => {
  editingQuestion.value = JSON.parse(JSON.stringify(question)) // 深拷贝
  showEditModal.value = true
}

// 保存题目
const saveQuestion = async () => {
  try {
    await axios.put(`/questions/${editingQuestion.value.id}`, editingQuestion.value)
    await fetchQuestions() // 重新获取题目列表
    showEditModal.value = false
  } catch (error) {
    console.error('Failed to save question:', error)
  }
}

// 确认删除
const confirmDelete = (question: Question) => {
  deletingQuestion.value = question
  showDeleteModal.value = true
}

// 删除题目
const deleteQuestion = async () => {
  if (!deletingQuestion.value) return

  try {
    await axios.delete(`/questions/${deletingQuestion.value.id}`)
    await fetchQuestions() // 重新获取题目列表
    showDeleteModal.value = false
  } catch (error) {
    console.error('Failed to delete question:', error)
  }
}

onMounted(() => {
  fetchQuestions()
  fetchExams()
})
</script>
