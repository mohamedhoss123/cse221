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
          <p className="text-xs font-medium text-slate-700 mb-3">Quick Login - Click to auto-fill</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@hotel.com')
                setPassword('admin123')
              }}
              className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-slate-200 hover:border-[var(--expressive-primary)] hover:shadow-md transition-all duration-200 group"
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-[var(--expressive-primary)] transition-colors">Admin Account</div>
                  <div className="text-xs text-slate-500">admin@hotel.com / admin123</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-[var(--expressive-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('visitor@hotel.com')
                setPassword('visitor123')
              }}
              className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-slate-200 hover:border-[var(--expressive-primary)] hover:shadow-md transition-all duration-200 group"
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-[var(--expressive-primary)] transition-colors">Visitor Account</div>
                  <div className="text-xs text-slate-500">visitor@hotel.com / visitor123</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-[var(--expressive-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
