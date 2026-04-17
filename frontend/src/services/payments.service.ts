import { apiClient } from '../lib/api-client'
import type { Payment, PaymentStatus } from '../types/booking.types'

export async function getPayments(customerId?: string): Promise<Payment[]> {
  try {
    const params = customerId ? { customerId } : {}
    const response = await apiClient.get<Payment[]>('/payments', { params })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get payments')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get payments')
  }
}

export async function getPaymentById(id: string): Promise<Payment> {
  try {
    const response = await apiClient.get<Payment>(`/payments/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get payment')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get payment')
  }
}

export async function createPayment(
  payment: Omit<Payment, 'id' | 'createdAt'>
): Promise<Payment> {
  try {
    const response = await apiClient.post<Payment>('/payments', payment)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create payment')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create payment')
  }
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Payment> {
  try {
    const response = await apiClient.put<Payment>(`/payments/${id}/status`, { status })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update payment status')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update payment status')
  }
}

export async function refundPayment(id: string): Promise<Payment> {
  try {
    const response = await apiClient.post<Payment>(`/payments/${id}/refund`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to refund payment')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to refund payment')
  }
}
