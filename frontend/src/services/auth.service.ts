import type { User, LoginCredentials, RegisterData } from '../types/auth.types'
import { apiClient } from '../lib/api-client'

interface AuthResponse {
  user: User
  token: string
}

interface BackendUserData {
  user?: {
    id: number
    email: string
    name: string
    role: 'user' | 'admin'
    created_at: string
    updated_at: string
  }
  token?: string
}

function normalizeRole(role: 'user' | 'admin'): 'visitor' | 'admin' {
  return role === 'admin' ? 'admin' : 'visitor'
}

function normalizeUser(userData: any): User {
  const userRole = typeof userData.role === 'string' ? userData.role : userData.role?.role
  
  return {
    id: (userData.id || userData.user?.id || '').toString(),
    email: userData.email || userData.user?.email || '',
    name: userData.name || userData.user?.name || '',
    role: normalizeRole(userRole),
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendUserData>('/users/login', credentials)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed')
    }

    const userData = 'user' in response.data ? response.data.user : response.data
    const normalizedUser = normalizeUser(userData)
    const token = response.data.token || (userData as any).token

    return {
      user: normalizedUser,
      token: token,
    }
  } catch (error: any) {
    throw new Error(error.message || 'Login failed')
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendUserData>('/users/register', data)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed')
    }

    const userData = 'user' in response.data ? response.data.user : response.data
    const normalizedUser = normalizeUser(userData)
    const token = response.data.token || (userData as any).token

    return {
      user: normalizedUser,
      token: token,
    }
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed')
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/users/logout')
  } catch (error: any) {
    console.log('Logout error:', error.message)
  }
}

export async function getProfile(): Promise<User> {
  try {
    const response = await apiClient.get<any>('/users/profile')

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get profile')
    }

    const normalizedUser: User = {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.name,
      role: normalizeRole(response.data.role),
    }

    return normalizedUser
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get profile')
  }
}
