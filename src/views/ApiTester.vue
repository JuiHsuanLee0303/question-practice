<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">API 測試工具</h1>

    <!-- API 選擇 -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4">選擇 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="api in apis"
          :key="api.name"
          @click="selectApi(api)"
          class="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
          :class="selectedApi?.name === api.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
        >
          <div class="font-semibold mb-2">{{ api.name }}</div>
          <div class="text-sm text-gray-600">{{ api.description }}</div>
        </button>
      </div>
    </div>

    <!-- API 測試區域 -->
    <div v-if="selectedApi" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">{{ selectedApi.name }}</h2>
        <div class="space-x-2">
          <button
            v-for="method in selectedApi.methods"
            :key="method"
            @click="selectedMethod = method"
            class="px-4 py-2 rounded-lg text-sm font-semibold"
            :class="getMethodClass(method)"
          >
            {{ method }}
          </button>
        </div>
      </div>

      <!-- 請求參數 -->
      <div v-if="selectedApi.urlParams?.length" class="space-y-2">
        <h3 class="font-semibold">URL 參數</h3>
        <template v-if="selectedApi.name === '題目管理' && (selectedMethod === 'POST' || selectedMethod === 'GET')">
            <div v-if="selectedMethod === 'GET'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">查詢方式</label>
            <div class="flex gap-2">
              <button
                @click="getQuestionMode = 'all'"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="getQuestionMode === 'all' ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                取得題庫中所有題目
              </button>
              <button
                @click="getQuestionMode = 'single'"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="getQuestionMode === 'single' ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                取得單一題目
              </button>
            </div>
          </div>
            <div v-if="!(selectedMethod === 'GET' && getQuestionMode === 'single')" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">選擇題庫</label>
            <select
              v-model="urlParams.examId"
              @change="selectExam((($event.target as HTMLSelectElement).value))"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇題庫</option>
              <option v-for="exam in examsList" :key="exam.id" :value="exam.id">
                {{ exam.name }}
              </option>
            </select>
          </div>
          <div v-if="selectedMethod === 'GET' && getQuestionMode === 'single'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">題目 ID</label>
            <input
              v-model="urlParams.questionId"
              placeholder="請輸入題目 ID"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </template>
        <div v-for="param in selectedApi.urlParams" :key="param.name" class="flex gap-4">
          <template v-if="!(
            (selectedApi.name === '題目管理' && (selectedMethod === 'POST' || selectedMethod === 'GET' || selectedMethod === 'PUT' || selectedMethod === 'DELETE') && param.name === 'examId') ||
            (selectedApi.name === '題目管理' && selectedMethod === 'GET' && param.name === 'questionId') ||
            (selectedApi.name === '題庫管理' && selectedMethod === 'POST' && param.name === 'id')
          )">
            <input
              v-model="urlParams[param.name]"
              @input="handleIdInput($event, param.name)"
              :placeholder="param.description"
              class="flex-1 px-4 py-2 border rounded-lg"
            />
          </template>
        </div>
      </div>

      <!-- URL 預覽 -->
      <div v-if="selectedMethod" class="bg-gray-50 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">請求 URL 預覽</h3>
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 rounded text-sm font-mono"
            :class="getMethodClass(selectedMethod)"
          >
            {{ selectedMethod }}
          </span>
          <code class="text-sm break-all">{{ getPreviewUrl() }}</code>
        </div>
      </div>

      <!-- 請求內容 -->
      <div v-if="['POST', 'PUT', 'PATCH'].includes(selectedMethod)">
        <h3 class="font-semibold mb-2">請求內容</h3>
        <textarea
          v-model="requestBody"
          rows="10"
          class="w-full px-4 py-2 border rounded-lg font-mono text-sm"
          placeholder="輸入 JSON 格式的請求內容..."
        ></textarea>
      </div>

      <!-- 發送請求按鈕 -->
      <div class="flex justify-end">
        <button
          @click="sendRequest"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          發送請求
        </button>
      </div>
    </div>

    <!-- 響應結果 -->
    <div v-if="response" class="space-y-4">
      <h3 class="font-semibold">響應結果</h3>
      <div class="flex items-center gap-2 text-sm">
        <span
          class="px-2 py-1 rounded"
          :class="response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          狀態碼: {{ response.status }}
        </span>
        <span class="text-gray-500">
          響應時間: {{ response.time }}ms
        </span>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        <VueJsonPretty
          :data="response.data"
          :deep="2"
          :show-double-quotes="true"
          :show-length="true"
          :show-line="true"
          :collapsed-on-click-brackets="true"
          class="text-sm"
          :style-config="{
            keyColor: '#0ea5e9',
            valueColor: '#374151',
            stringColor: '#059669',
            numberColor: '#7c3aed',
            booleanColor: '#d97706',
            nullColor: '#dc2626'
          }"
        />
      </div>
    </div>

    <!-- 錯誤提示 -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

