<template>
    <div class="exam-result">
        <div class="result-header">
            <h1>测验结果</h1>
            <div class="score-card">
                <div class="score">
                    <span class="score-label">得分</span>
                    <span class="score-value">{{ score }}/100</span>
                </div>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">正确题数</span>
                        <span class="stat-value correct">{{ correctCount }}/{{ totalQuestions }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">用时</span>
                        <span class="stat-value">{{ formatTime(timeSpent) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="result-details">
            <h2>答题详情</h2>
            <div class="questions-list">
                <div v-for="(question, index) in questions" :key="question.id" class="question-item">
                    <div class="question-header">
                        <span class="question-number">第 {{ index + 1 }} 题</span>
                        <span :class="['question-status', { 'correct': isCorrect(index), 'wrong': !isCorrect(index) }]">
                            {{ isCorrect(index) ? '正确' : '错误' }}
                        </span>
                    </div>

                    <div class="question-content">
                        <p class="question-text">{{ question.content }}</p>
                        <div class="options">
                            <div v-for="option in question.options" :key="option.key" :class="[
                                'option',
                                {
                                    'selected': userAnswers[index]?.includes(option.key),
                                    'correct': question.answers.includes(option.key),
                                    'wrong': userAnswers[index]?.includes(option.key) && !question.answers.includes(option.key)
                                }
                            ]">
                                <span class="option-key">{{ option.key }}</span>
                                <span class="option-text">{{ option.value }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="answer-explanation" v-if="question.explanation">
                        <h4>解析</h4>
                        <p>{{ question.explanation }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="btn-retry" @click="retryExam">重新测验</button>
            <button class="btn-back" @click="backToHome">返回首页</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { config } from '../config'

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
const route = useRoute()
const questions = ref<Question[]>([])
const userAnswers = ref<string[][]>([])
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

const fetchResult = async () => {
    try {
        const { answers, timeSpent: time } = route.query
        userAnswers.value = JSON.parse(answers as string)
        timeSpent.value = parseInt(time as string)

        const response = await axios.get(`${config.apiBaseUrl}/exam-results/details`, {
            params: { answers: answers }
        })
        questions.value = response.data
    } catch (error) {
        console.error('获取测验结果失败:', error)
    }
}

const isCorrect = (index: number) => {
    const question = questions.value[index]
    const userAnswer = userAnswers.value[index] || []

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

<style scoped>
.exam-result {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.result-header {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.score-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.score {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.score-label {
    font-size: 1.2em;
    color: #666;
}

.score-value {
    font-size: 2.5em;
    font-weight: bold;
    color: #4a90e2;
}

.stats {
    display: flex;
    gap: 30px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 0.9em;
    color: #666;
}

.stat-value {
    font-size: 1.2em;
    font-weight: 500;
}

.stat-value.correct {
    color: #27ae60;
}

.result-details {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.questions-list {
    margin-top: 20px;
}

.question-item {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 20px;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.question-number {
    font-weight: 500;
}

.question-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9em;
}

.question-status.correct {
    background-color: #d4edda;
    color: #27ae60;
}

.question-status.wrong {
    background-color: #f8d7da;
    color: #dc3545;
}

.question-text {
    margin-bottom: 15px;
    font-size: 1.1em;
    line-height: 1.6;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 6px;
    background-color: #f8f9fa;
}

.option.selected {
    background-color: #e8f4ff;
}

.option.correct {
    background-color: #d4edda;
}

.option.wrong {
    background-color: #f8d7da;
}

.option-key {
    font-weight: 500;
    color: #4a90e2;
}

.answer-explanation {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.answer-explanation h4 {
    color: #666;
    margin-bottom: 10px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.btn-retry,
.btn-back {
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-retry {
    background-color: #4a90e2;
    color: white;
}

.btn-back {
    background-color: #f5f5f5;
    color: #333;
}

.btn-retry:hover {
    background-color: #357abd;
}

.btn-back:hover {
    background-color: #e5e5e5;
}
</style>
