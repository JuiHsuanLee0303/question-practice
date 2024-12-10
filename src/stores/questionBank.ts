import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Chapter, Question, QuizQuestion, QuizResult, QuizSettings } from '@/types/question'

export const useQuestionBankStore = defineStore('questionBank', () => {
  const chapters = ref<Chapter[]>([])
  const currentQuiz = ref<QuizQuestion[]>([])
  const quizResult = ref<QuizResult | null>(null)
  const lastQuizSettings = ref<QuizSettings | null>(null)

  async function parseQuestionText(text: string): Promise<Chapter[]> {
    const lines = text.split('\n').filter((line) => line.trim())
    const parsedChapters: Chapter[] = []
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
            parsedChapters.push(currentChapter)
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

        console.log(currentQuestion?.questionNumber)

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
        parsedChapters.push(currentChapter)
      }

      return parsedChapters
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
      chapters.value = [...parsedChapters]
    } catch (error) {
      throw error
    }
  }

  async function startQuiz(settings: QuizSettings) {
    try {
      lastQuizSettings.value = settings
      const availableQuestions = chapters.value
        .filter((chapter) => settings.selectedChapters.includes(chapter.id))
        .flatMap((chapter) => chapter.questions)

      if (availableQuestions.length === 0) {
        throw new Error('所選章節中沒有題目')
      }

      // 使用更强的随机性
      const getRandomIndex = () =>
        Math.floor(
          (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
            availableQuestions.length,
        )

      // 使用新的选题逻辑
      const selectedQuestions: QuizQuestion[] = []
      const usedIndices = new Set<number>()

      while (
        selectedQuestions.length < settings.numberOfQuestions &&
        usedIndices.size < availableQuestions.length
      ) {
        const index = getRandomIndex()
        if (!usedIndices.has(index)) {
          usedIndices.add(index)
          selectedQuestions.push({
            ...availableQuestions[index],
            userAnswers: [],
          })
        }
      }

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
        // 確保 userAnswers 存在且是陣列
        const userAnswers = q.userAnswers || []
        const correctAnswers = q.answers

        // 如果是多選題
        if (q.isMultipleChoice) {
          // 1. 檢查答案數量是否相同
          if (userAnswers.length !== correctAnswers.length) {
            return false
          }
          // 2. 檢查每個答案是否都正確（順序無關）
          const userAnswerSet = new Set(userAnswers)
          const correctAnswerSet = new Set(correctAnswers)
          return (
            // 確保使用者答案和正確答案的數量相同
            userAnswerSet.size === correctAnswerSet.size &&
            // 確保每個使用者答案都在正確答案中
            [...userAnswerSet].every((answer) => correctAnswerSet.has(answer)) &&
            // 確保每個正確答案都在使用者答案中
            [...correctAnswerSet].every((answer) => userAnswerSet.has(answer))
          )
        }
        // 如果是單選題
        else {
          // 單選題只需要比較第一個答案
          return userAnswers.length === 1 && userAnswers[0] === correctAnswers[0]
        }
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

  async function regenerateQuiz() {
    if (!lastQuizSettings.value) {
      throw new Error('無法重新開始測驗：沒有上次的設置')
    }
    await startQuiz(lastQuizSettings.value)
    quizResult.value = null
  }

  return {
    chapters,
    currentQuiz,
    quizResult,
    lastQuizSettings,
    importQuestions,
    startQuiz,
    submitAnswer,
    calculateResult,
    regenerateQuiz,
  }
})
