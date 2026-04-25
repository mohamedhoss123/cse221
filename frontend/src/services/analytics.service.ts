import BaseService from './base.service'

export interface AnalyticsStats {
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
  totalGuests: number
  completionRate: number
  avgGuestsPerBooking: number
}

export interface MonthlyTrend {
  month: string
  revenue: number
  bookings: number
}

export interface StatusDistribution {
  name: string
  value: number
}

export interface TopRoom {
  id: string
  name: string
  bookings: number
}

export interface CompleteAnalytics {
  stats: AnalyticsStats
  trends: MonthlyTrend[]
  statusDistribution: StatusDistribution[]
  topRooms: TopRoom[]
  roomTypes: StatusDistribution[]
}

// Get complete analytics data (recommended - single call)
export async function getCompleteAnalytics(): Promise<CompleteAnalytics> {
  return BaseService.get<CompleteAnalytics>('/analytics/complete')
}

// Get individual endpoints if needed
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  return BaseService.get<AnalyticsStats>('/analytics/stats')
}

export async function getMonthlyTrends(months: number = 6): Promise<MonthlyTrend[]> {
  return BaseService.get<MonthlyTrend[]>(`/analytics/trends?months=${months}`)
}

export async function getBookingStatusDistribution(): Promise<StatusDistribution[]> {
  return BaseService.get<StatusDistribution[]>('/analytics/booking-status')
}

export async function getTopRooms(limit: number = 5): Promise<TopRoom[]> {
  return BaseService.get<TopRoom[]>(`/analytics/top-rooms?limit=${limit}`)
}

export async function getRoomTypeDistribution(): Promise<StatusDistribution[]> {
  return BaseService.get<StatusDistribution[]>('/analytics/room-types')
}
