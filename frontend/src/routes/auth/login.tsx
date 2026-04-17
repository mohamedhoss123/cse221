import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '#/components/auth/LoginForm'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
            linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
            linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
            linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37)`,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-light tracking-tight text-white mb-4">
                Luxury
                <span className="block font-semibold text-[var(--expressive-accent)]">Stays</span>
              </h1>
              <p className="text-xl text-slate-300 font-light leading-relaxed">
                Experience unparalleled comfort and exceptional service at our curated collection of premium properties.
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-200">Exclusive luxury properties worldwide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-200">Personalized concierge service</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-200">Seamless booking experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f27b89] to-transparent" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[var(--expressive-background)] to-white">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-light text-slate-900">
              Luxury
              <span className="block font-semibold text-[var(--expressive-primary)]">Stays</span>
            </h1>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-3xl font-light text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-[var(--expressive-primary)] hover:text-[var(--expressive-primary)] font-medium inline-flex items-center gap-1">
                Create one
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
