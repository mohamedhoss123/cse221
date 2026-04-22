export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type InvoiceStatus = 'pending' | 'partial' | 'paid' | 'overdue'

export interface Booking {
  id: string
  roomId: string
  roomType: string
  roomPrice: number
  customerId: string
  visitorId: string
  customerName: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  guests?: number
  totalAmount: number
  invoiceId?: string | null
  numberOfNights?: number
  specialRequests?: string
}

export interface Complaint {
  id: string
  customerId: string
  bookingId?: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  response?: string
  createdAt: string
}

export interface Payment {
  id: string
  invoiceId?: string
  amount: number
  method?: string
  date: string | null
}

export interface Invoice {
  id: string
  bookingId: string
  booking: {
    id: string
    roomName: string
    checkIn: string
    checkOut: string
    guests: number
  }
  customerId: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  status: InvoiceStatus
  payments: Payment[]
  createdAt: string
  dueDate: string
  // Additional backend fields
  reservationId?: string
  roomId?: string
  roomType?: string
  visitorId?: string
  date?: string
  customerName?: string
  amount?: number
  notes?: string
}
