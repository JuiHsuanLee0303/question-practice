const isDev = import.meta.env.MODE === 'development'

const BASE_URL = isDev ? 'http://localhost:3000' : 'https://question-practice-backend.vercel.app'

export const config = {
  apiBaseUrl: `${BASE_URL}`,
}

export const API_BASE_URL = BASE_URL
