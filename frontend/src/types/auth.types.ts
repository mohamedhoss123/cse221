export interface User {
  id: string
  email: string
  name: string
  role: 'visitor' | 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  address?: string
  gender?: string
  birthdate?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
