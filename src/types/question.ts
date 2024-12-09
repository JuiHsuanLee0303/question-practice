export interface Question {
  id: string
  chapter: string
  questionNumber: string
  content: string
  options: {
    key: string
    value: string
  }[]
  answers: string[]
  isMultipleChoice: boolean
}

export interface Chapter {
  id: string
  name: string
  questions: Question[]
}

export interface QuizSettings {
  numberOfQuestions: number
  selectedChapters: string[]
}

export interface QuizQuestion extends Question {
  userAnswers: string[]
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  score: number
  questions: QuizQuestion[]
}
