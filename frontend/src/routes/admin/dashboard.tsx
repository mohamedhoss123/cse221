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
        <div className="p-8">Loading...</div>
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
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
            Admin <span className="font-semibold text-[var(--expressive-primary)]">Dashboard</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] text-lg">
            Real-time overview of your hotel's performance and operations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStats
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="+12.5% from last month"
          />
          <DashboardStats
            title="Active Bookings"
            value={activeBookings}
            icon={Calendar}
            description={`${bookings.length} total bookings`}
          />
          <DashboardStats
            title="Total Guests"
            value={totalGuests}
            icon={Users}
            description="Across all bookings"
          />
          <DashboardStats
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            icon={TrendingUp}
            description="Current month"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-bold text-[var(--expressive-primary)] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--expressive-secondary)]/10">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-5 hover:bg-[var(--expressive-background)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)] font-bold">
                        {booking.customerName?.[0] || 'B'}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--expressive-text)]">
                          {booking.customerName || `Booking #${booking.id.substring(0, 5)}`}
                        </p>
                        <p className="text-sm text-[var(--expressive-text-muted)]">
                          {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--expressive-primary)] text-lg">
                        ${booking.totalAmount}
                      </p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--expressive-background)] border-t-2 border-[var(--expressive-secondary)] text-center">
                <Link to="/admin/bookings" className="text-sm font-bold text-[var(--expressive-primary)] hover:underline">
                  View All Bookings
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <div className="space-y-6">
            <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
                <CardTitle className="text-xl font-bold text-[var(--expressive-primary)] flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {openComplaints > 0 ? (
                  <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-red-700">
                        {openComplaints} Open Complaints
                      </p>
                      <p className="text-sm text-red-600 mb-3">
                        Urgent guest issues require your immediate attention.
                      </p>
                      <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white border-none shadow-sm">
                        <Link to="/admin/complaints">Resolve Now</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <p className="font-bold text-green-700">System Healthy</p>
                    <p className="text-sm text-green-600">
                      No critical alerts at this time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[var(--expressive-primary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                <p className="text-white/80 text-sm mb-6">Commonly used administrative tasks.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold">
                    <Link to="/admin/rooms/new">Add Room</Link>
                  </Button>
                  <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold">
                    <Link to="/admin/analytics">Reports</Link>
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
