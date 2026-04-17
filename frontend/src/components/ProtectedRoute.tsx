import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { useAuthError } from '#/hooks/useAuthError'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  requireVisitor?: boolean
  fallback?: ReactNode
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireVisitor = false,
  fallback = null,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isAdmin, isVisitor } = useAuth()
  const { isRedirecting } = useAuthError()

  // If redirecting due to 401 error, don't render children
  if (isRedirecting) {
    return <Navigate to="/auth/login" replace />
  }

  // Check role requirements only if authenticated
  if (isAuthenticated) {
    // Check admin requirement
    if (requireAdmin && !isAdmin) {
      return fallback || <Navigate to="/" replace />
    }

    // Check visitor requirement
    if (requireVisitor && !isVisitor) {
      return fallback || <Navigate to="/" replace />
    }

    // User is authenticated and has the required role
    return <>{children}</>
  }

  // Not authenticated but allow access - will be handled by API calls
  // API calls will return 401 if token is invalid, triggering redirect
  return <>{children}</>
}
