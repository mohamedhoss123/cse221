import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '#/components/ProtectedRoute'
import { getBookingsSync, getComplaintsSync } from '#/services/bookings.service'
import DashboardStats from '#/components/admin/DashboardStats'
import RevenueChart from '#/components/admin/RevenueChart'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
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
  const bookings = getBookingsSync()
  const complaints = getComplaintsSync()

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

  // Mock revenue data for the chart
  const revenueData = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18500 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19800 },
    { month: 'May', revenue: 25600 },
    { month: 'Jun', revenue: 28900 },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--expressive-primary)]">
          Dashboard
        </h1>
        <p className="text-[#000]">
          Overview of hotel operations and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Total Revenue"
          value={`$${totalRevenue}`}
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
          description="All time"
        />
        <DashboardStats
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          description="This month"
        />
      </div>

      <div className="gap-6 lg:grid lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1">
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Alerts & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {openComplaints > 0 && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-semibold text-red-700">
                    {openComplaints} Open Complaints
                  </p>
                  <p className="text-sm text-red-600">
                    Requires attention
                  </p>
                </div>
              )}

              <div className="rounded-lg bg-[var(--expressive-background)] p-3">
                <p className="font-semibold text-[var(--expressive-primary)]">
                  Room Maintenance
                </p>
                <p className="text-sm text-[#000]">
                  2 rooms need cleaning
                </p>
              </div>

              <div className="rounded-lg bg-[var(--expressive-background)] p-3">
                <p className="font-semibold text-[var(--expressive-primary)]">
                  Today's Check-outs
                </p>
                <p className="text-sm text-[#000]">
                  5 rooms to prepare
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="island-shell mt-6">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg bg-[var(--expressive-background)] p-3"
              >
                <div>
                  <p className="font-medium text-[var(--expressive-primary)]">
                    {booking.id}
                  </p>
                  <p className="text-sm text-[#000]">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--expressive-primary)]">
                    ${booking.totalAmount}
                  </p>
                  <p
                    className={`text-sm ${
                      booking.status === 'confirmed'
                        ? 'text-[#000]'
                        : 'text-yellow-600'
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}
