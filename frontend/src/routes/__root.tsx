import { Outlet, createRootRoute, Link, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AuthProvider } from '#/stores/auth.store'
import { Toaster } from '#/components/ui/sonner'
import Header from '#/components/Header'
import Footer from '#/components/Footer'
import { useAuthError } from '#/hooks/useAuthError'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const { isRedirecting } = useAuthError()

  if (isRedirecting) {
    return null
  }

  const isAuthRoute = location.pathname.startsWith('/auth')
  const isLandingPage = location.pathname === '/'

  const showLayout = !isAuthRoute && !isLandingPage

  return (
    <AuthProvider>
      {showLayout ? (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      ) : (
        <Outlet />
      )}
      <Toaster position="top-right" />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </AuthProvider>
  )
}
