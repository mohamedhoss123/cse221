import { Link, useNavigate } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { useAuth } from '#/stores/auth.store'
import { Button } from '#/components/ui/button'
import {
  Bed,
  Calendar,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react'

interface CustomerSidebarProps {
  className?: string
}

export default function CustomerSidebar({ className }: CustomerSidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/customer/rooms', icon: Bed, label: 'Available Suites' },
    { to: '/customer/bookings', icon: Calendar, label: 'My Reservations' },
    { to: '/customer/payments', icon: CreditCard, label: 'Billing Center' },
    { to: '/customer/complaints', icon: MessageSquare, label: 'Guest Support' },
  ]

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/login' })
  }

  return (
    <aside
      className={cn(
        'w-72 border-r-4 border-[var(--expressive-secondary)] bg-[var(--expressive-background)] p-8 flex flex-col relative z-20',
        className
      )}
    >
      <div className="mb-12">
        <Link to="/customer/rooms" className="inline-block group">
          <h2 className="text-3xl font-black tracking-tighter text-[var(--expressive-secondary)] uppercase italic leading-none">
            Grand<span className="text-[var(--expressive-primary)] block not-italic">Guest</span>
          </h2>
          <div className="h-1.5 w-12 bg-[var(--expressive-primary)] mt-2 group-hover:w-24 transition-all duration-500 rounded-full" />
        </Link>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-4 pl-2">Member Services</p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-black text-[var(--expressive-text-muted)] transition-all hover:bg-[var(--expressive-surface)] hover:text-[var(--expressive-primary)] border-2 border-transparent group"
              activeProps={{
                className:
                  'bg-[var(--expressive-primary)] text-white border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:bg-[var(--expressive-primary)] hover:text-white hover:translate-x-0',
              }}
            >
              <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8 border-t-4 border-[var(--expressive-secondary)] space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[var(--expressive-primary)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center">
              <span className="font-black text-white text-xl">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[var(--expressive-secondary)] truncate uppercase tracking-tighter">
              {user?.name || user?.email?.split('@')[0] || 'Valued Guest'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1 w-1 rounded-full bg-[var(--expressive-primary)]" />
              <p className="text-[9px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 justify-center border-2 border-[var(--expressive-secondary)] bg-white text-[var(--expressive-secondary)] hover:bg-red-500 hover:text-white hover:border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
