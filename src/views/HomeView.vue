<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 via-gray-50 to-white pb-16">
    <div class="container mx-auto px-4 mt-14 md:mt-0">
      <!-- 歡迎區域 -->
      <div class="text-center mb-16">
        <h1 class="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">線上題庫測驗系統</h1>
        <p class="text-xl text-gray-600 max-w-4xl mx-auto">
          專業的線上學習平台，提供多元化題庫和即時測驗功能，幫助你突破學習瓶頸，邁向卓越
        </p>
      </div>

      <!-- 功能卡片區域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <!-- 題庫練習 -->
        <router-link to="/question-bank"
          class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div
            class="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">題庫練習</h2>
          <p class="text-gray-600 leading-relaxed">
            自由選擇題目進行練習，打造個人化學習計畫。提供詳細解析和學習建議，幫助你掌握重點知識。
          </p>
        </router-link>

        <!-- 線上題庫 -->
        <router-link to="/online-bank"
          class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div
            class="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">線上題庫</h2>
          <p class="text-gray-600 leading-relaxed">
            豐富多元的題目資源庫，涵蓋各種類型和難度。定期更新題目內容，確保學習資源的時效性。
          </p>
        </router-link>

        <!-- 歷史紀錄 -->
        <router-link to="/history"
          class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div
            class="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
            <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">學習歷程</h2>
          <p class="text-gray-600 leading-relaxed">
            完整記錄你的學習歷程，透過數據分析找出學習盲點。智能推薦適合的題目，協助你持續進步。
          </p>
        </router-link>
      </div>

      <!-- 系統使用說明區域 -->
      <div class="mt-24">
        <div class="bg-white rounded-3xl shadow-lg p-12">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">系統使用說明</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="flex gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">註冊/登入帳號</h3>
                <p class="text-gray-600 leading-relaxed">
                  首次使用請先註冊帳號，已有帳號的使用者可直接登入。註冊時請填寫正確的電子郵件，以便接收重要通知。
                </p>
              </div>
            </div>

            <div class="flex gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-green-600">2</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">選擇題庫類型</h3>
                <p class="text-gray-600 leading-relaxed">
                  根據您的需求選擇適合的題庫類型。我們提供多種類型的題目，包括選擇題、是非題等，讓您能夠全方位學習。
                </p>
              </div>
            </div>

            <div class="flex gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-purple-600">3</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">開始練習</h3>
                <p class="text-gray-600 leading-relaxed">
                  進入題目後，仔細閱讀題目內容並選擇答案。系統會即時顯示答題結果，並提供詳細的解析說明。
                </p>
              </div>
            </div>

            <div class="flex gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-orange-600">4</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">查看學習紀錄</h3>
                <p class="text-gray-600 leading-relaxed">
                  在歷史紀錄中查看您的學習進度和表現分析。系統會根據您的答題情況，提供個人化的學習建議。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新消息區域 -->
      <div class="mt-24">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">最新消息</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="news in newsItems" :key="news.date"
            class="bg-white rounded-2xl shadow-lg p-8 group hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div class="flex-grow">
              <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ news.date }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{{ news.title
                }}</h3>
              <p class="text-gray-600">{{ news.summary }}</p>
            </div>
            <button @click="openModal(news)"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-6">
              閱讀更多
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="showModal = false">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" @click.stop>
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedNews.title }}</h3>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ selectedNews.date }}</span>
              </div>
            </div>
            <button @click="showModal = false" class="text-gray-500 hover:text-gray-700 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="prose prose-blue max-w-none">
            <p class="whitespace-pre-line">{{ selectedNews.content }}</p>
          </div>
        </div>
      </div>

      <!-- 系統特色區域 -->
      <div class="mt-24">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">為什麼選擇我們？</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div class="text-center">
            <div class="bg-blue-100 rounded-2xl h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <svg class="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">客製化學習</h3>
            <p class="text-gray-600">根據個人程度和需求，打造最適合的學習計畫</p>
          </div>

          <div class="text-center">
            <div class="bg-green-100 rounded-2xl h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <svg class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">數據分析</h3>
            <p class="text-gray-600">透過數據視覺化，清楚掌握學習成效</p>
          </div>

          <div class="text-center">
            <div class="bg-purple-100 rounded-2xl h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <svg class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">即時回饋</h3>
            <p class="text-gray-600">詳細的解題說明，幫助快速理解觀念</p>
          </div>

          <div class="text-center">
            <div class="bg-orange-100 rounded-2xl h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <svg class="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">持續更新</h3>
            <p class="text-gray-600">題庫內容定期更新，確保學習資源最新</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Modal state
const showModal = ref(false)
const selectedNews = ref({
  title: '',
  date: '',
  content: ''
})

interface NewsItem {
  date: string
  title: string
  summary: string
  content: string
}

const newsItems: NewsItem[] = [
  {
    date: '2024-12-18',
    title: '系統介面全新升級',
    summary: '為提供更好的使用體驗，我們更新了系統介面，加入更多實用功能，包含個人化的學習追蹤、智能題目推薦等多項新功能。',
    content: `為提供更好的使用體驗，我們很高興宣布系統介面全新升級！

本次更新重點包括：
1. 個人化學習追蹤
   - 詳細的學習進度視覺化
   - 個人答題模式分析
   - 學習時間統計報告

2. 智能題目推薦
   - 基於個人答題歷史的推薦算法
   - 針對性的弱點題型推薦
   - 自適應難度調整

3. 介面優化
   - 更直觀的操作流程
   - 優化的行動裝置支援
   - 新增深色模式支援

我們會持續聆聽使用者意見，不斷改進系統功能，提供最佳的學習體驗。`
  },
  {
    date: '2024-01-10',
    title: '新增進階題庫',
    summary: '因應使用者需求，我們新增了多個進階題庫，包含更具挑戰性的題目，適合想要深入學習的使用者。新題庫涵蓋多個領域，提供更全面的學習資源。',
    content: `我們很高興宣布新進階題庫正式上線！

新增題庫特色：
1. 多元領域覆蓋
   - 理論深度加強
   - 實務應用導向
   - 跨領域整合題型

2. 進階難度設計
   - 漸進式難度提升
   - 綜合分析型題目
   - 情境模擬測驗

3. 詳盡解析說明
   - 完整解題思路
   - 相關知識延伸
   - 常見錯誤分析

歡迎有志深入學習的使用者挑戰！`
  },
  {
    date: '2024-01-05',
    title: '寒假特別活動開跑',
    summary: '寒假期間推出特別活動，完成指定題目即可獲得額外積分獎勵。活動期間還有限定獎勵和特殊成就徽章，歡迎所有學習者踴躍參與。',
    content: `寒假特別活動正式開始！

活動詳情：
1. 活動期間
   - 開始：2024/01/05
   - 結束：2024/02/28

2. 活動獎勵
   - 完成每日題目可獲得雙倍積分
   - 連續答題可獲得額外獎勵
   - 特殊限定成就徽章

3. 參與方式
   - 登入系統即可參加
   - 每日提供特別題組
   - 完成指定任務解鎖獎勵

活動期間還有更多驚喜等著您，趕快來參加吧！`
  }
]

const openModal = (news: NewsItem) => {
  selectedNews.value = news
  showModal.value = true
}
</script>
