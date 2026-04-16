export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Booking {
  id: string
  roomId: string
  roomName?: string
  customerId: string
  checkIn: string
  checkOut: string
  guests: number
  status: BookingStatus
  totalAmount: number
  paymentStatus: PaymentStatus
  createdAt: string
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
  bookingId: string
  customerId: string
  amount: number
  status: PaymentStatus
  method?: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  transactionId?: string
  createdAt: string
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
  status: 'pending' | 'partial' | 'paid' | 'overdue'
  payments: Payment[]
  createdAt: string
  dueDate: string
}
