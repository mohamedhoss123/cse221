import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, isAdmin, isVisitor } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({ 
        email, 
        password, 
        name, 
        phone: phone || undefined,
        address: address || undefined,
        gender: gender || undefined,
        birthdate: birthdate || undefined
      })
      
      // Redirect based on user role from the register response
      if (result && result.user && result.user.role === 'admin') {
        navigate({ to: '/admin', replace: true })
      } else if (result && result.user && result.user.role === 'visitor') {
        navigate({ to: '/customer', replace: true })
      } else {
        navigate({ to: '/customer', replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register')
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
            <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>

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
            <Label htmlFor="phone" className="text-slate-700 font-medium">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700 font-medium">Address (Optional)</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-slate-700 font-medium">Gender (Optional)</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={isLoading}
              className="h-12 w-full border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white px-3 py-2 rounded-md"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthdate" className="text-slate-700 font-medium">Birthdate (Optional)</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 border-slate-300 focus:border-[var(--expressive-primary)] focus:ring-[var(--expressive-primary)]/20 bg-white"
            />
            <p className="text-xs text-slate-500">Must be at least 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="•••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        {/* Terms notice */}
        <p className="text-xs text-slate-500 text-center">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-[var(--expressive-primary)] hover:text-[var(--expressive-primary)] font-medium">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[var(--expressive-primary)] hover:text-[var(--expressive-primary)] font-medium">Privacy Policy</a>
        </p>
      </form>
    </div>
  )
}
