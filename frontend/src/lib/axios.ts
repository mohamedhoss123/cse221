import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
