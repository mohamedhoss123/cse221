import { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  // if (!isAuthenticated) {
  //   navigate({ to: '/auth/login', search: { redirect: location.pathname } })
  //   return null
  // }

  if (requireAdmin && !isAdmin) {
    navigate({ to: '/' })
    return null
  }

  return <>{children}</>
}
