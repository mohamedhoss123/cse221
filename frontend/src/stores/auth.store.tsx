import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { LoginCredentials, RegisterData, AuthState } from '../types/auth.types'
import * as authService from '../services/auth.service'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ user: User, token: string }>
  logout: () => void
  register: (data: RegisterData) => Promise<{ user: User, token: string }>
  isAdmin: boolean
  isVisitor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setState({
          token: storedToken,
          user,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    })
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('auth_user', JSON.stringify(response.user))
    
    return {
      user: response.user,
      token: response.token,
    }
  }

  const register = async (data: RegisterData) => {
    const response = await authService.register(data)
    setState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    })
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('auth_user', JSON.stringify(response.user))
    
    return {
      user: response.user,
      token: response.token,
    }
  }

  const logout = () => {
    authService.logout()
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    isAdmin: state.user?.role === 'admin',
    isVisitor: state.user?.role === 'visitor',
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
