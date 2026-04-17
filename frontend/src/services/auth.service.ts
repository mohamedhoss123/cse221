import type { User, LoginCredentials, RegisterData } from '../types/auth.types'

interface AuthResponse {
  user: User
  token: string
}

interface BackendResponse {
  success: boolean
  message?: string
  data?: {
    user: {
      id: number
      email: string
      name: string
      role: 'user' | 'admin'
      created_at: string
      updated_at: string
    }
    token: string
  }
}

const API_BASE = 'http://localhost:5000/api/users'

// Handle role mismatch: backend uses 'user', frontend expects 'visitor'
function normalizeRole(role: 'user' | 'admin'): 'visitor' | 'admin' {
  return role === 'admin' ? 'admin' : 'visitor'
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const result: BackendResponse = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Login failed')
  }

  if (!result.data) {
    throw new Error('Invalid response from server')
  }

  const normalizedUser: User = {
    id: result.data.user.id.toString(),
    email: result.data.user.email,
    name: result.data.user.name,
    role: normalizeRole(result.data.user.role),
  }

  return {
    user: normalizedUser,
    token: result.data.token,
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result: BackendResponse = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Registration failed')
  }

  if (!result.data) {
    throw new Error('Invalid response from server')
  }

  const normalizedUser: User = {
    id: result.data.user.id.toString(),
    email: result.data.user.email,
    name: result.data.user.name,
    role: normalizeRole(result.data.user.role),
  }

  return {
    user: normalizedUser,
    token: result.data.token,
  }
}

export async function logout(): Promise<void> {
  // In a real app, this would invalidate the token on the server
  // For now, we just clear it from the frontend
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to get current user')
  }

  const normalizedUser: User = {
    id: result.data.id.toString(),
    email: result.data.email,
    name: result.data.name,
    role: normalizeRole(result.data.role),
  }

  return normalizedUser
}
