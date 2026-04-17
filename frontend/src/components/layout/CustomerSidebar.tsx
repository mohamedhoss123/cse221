import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import {
  Bed,
  Calendar,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '#/hooks/useAuth'

interface CustomerSidebarProps {
  className?: string
}

export default function CustomerSidebar({ className }: CustomerSidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    { to: '/customer/rooms', icon: Bed, label: 'Browse Rooms' },
    { to: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/customer/payments', icon: CreditCard, label: 'Payments' },
    { to: '/customer/complaints', icon: MessageSquare, label: 'Support' },
    { to: '/customer/profile', icon: User, label: 'Profile' },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <aside
      className={cn(
        'w-72 border-r border-slate-200 bg-white flex flex-col',
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)]" />
          <span className="text-xl font-light text-[var(--expressive-primary)]">
            Luxury
            <span className="font-semibold text-[var(--expressive-primary)]">Stays</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-[var(--expressive-background)] to-white rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--expressive-primary)] truncate">
              {user?.name || 'Guest'}
            </p>
            <p className="text-xs text-[#000] truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-[#000] uppercase tracking-wider mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#000] transition-all duration-200 hover:bg-gradient-to-r hover:from-[var(--expressive-accent)]/10 hover:to-transparent hover:text-[var(--expressive-primary)]"
              activeProps={{
                className: 'bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] text-white shadow-md',
              }}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-[#000] transition-all duration-200 hover:bg-red-50 hover:text-[var(--expressive-primary)]"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
