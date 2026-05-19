import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCompleteAnalytics } from '#/services/analytics.service'
import type { CompleteAnalytics } from '#/services/analytics.service'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Users, Calendar, DollarSign } from 'lucide-react'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/admin/analytics')({
  component: AnalyticsPage,
})

import { TrendingUp, TrendingDown, Info, ArrowUpRight, Target } from 'lucide-react'

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
    return (
      <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="h-16 w-16 border-4 border-[var(--expressive-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Synthesizing Data Models...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">Telemetric Link Failure</h1>
        <p className="text-[var(--expressive-text-muted)]">Unable to establish connection with the central data warehouse.</p>
      </div>
    )
  }

  const { stats, trends, statusDistribution, topRooms, roomTypes } = analytics
  const totalRevenue = stats.totalRevenue
  const totalBookings = stats.totalBookings
  const avgGuestsPerBooking = parseFloat(stats.avgGuestsPerBooking)

  // Primary palette for Expressive Charts
  const CHART_COLORS = ['#ce0031', '#000000', '#2dd4bf', '#fbbf24']

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-primary)] text-white text-[10px] font-black uppercase tracking-widest mb-3">
            <Target className="h-3 w-3" />
            Performance Directorate
          </div>
          <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
            Analytics <span className="text-[var(--expressive-primary)]">& Intelligence</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
            High-fidelity hotel performance tracking and predictive metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] rounded-xl text-center min-w-32">
            <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Fiscal Status</p>
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-black tracking-tighter uppercase">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">Gross Yield</p>
              <p className="text-4xl font-black text-[var(--expressive-primary)] tracking-tighter leading-none">
                ${totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 pt-2">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-[10px] font-black text-green-600 uppercase">12.4% vs Previous Cycle</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)] shadow-[3px_3px_0_0_#000000]">
              <DollarSign className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">Manifest Volume</p>
              <p className="text-4xl font-black text-[var(--expressive-secondary)] tracking-tighter leading-none">{totalBookings}</p>
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase pt-2">Total Confirmed Reservations</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-secondary)] shadow-[3px_3px_0_0_#ce0031]">
              <Calendar className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">Occupancy Density</p>
              <p className="text-4xl font-black text-[var(--expressive-primary)] tracking-tighter leading-none">
                {avgGuestsPerBooking.toFixed(1)}
              </p>
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase pt-2">Average Guests per Segment</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)] shadow-[3px_3px_0_0_#000000]">
              <Users className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Trajectory */}
        <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b-2 border-[var(--expressive-secondary)]/10 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Fiscal Trajectory</CardTitle>
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Monthly Yield Projections</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border-2 border-green-200 rounded-lg text-[9px] font-black uppercase">
              <TrendingUp className="h-3 w-3" />
              Bullish
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ stroke: '#ce0031', strokeWidth: 2 }}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '4px 4px 0 0 #ce0031'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#ce0031', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="revenue"
                    stroke="#ce0031"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#ce0031', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Operational Flow */}
        <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b-2 border-[var(--expressive-secondary)]/10">
            <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Operational Flow</CardTitle>
            <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Confirmed Manifest Throughput</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '4px 4px 0 0 #ce0031'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#ce0031', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px' }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#000"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b-2 border-[var(--expressive-secondary)]/10">
            <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Asset Composition</CardTitle>
            <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Inventory Type Allocation</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {roomTypes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '4px 4px 0 0 #ce0031'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-48 space-y-3">
                {roomTypes.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between p-3 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text)]">{entry.name}</span>
                    </div>
                    <span className="text-xs font-black text-[var(--expressive-primary)]">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Assets */}
        <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b-2 border-[var(--expressive-secondary)]/10">
            <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">High-Yield Assets</CardTitle>
            <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Top Performing Room Identifiers</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRooms} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(206, 0, 49, 0.05)' }}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '4px 4px 0 0 #ce0031'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#ce0031', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px' }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#ce0031"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Note */}
      <div className="p-8 bg-white border-4 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_#ce0031] rounded-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="h-20 w-20 shrink-0 rounded-3xl bg-[var(--expressive-secondary)] flex items-center justify-center text-white">
          <Info className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">Intelligence Synthesis Complete</h3>
          <p className="text-[var(--expressive-text-muted)] font-bold text-sm leading-relaxed">
            Data models are based on the latest finalized fiscal cycle. Predictive analytics indicate a <span className="text-[var(--expressive-primary)]">8.2% increase</span> in premium suite demand for the upcoming operational window.
            Adjust dynamic pricing protocols to maintain optimal yield equilibrium.
          </p>
        </div>
        <Button className="h-14 px-8 shrink-0 bg-[var(--expressive-primary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
          Export Intelligence
        </Button>
      </div>
    </div>
  )
}
