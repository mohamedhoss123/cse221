import { Link, useNavigate } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { useAuth } from '#/stores/auth.store'
import { Button } from '#/components/ui/button'
import {
  LayoutDashboard,
  Bed,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
} from 'lucide-react'

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Control Center' },
    { to: '/admin/rooms', icon: Bed, label: 'Asset Management' },
    { to: '/admin/bookings', icon: Calendar, label: 'Reservations' },
    { to: '/admin/invoices', icon: FileText, label: 'Financial Logs' },
    { to: '/admin/complaints', icon: MessageSquare, label: 'Issue Tracking' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Intelligence' },
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
        <Link to="/admin/dashboard" className="inline-block group">
          <h2 className="text-3xl font-black tracking-tighter text-[var(--expressive-secondary)] uppercase italic leading-none">
            Grand<span className="text-[var(--expressive-primary)] block not-italic">Admin</span>
          </h2>
          <div className="h-1.5 w-12 bg-[var(--expressive-primary)] mt-2 group-hover:w-24 transition-all duration-500 rounded-full" />
        </Link>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-4 pl-2">System Operations</p>
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
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--expressive-secondary)] rounded-full animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[var(--expressive-secondary)] truncate uppercase tracking-tighter">
              {user?.email?.split('@')[0] || 'Administrator'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1 w-1 rounded-full bg-[var(--expressive-primary)]" />
              <p className="text-[9px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">Root Access</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 justify-center border-2 border-[var(--expressive-secondary)] bg-white text-[var(--expressive-secondary)] hover:bg-red-500 hover:text-white hover:border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Terminate Session
        </Button>
      </div>
    </aside>
  )
}
