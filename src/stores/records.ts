import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

interface Record {
  id: string
  questionId: string
  answer: string
  timeSpent: number
  createdAt: string
  isCorrect: boolean
}

interface Statistics {
  totalAnswered: number
  correctCount: number
  accuracy: number
  averageTime: number
  byCategory: {
    [key: string]: {
      answered: number
      correct: number
      accuracy: number
    }
  }
}

const defaultStatistics: Statistics = {
  totalAnswered: 0,
  correctCount: 0,
  accuracy: 0,
  averageTime: 0,
  byCategory: {},
}

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [] as Record[],
    statistics: defaultStatistics as Statistics,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserRecords(userId: string) {
      this.loading = true
      this.error = null
      try {
        console.log(`GET /records/user/${userId}`)
        const response = await axios.get(`${API_BASE_URL}/records/user/${userId}`)
        this.records = response.data || []
        console.log(this.records)
      } catch (error) {
        console.error('Failed to fetch records:', error)
        this.error = 'Failed to fetch records'
        this.records = []
      } finally {
        this.loading = false
      }
    },

    async fetchUserStatistics(userId: string) {
      this.loading = true
      this.error = null
      try {
        console.log(`GET /records/stats/${userId}`)
        const response = await axios.get(`${API_BASE_URL}/records/stats/${userId}`)
        this.statistics = response.data || defaultStatistics
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        this.error = 'Failed to fetch statistics'
        this.statistics = defaultStatistics
      } finally {
        this.loading = false
      }
    },

    async createRecord(record: { questionId: string; answer: string; timeSpent: number }) {
      try {
        const response = await axios.post(`${API_BASE_URL}/records`, record)
        return response.data
      } catch (error) {
        console.error('Failed to create record:', error)
        throw error
      }
    },
  },
})
