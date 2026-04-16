import type { ApiResponse, ApiError } from '../types/api.types'

const API_BASE = '/api'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  // In a real app, this would make an actual HTTP request
  // For now, this is a placeholder that will be replaced by service functions

  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || 'An error occurred')
  }

  return response.json()
}

// Simulated delay for mock API calls
export const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms))
