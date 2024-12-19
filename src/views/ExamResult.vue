<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h1 class="text-2xl font-bold text-gray-800">測驗結果</h1>
            <div class="mt-6 bg-gray-50 p-6 rounded-xl flex justify-between items-center">
                <div class="flex flex-col items-center">
                    <span class="text-gray-600 text-lg">得分</span>
                    <span class="text-4xl font-bold text-blue-500">{{ examResultStore.result.summary.accuracy * 100 }}/100</span>
                </div>
                <div class="flex gap-8">
                    <div class="flex flex-col items-center">
                        <span class="text-sm text-gray-600">正確題數</span>
                        <span class="text-lg font-medium text-green-600">{{ correctCount }}/{{ totalQuestions }}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-sm text-gray-600">用時</span>
                        <span class="text-lg font-medium">{{ formatTime(timeSpent) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-xl font-bold text-gray-800 mb-6">答題詳情</h2>
            <div class="space-y-6">
                <div v-for="(question, index) in questions" :key="question.id" 
                    class="border border-gray-200 rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-medium text-gray-700">第 {{ index + 1 }} 题</span>
                        <span :class="[
                            'px-3 py-1 rounded-full text-sm font-medium',
                            isCorrect(index) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        ]">
                            {{ isCorrect(index) ? '正确' : '错误' }}
                        </span>
                    </div>

                    <div>
                        <p class="text-gray-700 text-lg mb-4">{{ question.content }}</p>
                        <div class="space-y-3">
                            <div v-for="option in question.options" :key="option.key"
                                :class="[
                                    'flex items-center gap-3 p-3 rounded-lg',
                                    {
                                        'bg-blue-50': userAnswers.find(a => a.questionId === question.id)?.answers.includes(option.key),
                                        'bg-green-50': question.answers.includes(option.key),
                                        'bg-red-50': userAnswers.find(a => a.questionId === question.id)?.answers.includes(option.key) && !question.answers.includes(option.key),
                                        'bg-gray-50': !userAnswers.find(a => a.questionId === question.id)?.answers.includes(option.key) && !question.answers.includes(option.key)
                                    }
                                ]">
                                <span class="font-medium text-blue-600">{{ option.key }}</span>
                                <span class="text-gray-700">{{ option.value }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="question.explanation" class="mt-6 pt-6 border-t border-gray-200">
                        <h4 class="text-gray-600 font-medium mb-2">解析</h4>
                        <p class="text-gray-700">{{ question.explanation }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center gap-4 mt-8">
            <button @click="retryExam" 
                class="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                重新測驗
            </button>
            <button @click="backToHome"
                class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                返回首頁
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExamResultStore } from '../stores/examResult'

interface Option {
    key: string
    value: string
}

interface Question {
    id: number
    content: string
    options: Option[]
    answers: string[]
    explanation?: string
}

const router = useRouter()
const examResultStore = useExamResultStore()
const questions = ref<Question[]>([])
const userAnswers = ref<{ questionId: number; answers: string[] }[]>([])
const timeSpent = ref(0)

const totalQuestions = computed(() => questions.value.length)

const correctCount = computed(() => {
    return questions.value.reduce((count, question, index) => {
        return count + (isCorrect(index) ? 1 : 0)
    }, 0)
})

const score = computed(() => {
    return Math.round((correctCount.value / totalQuestions.value) * 100)
})

const fetchResult = () => {
    const result = examResultStore.result
    console.log(result)
    if (!result) {
        // 如果沒有結果，返回題庫選擇頁面
        router.push({ name: 'question-bank' })
        return
    }

    questions.value = result.questions
    userAnswers.value = result.userAnswers
    timeSpent.value = result.timeSpent
}

const isCorrect = (index: number) => {
    const question = questions.value[index]
    const userAnswer = userAnswers.value.find(a => a.questionId === question.id)?.answers || []

    if (!question || !userAnswer) return false

    return (
        question.answers.length === userAnswer.length &&
        question.answers.every(answer => userAnswer.includes(answer))
    )
}

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
        return `${hours}小时${minutes}分钟`
    }
    if (minutes > 0) {
        return `${minutes}分钟${remainingSeconds}秒`
    }
    return `${remainingSeconds}秒`
}

const retryExam = () => {
    router.push({ name: 'exam-settings' })
}

const backToHome = () => {
    router.push({ name: 'question-bank' })
}

onMounted(() => {
    fetchResult()
})
</script>
