import { mockDelay } from '../lib/api'
import type { Invoice } from '../types/booking.types'

// Mock invoice data
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    bookingId: 'BK-12345',
    booking: {
      id: 'BK-12345',
      roomName: 'Deluxe Ocean View Suite',
      checkIn: '2025-06-15',
      checkOut: '2025-06-20',
      guests: 2,
    },
    customerId: '1',
    totalAmount: 1400,
    paidAmount: 600,
    remainingAmount: 800,
    status: 'partial',
    dueDate: '2025-06-01',
    createdAt: '2025-04-15',
    payments: [
      {
        id: 'PAY-001',
        bookingId: 'BK-12345',
        customerId: '1',
        amount: 300,
        status: 'paid',
        method: 'credit_card',
        transactionId: 'TXN-789456',
        createdAt: '2025-04-16T10:30:00',
      },
      {
        id: 'PAY-002',
        bookingId: 'BK-12345',
        customerId: '1',
        amount: 300,
        status: 'paid',
        method: 'paypal',
        transactionId: 'TXN-789457',
        createdAt: '2025-04-20T14:22:00',
      },
    ],
  },
  {
    id: 'INV-002',
    bookingId: 'BK-12346',
    booking: {
      id: 'BK-12346',
      roomName: 'Presidential Penthouse',
      checkIn: '2025-07-01',
      checkOut: '2025-07-07',
      guests: 4,
    },
    customerId: '1',
    totalAmount: 2400,
    paidAmount: 2400,
    remainingAmount: 0,
    status: 'paid',
    dueDate: '2025-05-01',
    createdAt: '2025-03-10',
    payments: [
      {
        id: 'PAY-003',
        bookingId: 'BK-12346',
        customerId: '1',
        amount: 1200,
        status: 'paid',
        method: 'credit_card',
        transactionId: 'TXN-789458',
        createdAt: '2025-03-15T09:00:00',
      },
      {
        id: 'PAY-004',
        bookingId: 'BK-12346',
        customerId: '1',
        amount: 1200,
        status: 'paid',
        method: 'bank_transfer',
        transactionId: 'TXN-789459',
        createdAt: '2025-04-01T16:30:00',
      },
    ],
  },
  {
    id: 'INV-003',
    bookingId: 'BK-12347',
    booking: {
      id: 'BK-12347',
      roomName: 'Standard Room with City View',
      checkIn: '2025-08-10',
      checkOut: '2025-08-15',
      guests: 2,
    },
    customerId: '1',
    totalAmount: 450,
    paidAmount: 0,
    remainingAmount: 450,
    status: 'pending',
    dueDate: '2025-07-15',
    createdAt: '2025-04-10',
    payments: [],
  },
]

export async function getInvoices(customerId?: string): Promise<Invoice[]> {
  await mockDelay()
  if (customerId) {
    return mockInvoices.filter((invoice) => invoice.customerId === customerId)
  }
  return [...mockInvoices]
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  await mockDelay()
  return mockInvoices.find((invoice) => invoice.id === id)
}

export async function createPaymentForInvoice(
  invoiceId: string,
  amount: number,
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
): Promise<Invoice | undefined> {
  await mockDelay(2000) // Simulate payment processing

  const invoice = mockInvoices.find((inv) => inv.id === invoiceId)
  if (!invoice) return undefined

  const newPayment = {
    id: `PAY-${String(mockInvoices.reduce((sum, inv) => sum + inv.payments.length, 0) + 1).padStart(3, '0')}`,
    bookingId: invoice.bookingId,
    customerId: invoice.customerId,
    amount,
    status: 'paid' as const,
    method,
    transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
    createdAt: new Date().toISOString(),
  }

  invoice.payments.push(newPayment)
  invoice.paidAmount += amount
  invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount

  if (invoice.remainingAmount === 0) {
    invoice.status = 'paid'
  } else if (invoice.paidAmount > 0) {
    invoice.status = 'partial'
  }

  return invoice
}