interface ApiParam {
  name: string
  description: string
  required: boolean
}

interface ApiDefinition {
  name: string
  description: string
  path: string
  methods: string[]
  urlParams?: ApiParam[]
  bodyExample?: string
}

interface ApiResponse {
  status: number
  data: any
  time: number
}

// API 定義
const apis = [
  {
    name: '題庫管理',
    description: '題庫的增、查詢、修改、刪除',
    path: '/exams',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    urlParams: [
      {
        name: 'id',
        description: '題庫 ID（GET單一、PUT、DELETE時需要）',
        required: false
      }
    ],
    bodyExample: JSON.stringify({
      name: '範例題庫',
      code: 'EXAM001',
      category: 'programming',
      description: '這是一個範例題庫'
    }, null, 2)
  },
  {
    name: '題目管理',
    description: '題目的新增、查詢、修改、刪除',
    path: '/exams/:examId/questions',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    urlParams: [
      {
        name: 'examId',
        description: '題庫 ID',
        required: true
      },
      {
        name: 'questionId',
        description: '題目 ID（GET單一、PUT、DELETE時需要）',
        required: false
      }
    ],
    bodyExample: JSON.stringify({
      content: "這是一個範例題目？",
      type: "SINGLE_CHOICE",
      options: ["選項A", "選項B", "選項C", "選項D"],
      answer: "A",
    }, null, 2)
  },
  {
    name: '使用者管理',
    description: '使用者的查詢、修改、刪除',
    path: '/users',
    methods: ['GET', 'PUT', 'DELETE'],
    urlParams: [
      {
        name: 'id',
        description: '使用者 ID（GET單一、PUT、DELETE時需要）',
        required: false
      }
    ],
    bodyExample: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    }, null, 2)
  },
  {
    name: '使用者認證',
    description: '使用者登入、註冊、登出',
    path: '/auth',
    methods: ['POST'],
    urlParams: [
      {
        name: 'action',
        description: '動作（login/register/logout）',
        required: true
      }
    ],
    bodyExample: JSON.stringify({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    }, null, 2)
  },
  {
    name: '考試記錄',
    description: '考試記錄的查詢',
    path: '/exam-results',
    methods: ['GET', 'POST'],
    urlParams: [
      {
        name: 'id',
        description: '記錄 ID（GET單一時需要）',
        required: false
      }
    ],
    bodyExample: JSON.stringify({
      examId: '1',
      answers: ['A', 'B', 'C'],
      timeSpent: 1800
    }, null, 2)
  }
]

interface ExamOption {
  id: string
  name: string
}

const selectedApi = ref<ApiDefinition | null>(null)
const selectedMethod = ref<string>('')
const urlParams = ref<Record<string, string>>({})
const requestBody = ref('')
const response = ref<ApiResponse | null>(null)
const error = ref('')
const examsList = ref<ExamOption[]>([])
const getQuestionMode = ref('all')

const getMethodClass = (method: string) => {
  const baseClass = 'border'
  if (method === selectedMethod.value) {
    switch (method) {
      case 'GET':
        return `${baseClass} bg-green-500 text-white border-green-500`
      case 'POST':
        return `${baseClass} bg-blue-500 text-white border-blue-500`
      case 'PUT':
        return `${baseClass} bg-yellow-500 text-white border-yellow-500`
      case 'DELETE':
        return `${baseClass} bg-red-500 text-white border-red-500`
      default:
        return `${baseClass} bg-gray-500 text-white border-gray-500`
    }
  }
  return `${baseClass} border-gray-200 text-gray-700 hover:bg-gray-50`
}

// 選擇 API
const selectApi = async (api: ApiDefinition) => {
  selectedApi.value = api
  selectedMethod.value = ''
  urlParams.value = {}
  requestBody.value = api.bodyExample || ''
  response.value = null
  error.value = ''

  // 如果是題目管理 API，載入題庫列表
  if (api.name === '題目管理') {
    try {
      const result = await axios.get('/exams')
      examsList.value = result.data.map((exam: any) => ({
        id: exam.id,
        name: `${exam.name}${exam.code ? ` (${exam.code})` : ''}`
      }))
    } catch (e: any) {
      error.value = '載入題庫列表失敗'
    }
  }
}

