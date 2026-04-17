import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '#/components/auth/RegisterForm'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
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
                Join Our
                <span className="block font-semibold text-[var(--expressive-accent)]">Exclusive Circle</span>
              </h1>
              <p className="text-xl text-slate-300 font-light leading-relaxed">
                Create your account to unlock access to premium properties, exclusive offers, and personalized travel experiences.
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-slate-200">Member-only rates and discounts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-slate-200">Secure booking protection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--expressive-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-slate-200">Instant booking confirmation</span>
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
            <h2 className="text-3xl font-light text-slate-900 mb-2">Create your account</h2>
            <p className="text-slate-600">
              Already a member?{' '}
              <Link to="/auth/login" className="text-[var(--expressive-primary)] hover:text-[var(--expressive-primary)] font-medium inline-flex items-center gap-1">
                Sign in
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
