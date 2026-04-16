import { Outlet, createFileRoute } from '@tanstack/react-router'
import CustomerSidebar from '#/components/layout/CustomerSidebar'
import ProtectedRoute from '#/components/ProtectedRoute'

export const Route = createFileRoute('/customer')({
  component: CustomerLayout,
})

function CustomerLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <CustomerSidebar className="fixed left-0 top-0 h-screen" />
        <main className="flex-1 ml-72">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}
