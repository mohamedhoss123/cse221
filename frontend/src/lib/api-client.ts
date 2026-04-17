import axios, { AxiosError } from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export class ApiClient {
  private instance: ReturnType<typeof axios.create>

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error))
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
    }

    if (error.response) {
      apiError.status = error.response.status
      apiError.message = (error.response.data as any)?.message || error.response.statusText
      apiError.details = (error.response.data as any)

      if (error.response.status === 401) {
        this.handleAuthError()
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.'
      apiError.code = 'NETWORK_ERROR'
    } else {
      apiError.message = error.message || 'Request failed'
    }

    return apiError
  }

  private handleAuthError() {
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { 
          status: 401,
          message: 'Session expired. Please login again.' 
        } 
      }))

      window.location.href = '/auth/login'
    }
  }

  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()

export default apiClient