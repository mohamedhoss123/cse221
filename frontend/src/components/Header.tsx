import { Link } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import CustomerNav from './layout/CustomerNav'
import AdminNav from './layout/AdminNav'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { User, LogOut, Menu } from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            LuxeStay Hotel
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'customer' && <CustomerNav />}
                {user.role === 'admin' && <AdminNav />}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          {isAuthenticated && user?.role === 'customer' && (
            <Link
              to="/customer/rooms"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Rooms
            </Link>
          )}
          {isAuthenticated && user?.role === 'customer' && (
            <Link
              to="/customer/bookings"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              My Bookings
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
