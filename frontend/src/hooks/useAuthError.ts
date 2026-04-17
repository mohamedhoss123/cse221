import { useEffect, useState } from 'react'

export interface AuthError {
  status: number
  message: string
}

export function useAuthError() {
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const handleAuthError = (event: CustomEvent<AuthError>) => {
      console.log('Auth error detected:', event.detail)
      setAuthError(event.detail)
      setIsRedirecting(true)
    }

    window.addEventListener('auth-error', handleAuthError as EventListener)

    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener)
    }
  }, [])

  const clearAuthError = () => {
    setAuthError(null)
    setIsRedirecting(false)
  }

  return {
    authError,
    isRedirecting,
    clearAuthError,
  }
}

export function useAuthErrorHandler() {
  const triggerAuthError = (status: number = 401, message: string = 'Authentication required') => {
    const event = new CustomEvent('auth-error', { 
      detail: { 
        status,
        message 
      } 
    })
    window.dispatchEvent(event)
  }

  return {
    triggerAuthError,
  }
}