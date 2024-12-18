<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- 歡迎區域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">歡迎使用線上題庫測驗系統</h1>
        <p class="text-xl text-gray-600">提升你的學習效率，實現知識的突破</p>
      </div>

      <!-- 功能卡片區域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- 題庫練習 -->
        <router-link
          to="/question-bank"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">題庫練習</h2>
          <p class="text-gray-600">
            瀏覽完整題庫，選擇你想要練習的題目。支持單選和多選題型，幫助你全面掌握知識點。
          </p>
        </router-link>

        <!-- 模擬測驗 -->
        <div class="relative group">
          <router-link v-if="isLoggedIn" to="/quiz-settings" class="block">
            <div
              class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">模擬測驗</h2>
              <p class="text-gray-600">
                模擬真實考試環境，限時作答，檢測你的實力。系統會自動計算得分，幫助你了解自己的程度。
              </p>
            </div>
          </router-link>
          <div v-else class="bg-white rounded-2xl shadow-lg p-6 opacity-75">
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">模擬測驗</h2>
            <p class="text-gray-600">
              模擬真實考試環境，限時作答，檢測你的實力。系統會自動計算得分，幫助你了解自己的程度。
            </p>
          </div>
          <!-- 未登入覆蓋層 -->
          <div
            v-if="!isLoggedIn"
            class="absolute inset-0 rounded-2xl flex items-center justify-center bg-gray-900 bg-opacity-25 backdrop-blur-sm transition-all duration-300"
          >
            <div class="text-center bg-white/90 px-6 py-4 rounded-xl shadow-lg">
              <p class="font-medium text-gray-900 mb-3">登入後可進行模擬測驗</p>
              <div class="flex gap-2 justify-center">
                <router-link
                  to="/login"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  登入
                </router-link>
                <router-link
                  to="/register"
                  class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  註冊
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 歷史記錄 -->
        <div class="relative group">
          <router-link v-if="isLoggedIn" to="/history" class="block">
            <div
              class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  class="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">歷史記錄</h2>
              <p class="text-gray-600">
                查看你的答題歷史和進步軌跡。分析錯題，掌握知識盲點，制定更有效的學習計劃。
              </p>
            </div>
          </router-link>
          <div v-else class="bg-white rounded-2xl shadow-lg p-6 opacity-75">
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg
                class="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">歷史記錄</h2>
            <p class="text-gray-600">
              查看你的答題歷史和進步軌跡。分析錯題，掌握知識盲點，制定更有效的學習計劃。
            </p>
          </div>
          <!-- 未登入覆蓋層 -->
          <div
            v-if="!isLoggedIn"
            class="absolute inset-0 rounded-2xl flex items-center justify-center bg-gray-900 bg-opacity-25 backdrop-blur-sm transition-all duration-300"
          >
            <div class="text-center bg-white/90 px-6 py-4 rounded-xl shadow-lg">
              <p class="font-medium text-gray-900 mb-3">登入後可查看歷史記錄</p>
              <div class="flex gap-2 justify-center">
                <router-link
                  to="/login"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  登入
                </router-link>
                <router-link
                  to="/register"
                  class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  註冊
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系統特色 -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">系統特色</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">靈活的練習模式</h3>
            <p class="text-gray-600">自由選擇題目類型和數量，依照自己的節奏學習</p>
          </div>

          <div class="text-center">
            <div
              class="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">詳細的統計分析</h3>
            <p class="text-gray-600">追蹤學習進度，分析答題表現，找出需要加強的地方</p>
          </div>

          <div class="text-center">
            <div
              class="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">即時的答題回饋</h3>
            <p class="text-gray-600">立即查看答案解析，幫助你更好地理解知識點</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>
