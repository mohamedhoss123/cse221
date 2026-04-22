import BaseService from './base.service'
import type { Invoice } from '../types/booking.types'

export async function getInvoices(customerId?: string): Promise<Invoice[]> {
  const endpoint = customerId ? `/invoices?customerId=${customerId}` : '/invoices'
  return BaseService.get<Invoice[]>(endpoint)
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  return BaseService.get<Invoice>(`/invoices/${id}`)
}

export async function createPaymentForInvoice(
  invoiceId: string,
  amount: number,
  method: string
): Promise<Invoice> {
  return BaseService.post<Invoice>(`/invoices/${invoiceId}/payment`, {
    amount,
    method,
  })
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  return BaseService.put<Invoice>(`/invoices/${id}/status`, { status })
}

export async function getInvoiceSummary(): Promise<{
  totalBilled: number
  totalPaid: number
  totalPending: number
  overdueCount: number
}> {
  const invoices = await getInvoices()

  return {
    totalBilled: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    totalPending: invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
    overdueCount: invoices.filter((inv) => inv.status === 'overdue').length,
  }
}
