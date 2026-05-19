import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import ProtectedRoute from '#/components/ProtectedRoute'
import { getBookings } from '#/services/bookings.service'
import { getComplaints } from '#/services/complaints.service'
import DashboardStats from '#/components/admin/DashboardStats'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

import {
  Activity,
  Zap,
  LayoutDashboard,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react'

function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bookingsData, complaintsData] = await Promise.all([
        getBookings(),
        getComplaints()
      ])
      setBookings(bookingsData)
      setComplaints(complaintsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-[var(--expressive-primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)] italic">Booting Command Center...</p>
        </div>
      </ProtectedRoute>
    )
  }

  // Calculate metrics
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  ).length

  const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0)
  const openComplaints = complaints.filter((c) => c.status === 'open').length
  const occupancyRate = 75 // Mock percentage

  return (
    <ProtectedRoute requireAdmin>
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Expressive Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-secondary)] text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-[2px_2px_0_0_#ce0031]">
              <LayoutDashboard className="h-3 w-3" />
              Strategic Command
            </div>
            <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
              Grand <span className="text-[var(--expressive-primary)]">Overview</span>
            </h1>
            <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
              Authorized personnel only. Live telemetry and operational metrics.
            </p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border-2 border-[var(--expressive-secondary)] rounded-2xl shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <div className="h-10 w-10 rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">System Pulse</p>
              <p className="text-sm font-black text-green-600 uppercase">Operational</p>
            </div>
          </div>
        </div>

        {/* High-Impact Stats Grid */}
        {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStats
            title="Gross Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="FY2026 CYCLE"
          />
          <DashboardStats
            title="Live Capacity"
            value={`${occupancyRate}%`}
            icon={TrendingUp}
            description="REAL-TIME"
          />
          <DashboardStats
            title="Active Manifest"
            value={activeBookings}
            icon={Calendar}
            description="PENDING/CONFIRMED"
          />
          <DashboardStats
            title="Guest Volume"
            value={totalGuests}
            icon={Users}
            description="TOTAL THROUGHPUT"
          />
        </div> */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Manifest Activity */}
          <Card className="lg:col-span-2 bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Recent Manifests</CardTitle>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Live Reservation Stream</p>
              </div>
              <Button asChild variant="outline" className="h-9 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-1 transition-all text-[10px] font-black uppercase">
                <Link to="/admin/bookings">Full Manifest</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-2 divide-[var(--expressive-secondary)]/5">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-6 hover:bg-[var(--expressive-background)]/50 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-[var(--expressive-primary)]/10 border-2 border-[var(--expressive-primary)]/20 flex items-center justify-center text-[var(--expressive-primary)] shadow-sm group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-black text-[var(--expressive-text)] text-lg tracking-tight">
                          {booking.customerName || `RES-ALPHA-${booking.id.substring(0, 4)}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">
                            {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[var(--expressive-secondary)]/20" />
                          <span className="text-[10px] font-black text-[var(--expressive-primary)] uppercase tracking-widest">
                            {booking.roomNumber ? `ROOM ${booking.roomNumber}` : 'UNASSIGNED'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[var(--expressive-text)] text-xl tracking-tighter">
                        ${booking.totalAmount}
                      </p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 mt-1 ${booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]'
                        : 'bg-amber-50 text-amber-600 border-amber-200 shadow-[2px_2px_0_0_#fef3c7]'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tactical Sidebar */}
          <div className="space-y-8">
            {/* Critical Alerts */}
            <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_#ce0031] rounded-2xl overflow-hidden">
              <CardHeader className="bg-red-600 border-b-2 border-[var(--expressive-secondary)] p-6">
                <CardTitle className="text-xl font-black text-white flex items-center gap-2 tracking-tighter uppercase">
                  <ShieldAlert className="h-6 w-6" />
                  Critical Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {openComplaints > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-3xl font-black text-red-600 tracking-tighter leading-none">{openComplaints}</p>
                      <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mt-1">Active Incidents</p>
                    </div>
                    <p className="text-sm font-bold text-[var(--expressive-text-muted)] leading-relaxed">
                      High-priority guest issues identified in the terminal. Immediate resolution required to maintain service standards.
                    </p>
                    <Button asChild className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 transition-all">
                      <Link to="/admin/complaints" className="flex items-center justify-center gap-2">
                        Deploy Resolution <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="h-16 w-16 mx-auto rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600 mb-4">
                      <Zap className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-black text-green-600 uppercase tracking-tighter">Zero Faults</p>
                    <p className="text-xs font-bold text-[var(--expressive-text-muted)] mt-1">All systems reporting optimal guest satisfaction.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Command Terminal */}
            <Card className="bg-[var(--expressive-secondary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_#ce0031] rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-[var(--expressive-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase leading-none">Command Hub</h3>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-1">Quick Deployment</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Button asChild variant="secondary" className="h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase tracking-widest text-[10px] justify-between">
                    <Link to="/admin/rooms/new">
                      Initialize Room <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase tracking-widest text-[10px] justify-between">
                    <Link to="/admin/analytics">
                      Data Synthesis <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase tracking-widest text-[10px] justify-between">
                    <Link to="/admin/payments">
                      Ledger Review <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
