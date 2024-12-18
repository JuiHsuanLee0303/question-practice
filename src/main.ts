import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

import App from './App.vue'
import router from './router'

// 設置 axios 默認值
axios.defaults.baseURL = API_BASE_URL

console.log(API_BASE_URL)

// 請求攔截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 響應攔截器
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token 過期或無效
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
