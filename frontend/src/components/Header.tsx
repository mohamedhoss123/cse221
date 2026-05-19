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
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white/80 backdrop-blur-md px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="flex items-center gap-3 group no-underline"
          >
            <div className="w-8 h-8 bg-black flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
               <div className="w-3 h-3 bg-[#ce0031]" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-black">
              LUXE<span className="text-[#ce0031]">STAY</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { to: '/', label: 'HOME' },
              { to: '/customer/rooms', label: 'INVENTORY' },
              { to: '/customer/bookings', label: 'MANIFEST' },
              { to: '/admin/dashboard', label: 'COMMAND_CENTER' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-black hover:translate-y-[-1px] transition-all"
                activeProps={{ className: 'text-black border-b-2 border-[#ce0031]' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-2 border-2 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none">
                  <div className="w-6 h-6 bg-black flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none border-4 border-black p-0 bg-white shadow-[8px_8px_0_0_#000]">
                <DropdownMenuLabel className="p-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-none">
                  OPERATOR_IDENTITY
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/10" />
                <div className="p-2 space-y-1">
                  <CustomerNav />
                  <DropdownMenuSeparator className="bg-black/10" />
                  <AdminNav />
                </div>
                <DropdownMenuSeparator className="bg-black/10" />
                <DropdownMenuItem onClick={logout} className="p-4 cursor-pointer text-[10px] font-black uppercase tracking-widest hover:bg-[#ce0031] hover:text-white rounded-none transition-colors">
                  <LogOut className="mr-3 h-4 w-4" />
                  DEAUTHORIZE_SESSION
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-4">
              <Link 
                to="/auth/login" 
                className="text-[10px] font-black uppercase tracking-widest text-black/60 hover:text-black px-4 py-2"
              >
                LOG_IN
              </Link>
              <Link 
                to="/auth/register"
                className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
