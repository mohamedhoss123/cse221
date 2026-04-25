import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCompleteAnalytics } from '#/services/analytics.service'
import type { CompleteAnalytics } from '#/services/analytics.service'
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
import { DollarSign, Users, Calendar } from 'lucide-react'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<CompleteAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await getCompleteAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!analytics) {
    return <div className="p-8">Failed to load analytics data</div>
  }

  const { stats, trends, statusDistribution, topRooms, roomTypes } = analytics

  const totalRevenue = stats.totalRevenue
  const totalBookings = stats.totalBookings
  const avgGuestsPerBooking = parseFloat(stats.avgGuestsPerBooking)

  const COLORS = ['#F5C518', '#000000', '#888888', '#DDDDDD']

  const monthlyRevenueData = trends

  const bookingStatusData = statusDistribution

  const topRoomsData = topRooms

  const roomTypeChartData = roomTypes

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
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #F5C518',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F5C518"
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
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #F5C518',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#F5C518" name="Bookings" />
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
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #F5C518',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="bookings" fill="#F5C518" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
