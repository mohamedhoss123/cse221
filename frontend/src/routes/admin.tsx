import { Outlet, createFileRoute } from '@tanstack/react-router'
import AdminSidebar from '#/components/layout/AdminSidebar'
import ProtectedRoute from '#/components/ProtectedRoute'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen bg-[var(--expressive-background)]">
        <AdminSidebar className="fixed left-0 top-0 h-screen w-72 border-r-2 border-[var(--expressive-secondary)] bg-[var(--expressive-surface)] shadow-[4px_0_0_0_var(--expressive-secondary)] z-10" />
        <main className="flex-1 ml-72 min-h-screen bg-[var(--expressive-background)]">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}