// 選擇題庫
const selectExam = (examId: string) => {
  urlParams.value.examId = examId
  // 更新範例 JSON 中的 examId
  if (selectedApi.value?.name === '題目管理' && selectedMethod.value === 'POST') {
    const bodyData = JSON.parse(requestBody.value)
    requestBody.value = JSON.stringify(bodyData, null, 2)
  }
}

// 發送請求
const sendRequest = async () => {
  if (!selectedApi.value || !selectedMethod.value) return

  try {
    error.value = ''
    response.value = null

    // 構建 URL
    let url = selectedApi.value.path
    
    // 處理特殊路徑
    if (selectedApi.value.name === '使用者認證') {
      url = `${url}/${urlParams.value.action}`
    } else if (selectedApi.value.name === '題目管理') {
      if (selectedMethod.value === 'GET' && getQuestionMode.value === 'single') {
        url = `/questions/${urlParams.value.questionId}`
      } else if (selectedMethod.value === 'PUT' || selectedMethod.value === 'DELETE') {
        url = `/questions/${urlParams.value.questionId}`
      } else if (selectedMethod.value === 'GET' || selectedMethod.value === 'POST') {
        url = url.replace(':examId', urlParams.value.examId)
      }
    } else if (selectedMethod.value === 'GET' && !urlParams.value.id && !url.includes(':')) {
      url = url
    } else {
      // 替換 URL 中的���數
      for (const [key, value] of Object.entries(urlParams.value)) {
        if (value) {
          url = url.replace(`:${key}`, value)
          if ((selectedMethod.value === 'GET' && key === 'id') || 
              selectedMethod.value === 'PUT' || 
              selectedMethod.value === 'DELETE') {
            if (!url.endsWith(value)) {
              url = `${url}/${value}`
            }
          }
        }
      }
    }

    // 開始計時
    const startTime = Date.now()

    // 發送請求
    let result
    switch (selectedMethod.value) {
      case 'GET':
        result = await axios.get(url)
        break
      case 'POST':
        result = await axios.post(url, JSON.parse(requestBody.value))
        break
      case 'PUT':
        result = await axios.put(url, JSON.parse(requestBody.value))
        break
      case 'DELETE':
        result = await axios.delete(url)
        break
      default:
        throw new Error('不支援的請求方法')
    }

    // 計算響應時間
    const endTime = Date.now()

    // 設置響應結果
    response.value = {
      status: result.status,
      data: result.data,
      time: endTime - startTime
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || '請求'
    if (e.response) {
      response.value = {
        status: e.response.status,
        data: e.response.data,
        time: 0
      }
    }
  }
}

const getPreviewUrl = (): string => {
  if (!selectedApi.value || !selectedMethod.value) return ''

  let url = selectedApi.value.path
  
  if (selectedApi.value.name === '使用者認證') {
    url = `${url}/${urlParams.value.action}`
  } else if (selectedApi.value.name === '題目管理') {
    if (selectedMethod.value === 'GET' && getQuestionMode.value === 'single') {
      url = `/questions/${urlParams.value.questionId}`
    } else if (selectedMethod.value === 'PUT' || selectedMethod.value === 'DELETE') {
      url = `/questions/${urlParams.value.questionId}`
    } else if (selectedMethod.value === 'GET' || selectedMethod.value === 'POST') {
      url = url.replace(':examId', urlParams.value.examId)
    }
  } else if (selectedMethod.value === 'GET' && !urlParams.value.id && !url.includes(':')) {
    url = url
  } else {
    for (const [key, value] of Object.entries(urlParams.value)) {
      if (value) {
        url = url.replace(`:${key}`, value)
        if ((selectedMethod.value === 'GET' && key === 'id') || 
            selectedMethod.value === 'PUT' || 
            selectedMethod.value === 'DELETE') {
          if (!url.endsWith(value)) {
            url = `${url}/${value}`
          }
        }
      }
    }
  }

  return url
}

// 處理 ID 輸入
const handleIdInput = async (event: Event, paramName: string) => {
  const value = (event.target as HTMLInputElement).value
  if (!selectedApi.value || selectedMethod.value !== 'PUT') return

  try {
    if (selectedApi.value.name === '題庫管理' && paramName === 'id' && value) {
      const result = await axios.get(`/exams/${value}`)
      requestBody.value = JSON.stringify(result.data, null, 2)
    } else if (selectedApi.value.name === '題目管理' && paramName === 'questionId' && value) {
      const result = await axios.get(`/questions/${value}`)
      requestBody.value = JSON.stringify(result.data, null, 2)
    }
  } catch (e: any) {
    error.value = '載入資料失敗'
  }
}
</script> 