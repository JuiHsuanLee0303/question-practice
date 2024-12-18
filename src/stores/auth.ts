import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

interface User {
  uid: string
  email: string
  username: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        console.log('Attempting login...')
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        })

        console.log('Login response received successfully')
        const { access_token, user } = response.data

        if (!access_token || !user || !user.username) {
          console.error('Invalid login response:', response.data)
          throw new Error('Invalid login response')
        }

        this.token = access_token
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem('token', access_token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

        return true
      } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message)
        throw error
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users`, {
          username,
          email,
          password,
        })

        // 註冊成功後自動登入
        await this.login(email, password)
        return response.data
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found in localStorage')
        this.logout()
        return false
      }

      try {
        // 設置 token
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // 獲取用戶信息
        console.log('Fetching user info...')
        const response = await axios.get(`${API_BASE_URL}/auth/verify`)
        console.log('User info received successfully')

        const userData = response.data.user
        const isVerified = response.data.verified
        if (!userData || typeof userData !== 'object') {
          console.error('Invalid user data format:', userData)
          this.logout()
          return false
        }

        this.user = userData
        this.isAuthenticated = true
        return true
      } catch (error: any) {
        console.error('Auth check failed:', error.response?.data || error.message)
        this.logout()
        return false
      }
    },
  },
})
