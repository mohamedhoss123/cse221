import BaseService from './base.service'
import { buildEndpoint } from './base.service'
import type { Payment, PaymentStatus } from '../types/booking.types'

export async function getPayments(customerId?: string): Promise<Payment[]> {
  const endpoint = buildEndpoint('/payments', { customerId })
  return BaseService.get<Payment[]>(endpoint)
}

export async function getPaymentById(id: string): Promise<Payment> {
  return BaseService.get<Payment>(`/payments/${id}`)
}

export async function createPayment(
  payment: Omit<Payment, 'id' | 'createdAt'>
): Promise<Payment> {
  return BaseService.post<Payment>('/payments', payment)
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Payment> {
  return BaseService.put<Payment>(`/payments/${id}/status`, { status })
}

export async function refundPayment(id: string): Promise<Payment> {
  return BaseService.post<Payment>(`/payments/${id}/refund`)
}
