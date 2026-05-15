import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import ProtectedRoute from '#/components/ProtectedRoute'
import { getBookings } from '#/services/bookings.service'
import { getComplaints } from '#/services/complaints.service'
import DashboardStats from '#/components/admin/DashboardStats'
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

      {/* Alerts */}
      <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
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

              {openComplaints === 0 && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-semibold text-green-700">
                    No Active Alerts
                  </p>
                  <p className="text-sm text-green-600">
                    Everything is running smoothly
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
                        : 'text-amber-600'
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
