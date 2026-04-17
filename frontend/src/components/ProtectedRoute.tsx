import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  requireVisitor?: boolean
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireVisitor = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isAdmin, isVisitor } = useAuth()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/auth/login" replace />
  }

  // Check visitor requirement
  if (requireVisitor && !isVisitor) {
    return <Navigate to="/auth/login" replace />
  }

  // User is authenticated and has the required role
  return <>{children}</>
}
