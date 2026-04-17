import { apiClient } from '../lib/api-client'
import type { Booking, BookingStatus } from '../types/booking.types'

export async function getBookings(customerId?: string): Promise<Booking[]> {
  try {
    const params = customerId ? { customerId } : {}
    const response = await apiClient.get<Booking[]>('/bookings', { params })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get bookings')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get bookings')
  }
}

export async function getBookingById(id: string): Promise<Booking> {
  try {
    const response = await apiClient.get<Booking>(`/bookings/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get booking')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get booking')
  }
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'createdAt'>
): Promise<Booking> {
  try {
    const response = await apiClient.post<Booking>('/bookings', booking)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create booking')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create booking')
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  try {
    const response = await apiClient.put<Booking>(`/bookings/${id}/status`, { status })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update booking status')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update booking status')
  }
}

export async function cancelBooking(id: string): Promise<boolean> {
  try {
    const response = await apiClient.post<{ success: boolean }>(`/bookings/${id}/cancel`)

    if (!response.success) {
      throw new Error(response.message || 'Failed to cancel booking')
    }

    return response.success
  } catch (error: any) {
    throw new Error(error.message || 'Failed to cancel booking')
  }
}
