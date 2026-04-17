import { apiClient } from '../lib/api-client'
import type { Invoice } from '../types/booking.types'

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const response = await apiClient.get<Invoice[]>('/invoices')

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get invoices')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get invoices')
  }
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  try {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get invoice')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get invoice')
  }
}

export async function createPaymentForInvoice(
  invoiceId: string,
  amount: number,
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
): Promise<Invoice> {
  try {
    const response = await apiClient.post<Invoice>(`/invoices/${invoiceId}/payment`, {
      amount,
      method,
    })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create payment for invoice')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create payment for invoice')
  }
}
