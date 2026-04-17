import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getBookings } from '#/services/bookings.service'
import { getRooms } from '#/services/rooms.service'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bookingsData, roomsData] = await Promise.all([
        getBookings(),
        getRooms()
      ])
      setBookings(bookingsData)
      setRooms(roomsData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  // Calculate metrics
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length
  const completionRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0

  const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0)
  const avgGuestsPerBooking = totalBookings > 0 ? totalGuests / totalBookings : 0

  // Room type distribution
  const roomTypeData = rooms.reduce((acc, room) => {
    acc[room.type] = (acc[room.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const roomTypeChartData = Object.entries(roomTypeData).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  const COLORS = ['#ce0031', '#f27b89', '#000', '#fef7f8']

  // Monthly revenue data (mock)
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 15000, bookings: 25 },
    { month: 'Feb', revenue: 18500, bookings: 30 },
    { month: 'Mar', revenue: 22000, bookings: 38 },
    { month: 'Apr', revenue: 19800, bookings: 32 },
    { month: 'May', revenue: 25600, bookings: 45 },
    { month: 'Jun', revenue: 28900, bookings: 52 },
  ]

  // Booking status distribution
  const bookingStatusData = [
    { name: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length },
    { name: 'Pending', value: bookings.filter((b) => b.status === 'pending').length },
    { name: 'Completed', value: bookings.filter((b) => b.status === 'completed').length },
    { name: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length },
  ]

  // Most booked rooms
  const roomBookings = bookings.reduce((acc, booking) => {
    acc[booking.roomId] = (acc[booking.roomId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRooms = Object.entries(roomBookings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([roomId, count]) => {
      const room = rooms.find((r) => r.id === roomId)
      return {
        name: room?.name || `Room ${roomId}`,
        bookings: count,
      }
    })

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--expressive-primary)]">
          Analytics & Reports
        </h1>
        <p className="text-[#000]">
          Hotel performance insights and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#000]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[var(--expressive-accent)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#000]">Total Bookings</p>
                <p className="text-2xl font-bold text-[var(--expressive-primary)]">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-[var(--expressive-accent)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#000]">Completion Rate</p>
                <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                  {completionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#000]" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#000]">Avg Guests/Booking</p>
                <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                  {avgGuestsPerBooking.toFixed(1)}
                </p>
              </div>
              <Users className="h-8 w-8 text-[var(--expressive-accent)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gap-6 lg:grid lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fef7f8',
                    border: '1px solid #f27b89',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ce0031"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Trend */}
        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Booking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fef7f8',
                    border: '1px solid #f27b89',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#ce0031" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Type Distribution */}
        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomTypeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Booked Rooms */}
        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Most Booked Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRooms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fef7f8',
                    border: '1px solid #f27b89',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="bookings" fill="#ce0031" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
