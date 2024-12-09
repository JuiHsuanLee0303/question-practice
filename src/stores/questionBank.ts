import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Chapter, Question, QuizQuestion, QuizResult, QuizSettings } from '@/types/question'

export const useQuestionBankStore = defineStore('questionBank', () => {
  const chapters = ref<Chapter[]>([])
  const currentQuiz = ref<QuizQuestion[]>([])
  const quizResult = ref<QuizResult | null>(null)

  async function parseQuestionText(text: string): Promise<Chapter[]> {
    const lines = text.split('\n').filter((line) => line.trim())
    const chapters: Chapter[] = []
    let currentChapter: Chapter | null = null
    let currentQuestion: Question | null = null

    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // 解析章節
        if (line.startsWith('第') && line.includes('章')) {
          if (currentChapter && currentQuestion) {
            currentChapter.questions.push(currentQuestion)
            currentQuestion = null
          }
          if (currentChapter) {
            chapters.push(currentChapter)
          }
          currentChapter = {
            id: crypto.randomUUID(),
            name: line,
            questions: [],
          }
          continue
        }

        // 確保有章節
        if (!currentChapter) {
          continue
        }

        // 解析題目
        const questionMatch = line.match(/^(\d+-\d+)\.(.+)/)
        if (questionMatch) {
          if (currentQuestion) {
            currentChapter.questions.push(currentQuestion)
          }
          currentQuestion = {
            id: crypto.randomUUID(),
            chapter: currentChapter.name,
            questionNumber: questionMatch[1],
            content: questionMatch[2].trim(),
            options: [],
            answers: [],
            isMultipleChoice: false,
          }
          continue
        }

        // 確保有題目
        if (!currentQuestion) {
          continue
        }

        // 解析選項
        const optionMatch = line.match(/^\(([A-Z])\)(.+)/)
        if (optionMatch) {
          currentQuestion.options.push({
            key: optionMatch[1],
            value: optionMatch[2].trim(),
          })
          continue
        }

        // 解析答案
        if (line.startsWith('答案:')) {
          const answerText = line.substring(3).trim()
          const answers = answerText.split('').filter((char) => /[A-Z]/.test(char))
          if (answers.length === 0) {
            throw new Error('答案格式錯誤，請確保答案是大寫英文字母')
          }
          currentQuestion.answers = answers
          currentQuestion.isMultipleChoice = answers.length > 1
          currentChapter.questions.push(currentQuestion)
          currentQuestion = null
        }
      }

      // 處理最後一個題目和章節
      if (currentChapter) {
        if (currentQuestion) {
          currentChapter.questions.push(currentQuestion)
        }
        chapters.push(currentChapter)
      }

      return chapters
    } catch (error) {
      throw error
    }
  }

  async function importQuestions(text: string) {
    try {
      const parsedChapters = await parseQuestionText(text)
      if (parsedChapters.length === 0) {
        throw new Error('沒有找到有效的題目')
      }
      chapters.value = parsedChapters
    } catch (error) {
      throw error
    }
  }

  async function startQuiz(settings: QuizSettings) {
    try {
      const availableQuestions = chapters.value
        .filter((chapter) => settings.selectedChapters.includes(chapter.id))
        .flatMap((chapter) => chapter.questions)

      if (availableQuestions.length === 0) {
        throw new Error('所選章節中沒有題目')
      }

      const selectedQuestions = [...availableQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.numberOfQuestions)
        .map((q) => ({
          ...q,
          userAnswers: [] as string[],
        }))

      currentQuiz.value = selectedQuestions
      quizResult.value = null
    } catch (error) {
      throw error
    }
  }

  async function submitAnswer(questionId: string, answers: string[]) {
    try {
      const question = currentQuiz.value.find((q) => q.id === questionId)
      if (!question) {
        throw new Error('找不到指定的題目')
      }
      question.userAnswers = [...answers]
    } catch (error) {
      throw error
    }
  }

  async function calculateResult() {
    try {
      const totalQuestions = currentQuiz.value.length
      const correctAnswers = currentQuiz.value.filter((q) => {
        const userAnswerSet = new Set(q.userAnswers || [])
        const correctAnswerSet = new Set(q.answers)
        return (
          userAnswerSet.size === correctAnswerSet.size &&
          [...userAnswerSet].every((answer) => correctAnswerSet.has(answer))
        )
      }).length

      quizResult.value = {
        totalQuestions,
        correctAnswers,
        score: Math.round((correctAnswers / totalQuestions) * 100),
        questions: currentQuiz.value.map((q) => ({
          ...q,
          userAnswers: q.userAnswers || [],
        })),
      }

      return quizResult.value
    } catch (error) {
      throw error
    }
  }

  return {
    chapters,
    currentQuiz,
    quizResult,
    importQuestions,
    startQuiz,
    submitAnswer,
    calculateResult,
  }
})
