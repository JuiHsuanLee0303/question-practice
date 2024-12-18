<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex justify-between h-18">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              線上題庫測驗系統
            </router-link>
          </div>

          <!-- 導航連結 -->
          <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
            <!-- <router-link
              to="/"
              class="inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
              :class="[
                $route.path === '/'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300 hover:text-blue-500',
              ]"
            >
              題庫
            </router-link> -->

            <router-link v-if="authStore.isLoggedIn" to="/history"
              class="inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
              :class="[
                $route.path === '/history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300 hover:text-blue-500',
              ]">
              歷史記錄
            </router-link>

            <template v-if="isAdmin">
              <router-link to="/question-converter"
                class="inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
                :class="[
                  $route.path === '/question-converter'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300 hover:text-blue-500',
                ]">
                題目轉換
              </router-link>
              <router-link to="/question-list"
                class="inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
                :class="[
                  $route.path === '/question-list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300 hover:text-blue-500',
                ]">
                題目列表
              </router-link>
              <router-link to="/admin"
                class="inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
                :class="[
                  $route.path === '/admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300 hover:text-blue-500',
                ]">
                後台管理
              </router-link>
            </template>
          </div>
        </div>

        <!-- 用戶選單 -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <template v-if="authStore.isLoggedIn">
            <!-- 用戶資訊 -->
            <div class="ml-3 relative">
              <div>
                <button @click="showUserMenu = !showUserMenu"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-9 w-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white font-medium shadow-sm transition-colors">
                    {{ authStore.user?.username?.[0]?.toUpperCase() }}
                  </div>
                </button>
              </div>

              <!-- 下拉選單 -->
              <div v-if="showUserMenu"
                class="origin-top-right absolute right-0 mt-3 w-52 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200">
                <div class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 font-medium">
                  {{ authStore.user?.username }}
                </div>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  登出
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <router-link to="/login"
              class="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              登入
            </router-link>
            <router-link to="/register"
              class="bg-blue-500 text-white hover:bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              註冊
            </router-link>
          </template>
        </div>

        <!-- 手機版選單按鈕 -->
        <div class="flex items-center sm:hidden">
          <button @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" :class="{ hidden: showMobileMenu, block: !showMobileMenu }" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg class="h-6 w-6" :class="{ block: showMobileMenu, hidden: !showMobileMenu }" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 手機版選單 -->
    <div v-show="showMobileMenu"
      class="fixed inset-0 bg-gray-800 bg-opacity-25 sm:hidden transition-opacity duration-200"
      @click="showMobileMenu = false"></div>
    <div :class="{ 'translate-x-0': showMobileMenu, '-translate-x-full': !showMobileMenu }"
      class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out sm:hidden overflow-y-auto">
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <router-link to="/" class="text-lg font-bold text-gray-800" @click="showMobileMenu = false">
          線上題庫測驗系統
        </router-link>
        <button @click="showMobileMenu = false"
          class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-2 py-3 space-y-1">
        <router-link to="/" class="flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition-colors"
          :class="[
            $route.path === '/'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
          ]" @click="showMobileMenu = false">
          <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          題庫
        </router-link>

        <router-link v-if="authStore.isLoggedIn" to="/history"
          class="flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition-colors" :class="[
            $route.path === '/history'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
          ]" @click="showMobileMenu = false">
          <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          歷史記錄
        </router-link>

        <template v-if="isAdmin">
          <router-link to="/question-converter"
            class="flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition-colors" :class="[
              $route.path === '/question-converter'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]" @click="showMobileMenu = false">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            題目轉換
          </router-link>
          <router-link to="/question-list"
            class="flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition-colors" :class="[
              $route.path === '/question-list'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]" @click="showMobileMenu = false">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            題目列表
          </router-link>
          <router-link to="/admin"
            class="flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition-colors" :class="[
              $route.path === '/admin'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]" @click="showMobileMenu = false">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            後台管理
          </router-link>
        </template>
      </div>

      <!-- 手機版用戶選單 -->
      <div class="border-t border-gray-200 bg-gray-50 mt-auto">
        <template v-if="authStore.isLoggedIn">
          <div class="flex items-center px-4 py-4">
            <div class="flex-shrink-0">
              <div
                class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                {{ authStore.user?.username?.[0]?.toUpperCase() }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ authStore.user?.username }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ authStore.user?.email }}
              </div>
            </div>
          </div>
          <div class="px-2 py-3 space-y-1">
            <button @click="handleLogout"
              class="flex items-center w-full px-3 py-2.5 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              登出
            </button>
          </div>
        </template>

        <template v-else>
          <div class="px-2 py-3 space-y-2">
            <router-link to="/login"
              class="flex items-center px-3 py-2.5 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              @click="showMobileMenu = false">
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              登入
            </router-link>
            <router-link to="/register"
              class="flex items-center px-3 py-2.5 text-base font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-xl transition-colors"
              @click="showMobileMenu = false">
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              註冊
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)

const isAdmin = computed(() => authStore.user?.role === 'admin')

async function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/login')
}
</script>
