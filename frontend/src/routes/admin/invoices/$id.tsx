import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getInvoiceById } from '#/services/invoices.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import {
  FileText,
  DollarSign,
  Calendar,
  User,
  Bed,
  ArrowLeft,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import type { Invoice, InvoiceStatus } from '#/types/booking.types'

export const Route = createFileRoute('/admin/invoices/$id')({
  component: AdminInvoiceDetailPage,
})

function AdminInvoiceDetailPage() {
  const { id } = Route.useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoice()
  }, [id])

  const loadInvoice = async () => {
    try {
      const data = await getInvoiceById(id)
      setInvoice(data)
    } catch (error) {
      console.error('Failed to load invoice:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!invoice) {
    return <div className="p-8">Invoice not found</div>
  }

  const getInvoiceStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white'
      case 'partial':
        return 'bg-blue-500 text-white'
      case 'pending':
        return 'bg-amber-500 text-white'
      case 'overdue':
        return 'bg-red-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getInvoiceStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return CheckCircle
      case 'partial':
        return Clock
      case 'pending':
        return DollarSign
      case 'overdue':
        return AlertCircle
      default:
        return FileText
    }
  }

  const StatusIcon = getInvoiceStatusIcon(invoice.status)

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'credit_card':
        return CreditCard
      case 'cash':
        return DollarSign
      case 'bank_transfer':
        return CreditCard
      default:
        return DollarSign
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <Link to="/admin/invoices">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--expressive-primary)]">
            Invoice {invoice.id}
          </h1>
          <p className="text-[var(--expressive-text-muted)]">
            Created on {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMMM d, yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <Badge className={getInvoiceStatusColor(invoice.status)} variant="secondary">
          <StatusIcon className="mr-2 h-4 w-4" />
          {invoice.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Customer ID</p>
                <p className="font-medium">{invoice.customerId}</p>
              </div>
              {invoice.customerName && (
                <div>
                  <p className="text-sm text-[var(--expressive-text-muted)]">Name</p>
                  <p className="font-medium">{invoice.customerName}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--expressive-text-muted)]">Reservation ID</p>
                  <p className="font-medium">{invoice.bookingId}</p>
                </div>
                {invoice.reservationId && (
                  <div>
                    <p className="text-sm text-[var(--expressive-text-muted)]">Reservation ID (Legacy)</p>
                    <p className="font-medium">{invoice.reservationId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--expressive-text-muted)]">Room</p>
                  <p className="font-medium">{invoice.roomType || invoice.booking?.roomName || '-'}</p>
                </div>
                {invoice.roomId && (
                  <div>
                    <p className="text-sm text-[var(--expressive-text-muted)]">Room ID</p>
                    <p className="font-medium">{invoice.roomId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--expressive-text-muted)]">Check-in</p>
                  <p className="font-medium">
                    {invoice.booking?.checkIn || invoice.date || invoice.createdAt
                      ? format(new Date(invoice.booking?.checkIn || invoice.date || invoice.createdAt), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--expressive-text-muted)]">Check-out</p>
                  <p className="font-medium">
                    {invoice.booking?.checkOut || invoice.dueDate
                      ? format(new Date(invoice.booking?.checkOut || invoice.dueDate), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                {invoice.booking?.guests && (
                  <div>
                    <p className="text-sm text-[var(--expressive-text-muted)]">Guests</p>
                    <p className="font-medium">{invoice.booking.guests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Room Charges</span>
                  <span className="font-medium">${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</span>
                </div>
                {invoice.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-[var(--expressive-text-muted)]">Notes</p>
                      <p className="text-sm">{invoice.notes}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="island-shell">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Total Amount</p>
                <p className="text-2xl font-bold">${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Amount Paid</p>
                <p className="text-xl font-semibold text-green-600">${invoice.paidAmount ? invoice.paidAmount.toFixed(2) : '0.00'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Remaining</p>
                <p className={`text-xl font-semibold ${(invoice.remainingAmount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${(invoice.remainingAmount || 0).toFixed(2)}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Due Date</p>
                <p className="font-medium">{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.payments && invoice.payments.length > 0 ? (
                <div className="space-y-3">
                  {invoice.payments.map((payment, index) => {
                    const PaymentIcon = getPaymentMethodIcon(payment.method)
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-[var(--expressive-primary)]" />
                          <div>
                            <p className="font-medium">${payment.amount ? payment.amount.toFixed(2) : '0.00'}</p>
                            <p className="text-xs text-[var(--expressive-text-muted)]">
                              {payment.method?.replace('_', ' ') || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        {payment.date && (
                          <p className="text-xs text-[var(--expressive-text-muted)]">
                            {format(new Date(payment.date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-[var(--expressive-text-muted)] py-4">
                  No payments recorded
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
