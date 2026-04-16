export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR'
  data: T
}

export interface ApiError {
  message: string
  code?: string
}
