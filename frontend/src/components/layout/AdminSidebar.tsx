import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import {
  LayoutDashboard,
  Bed,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
} from 'lucide-react'

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/rooms', icon: Bed, label: 'Rooms' },
    { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <aside
      className={cn(
        'w-64 border-r-2 border-[var(--expressive-secondary)] bg-[var(--expressive-surface)] p-6 shadow-[4px_0_0_0_var(--expressive-secondary)] flex flex-col',
        className
      )}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[var(--expressive-primary)]">
          Admin<span className="font-semibold block">Portal</span>
        </h2>
      </div>
      <nav className="space-y-3 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--expressive-text)] transition-all hover:bg-[var(--expressive-background)] hover:translate-x-1 border-2 border-transparent"
              activeProps={{
                className:
                  'bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:bg-[var(--expressive-primary)] hover:text-[var(--expressive-surface)] hover:translate-x-0',
              }}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t-2 border-[var(--expressive-secondary)]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[var(--expressive-accent)]/20 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] flex items-center justify-center">
            <span className="font-bold text-[var(--expressive-primary)]">AD</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--expressive-primary)]">Admin User</p>
            <p className="text-xs text-[var(--expressive-text)]">System Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
