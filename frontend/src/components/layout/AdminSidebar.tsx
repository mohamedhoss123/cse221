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
        'w-64 border-r border-[var(--line)] bg-[var(--header-bg)] p-4',
        className
      )}
    >
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
              activeProps={{
                className:
                  'bg-[var(--link-bg-hover)] text-[var(--sea-ink)]',
              }}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
