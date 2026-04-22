import type { User, LoginCredentials, RegisterData } from '../types/auth.types'
import BaseService from './base.service'

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
  const response = await BaseService.post<BackendUserData>('/users/login', credentials)

  const userData = 'user' in response ? response.user : response
  const normalizedUser = normalizeUser(userData)
  const token = response.token || (userData as any).token

  return {
    user: normalizedUser,
    token: token || '',
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await BaseService.post<BackendUserData>('/users/register', data)

  const userData = 'user' in response ? response.user : response
  const normalizedUser = normalizeUser(userData)
  const token = response.token || (userData as any).token

  return {
    user: normalizedUser,
    token: token || '',
  }
}

export async function logout(): Promise<void> {
  // Logout is a fire-and-forget operation, don't throw errors
  try {
    await BaseService.post<void>('/users/logout')
  } catch (error) {
    // Silent fail - logout will clear client state regardless
  }
}

export async function getProfile(): Promise<User> {
  const response = await BaseService.get<any>('/users/profile')

  const normalizedUser: User = {
    id: response.id.toString(),
    email: response.email,
    name: response.name,
    role: normalizeRole(response.role),
  }

  return normalizedUser
}
