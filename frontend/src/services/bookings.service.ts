import BaseService from './base.service'
import { buildEndpoint } from './base.service'
import type { Booking, BookingStatus } from '../types/booking.types'

export async function getBookings(filters?: { customerId?: string; visitorId?: string }): Promise<Booking[]> {
  const endpoint = buildEndpoint('/bookings', filters)
  return BaseService.get<Booking[]>(endpoint)
}

export async function getBookingById(id: string): Promise<Booking> {
  return BaseService.get<Booking>(`/bookings/${id}`)
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'customerId' | 'visitorId' | 'customerName' | 'numberOfNights'>
): Promise<Booking> {
  return BaseService.post<Booking>('/bookings', booking)
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  return BaseService.put<Booking>(`/bookings/${id}/status`, { status })
}

export async function cancelBooking(id: string): Promise<{ message: string; bookingId: string }> {
  return BaseService.delete<{ message: string; bookingId: string }>(`/bookings/${id}`)
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; conflictingBookings: number }> {
  const endpoint = buildEndpoint(`/bookings/room/${roomId}/availability`, { checkIn, checkOut })
  return BaseService.get<{ available: boolean; conflictingBookings: number }>(endpoint)
}
