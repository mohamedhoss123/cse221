import { mockDelay } from '../lib/api'
import { mockPayments, mockBookings } from '../mock-data/bookings'
import type { Payment, PaymentStatus } from '../types/booking.types'

export function getPaymentsSync(customerId?: string): Payment[] {
  if (customerId) {
    return mockPayments.filter(payment => payment.customerId === customerId)
  }
  return [...mockPayments]
}

export async function getPayments(customerId?: string): Promise<Payment[]> {
  await mockDelay()
  return getPaymentsSync(customerId)
}

export async function getPaymentById(id: string): Promise<Payment | undefined> {
  await mockDelay()
  return mockPayments.find(payment => payment.id === id)
}

export async function createPayment(
  payment: Omit<Payment, 'id' | 'createdAt'>
): Promise<Payment> {
  await mockDelay()
  const newPayment: Payment = {
    ...payment,
    id: `PAY-${String(mockPayments.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  }
  mockPayments.push(newPayment)

  // Update booking payment status
  const booking = mockBookings.find(b => b.id === payment.bookingId)
  if (booking) {
    booking.paymentStatus = payment.status
  }

  return newPayment
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Payment | undefined> {
  await mockDelay()
  const payment = mockPayments.find(p => p.id === id)
  if (payment) {
    payment.status = status

    // Update booking payment status
    const booking = mockBookings.find(b => b.id === payment.bookingId)
    if (booking) {
      booking.paymentStatus = status
    }

    return payment
  }
  return undefined
}

export async function refundPayment(id: string): Promise<Payment | undefined> {
  await mockDelay(1000) // Refunds take longer
  return updatePaymentStatus(id, 'refunded')
}
