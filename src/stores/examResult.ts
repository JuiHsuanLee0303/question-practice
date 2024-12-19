import { defineStore } from 'pinia'

interface ExamResult {
  questions: Array<{
    id: number
    content: string
    options: Array<{
      key: string
      value: string
    }>
    answers: string[]
  }>
  summary: {
    accuracy: number
    correctCount: number
    timeSpent: number
    totalQuestions: number
  }
  userAnswers: Array<{
    questionId: number
    answers: string[]
  }>
  timeSpent: number
}

export const useExamResultStore = defineStore('examResult', {
  state: () => ({
    result: null as ExamResult | null
  }),
  
  actions: {
    setResult(result: ExamResult) {
      this.result = result
    },
    
    clearResult() {
      this.result = null
    }
  }
}) 