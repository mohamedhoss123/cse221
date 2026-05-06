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
  customerEmail?: string | null
  customerPhone?: string | null
  visitorAddress?: string | null
  visitorGender?: string | null
  visitorBirthdate?: string | null
  checkIn: string
  checkOut: string
  status: BookingStatus
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  guests?: number
  totalAmount: number
  invoiceId?: string | null
  numberOfNights?: number
  specialRequests?: string
}

export interface Complaint {
  id: string
  visitorId: string
  description: string  // was 'message'
  type: string         // was 'subject'
  status?: 'open' | 'in_progress' | 'resolved'  // optional, not in schema
  response?: string    // optional, not in schema
  createdAt?: string   // optional, not in schema
}

// Keep for backward compatibility with components
export interface ComplaintUI extends Complaint {
  customerId?: string
  subject?: string
  message?: string
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
