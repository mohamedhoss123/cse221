import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAdmin, isVisitor } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login({ email, password })
      
      // Redirect based on user role from the login response
      if (result && result.user && result.user.role === 'admin') {
        navigate({ to: '/admin', replace: true })
      } else if (result && result.user && result.user.role === 'visitor') {
        navigate({ to: '/customer', replace: true })
      } else {
        navigate({ to: '/', replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <a href="#" className="text-sm text-[var(--expressive-primary)] hover:text-[var(--expressive-primary)] font-medium">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:from-[var(--expressive-primary)] hover:to-[var(--expressive-accent)] text-white font-medium shadow-lg shadow-[var(--expressive-accent)]/30 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        {/* Demo accounts info */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-2">Demo Accounts</p>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--expressive-primary)]">Admin:</span>
              <span>admin@hotel.com / admin123</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--expressive-primary)]">Visitor:</span>
              <span>visitor@hotel.com / visitor123</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
