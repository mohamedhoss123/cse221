import { mockDelay } from '../lib/api'
import { mockBookings, mockComplaints } from '../mock-data/bookings'
import type { Booking, BookingStatus, Complaint } from '../types/booking.types'

export async function getBookings(customerId?: string): Promise<Booking[]> {
  await mockDelay()
  if (customerId) {
    return mockBookings.filter(booking => booking.customerId === customerId)
  }
  return [...mockBookings]
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  await mockDelay()
  return mockBookings.find(booking => booking.id === id)
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'createdAt'>
): Promise<Booking> {
  await mockDelay()
  const newBooking: Booking = {
    ...booking,
    id: `BKG-${String(mockBookings.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  }
  mockBookings.push(newBooking)
  return newBooking
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | undefined> {
  await mockDelay()
  const booking = mockBookings.find(b => b.id === id)
  if (booking) {
    booking.status = status
    return booking
  }
  return undefined
}

export async function cancelBooking(id: string): Promise<boolean> {
  await mockDelay()
  const booking = mockBookings.find(b => b.id === id)
  if (booking) {
    booking.status = 'cancelled'
    return true
  }
  return false
}

// Complaints
export async function getComplaints(customerId?: string): Promise<Complaint[]> {
  await mockDelay()
  if (customerId) {
    return mockComplaints.filter(complaint => complaint.customerId === customerId)
  }
  return [...mockComplaints]
}

export async function getComplaintById(id: string): Promise<Complaint | undefined> {
  await mockDelay()
  return mockComplaints.find(complaint => complaint.id === id)
}

export async function createComplaint(
  complaint: Omit<Complaint, 'id' | 'createdAt'>
): Promise<Complaint> {
  await mockDelay()
  const newComplaint: Complaint = {
    ...complaint,
    id: `CMP-${String(mockComplaints.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  }
  mockComplaints.push(newComplaint)
  return newComplaint
}

export async function updateComplaint(
  id: string,
  updates: Partial<Complaint>
): Promise<Complaint | undefined> {
  await mockDelay()
  const complaint = mockComplaints.find(c => c.id === id)
  if (complaint) {
    Object.assign(complaint, updates)
    return complaint
  }
  return undefined
}
