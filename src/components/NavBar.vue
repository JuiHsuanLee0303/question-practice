<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800"> 線上題庫測驗系統 </router-link>
          </div>

          <!-- 導航連結 -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
              :class="[
                $route.path === '/'
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300',
              ]"
            >
              題庫
            </router-link>
            <router-link
              v-if="authStore.isLoggedIn"
              to="/question-converter"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
              :class="[
                $route.path === '/question-converter'
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300',
              ]"
            >
              題目轉換
            </router-link>
            <router-link
              v-if="authStore.isLoggedIn"
              to="/question-list"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
              :class="[
                $route.path === '/question-list'
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300',
              ]"
            >
              題目列表
            </router-link>
          </div>
        </div>

        <!-- 用戶選單 -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <template v-if="authStore.isLoggedIn">
            <router-link
              to="/history"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              歷史記錄
            </router-link>

            <!-- 用戶資訊 -->
            <div class="ml-3 relative">
              <div>
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                  >
                    {{ authStore.user?.username?.[0]?.toUpperCase() }}
                  </div>
                </button>
              </div>

              <!-- 下拉選單 -->
              <div
                v-if="showUserMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  {{ authStore.user?.username }}
                </div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  登出
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              登入
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              註冊
            </router-link>
          </template>
        </div>

        <!-- 手機版選單按鈕 -->
        <div class="flex items-center sm:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              :class="{ hidden: showMobileMenu, block: !showMobileMenu }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="h-6 w-6"
              :class="{ block: showMobileMenu, hidden: !showMobileMenu }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 手機版選單 -->
    <div :class="{ block: showMobileMenu, hidden: !showMobileMenu }" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'bg-gray-50': $route.path === '/' }"
        >
          題庫
        </router-link>
        <router-link
          v-if="authStore.isLoggedIn"
          to="/question-converter"
          class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'bg-gray-50': $route.path === '/question-converter' }"
        >
          題目轉換
        </router-link>
        <router-link
          v-if="authStore.isLoggedIn"
          to="/question-list"
          class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'bg-gray-50': $route.path === '/question-list' }"
        >
          題目列表
        </router-link>
      </div>

      <!-- 手機版用戶選單 -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <template v-if="authStore.isLoggedIn">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div
                class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
              >
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
          <div class="mt-3 space-y-1">
            <router-link
              to="/history"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              歷史記錄
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              登出
            </button>
          </div>
        </template>

        <template v-else>
          <div class="space-y-1">
            <router-link
              to="/login"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              登入
            </router-link>
            <router-link
              to="/register"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              註冊
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)

async function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/login')
}
</script>
