<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h1
        class="text-3xl text-gray-800 font-bold text-center mb-12 flex items-center justify-center gap-3"
      >
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
        測驗歷史記錄
        <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
      </h1>

      <!-- 統計資訊 -->
      <div v-if="!recordsStore.loading && recordsStore.statistics" class="mb-12">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl text-gray-800 font-semibold mb-8 flex items-center gap-3">
            <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
            整體統計
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">總答題數</div>
              <div class="text-3xl font-bold text-gray-800">
                {{ recordsStore.statistics?.totalAnswered || 0 }}
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">答對題數</div>
              <div class="text-3xl font-bold text-green-600">
                {{ recordsStore.statistics?.correctCount || 0 }}
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">正確率</div>
              <div class="text-3xl font-bold text-blue-600">
                {{ ((recordsStore.statistics?.accuracy || 0) * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">平均答題時間</div>
              <div class="text-3xl font-bold text-purple-600">
                {{ (recordsStore.statistics?.averageTime || 0).toFixed(1) }}秒
              </div>
            </div>
          </div>

          <!-- 各類別統計 -->
          <div class="mt-8">
            <h3 class="text-xl text-gray-800 font-medium mb-6">各類別統計</h3>
            <div class="space-y-4">
              <div
                v-for="(stats, category) in recordsStore.statistics?.byCategory || {}"
                :key="category"
                class="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="font-medium text-gray-800">{{ category }}</div>
                  <div class="text-sm text-gray-500">共 {{ stats.answered }} 題</div>
                </div>
                <div class="relative pt-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs font-semibold inline-block text-blue-600">
                        正確率: {{ (stats.accuracy * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                  <div class="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100 mt-2">
                    <div
                      :style="{ width: `${stats.accuracy * 100}%` }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 歷史記錄 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl text-gray-800 font-semibold mb-8 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          答題記錄
        </h2>

        <!-- Loading 狀態 -->
        <div v-if="recordsStore.loading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"
          ></div>
        </div>

        <!-- 記錄列表 -->
        <div v-else-if="recordsStore.records.length > 0" class="space-y-6">
          <div
            v-for="record in recordsStore.records"
            :key="record.id"
            class="bg-gray-50 rounded-xl p-6 border border-gray-200"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <div class="text-lg font-medium text-gray-800">
                  {{ record.questionId }}
                </div>
                <div class="flex items-center space-x-4 text-sm">
                  <div class="flex items-center text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ record.timeSpent }} 秒
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {{ new Date(record.createdAt).toLocaleString() }}
                  </div>
                </div>
                <div class="text-gray-700">答案: {{ record.answer }}</div>
              </div>
              <div
                :class="[
                  'px-3 py-1 rounded-lg text-sm font-medium',
                  record.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                ]"
              >
                {{ record.isCorrect ? '答對' : '答錯' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 無記錄 -->
        <div v-else class="text-center py-12 text-gray-500">尚無答題記錄</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRecordsStore } from '@/stores/records'

const authStore = useAuthStore()
const recordsStore = useRecordsStore()

onMounted(async () => {
  console.log(authStore.user)
  if (authStore.user) {
    await Promise.all([
      recordsStore.fetchUserRecords(authStore.user.uid),
      recordsStore.fetchUserStatistics(authStore.user.uid),
    ])
  }
})
</script>
