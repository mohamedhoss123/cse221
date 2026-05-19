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
    setIsLoading(true)
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <Clock className="h-12 w-12 text-[var(--expressive-primary)] animate-pulse mb-4" />
        <p className="text-[var(--expressive-text-muted)] font-black uppercase tracking-widest">Reconstructing Statement...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-[var(--expressive-text)] mb-2">Statement Not Found</h1>
        <Button asChild className="border-2 border-[var(--expressive-secondary)] font-black uppercase tracking-widest text-[10px]">
          <Link to="/admin/invoices">Return to Ledger</Link>
        </Button>
      </div>
    )
  }

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[3px_3px_0_0_#bbf7d0]">
            <CheckCircle className="h-3 w-3 mr-2" />
            Settled
          </span>
        )
      case 'partial':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[3px_3px_0_0_#bfdbfe]">
            <Clock className="h-3 w-3 mr-2" />
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[3px_3px_0_0_#fcd34d]">
            <DollarSign className="h-3 w-3 mr-2" />
            {status}
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[3px_3px_0_0_#fecaca]">
            <AlertCircle className="h-3 w-3 mr-2" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[3px_3px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="icon" asChild className="h-10 w-10 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 transition-all bg-white">
              <Link to="/admin/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--expressive-text-muted)] bg-[var(--expressive-surface)] px-2 py-1 rounded border border-[var(--expressive-secondary)]/10">
              Finance / Statement
            </span>
          </div>
          <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
            Statement <span className="font-semibold text-[var(--expressive-primary)]">#{invoice.id.substring(0, 8)}</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] text-lg">
            Audit log for beneficiary <span className="text-[var(--expressive-text)] font-bold">{invoice.customerName || invoice.customerId}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {getInvoiceStatusBadge(invoice.status)}
          <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">
            Audit Date: {invoice.date || invoice.createdAt ? format(new Date(invoice.date || invoice.createdAt), 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Reservation Details */}
          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Linked Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-12 sm:grid-cols-2">
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[var(--expressive-primary)] rounded-full opacity-20" />
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-3">Asset Classification</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)]">
                      <Bed className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-[var(--expressive-text)]">
                        {invoice.roomType || invoice.booking?.roomName || 'Premium Unit'}
                      </p>
                      <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">Room ID: {invoice.roomId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-400 rounded-full opacity-20" />
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-3">Occupancy Window</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-black text-[var(--expressive-text)]">
                      {invoice.booking?.checkIn ? format(new Date(invoice.booking.checkIn), 'MMM d') : 'N/A'} — {invoice.booking?.checkOut ? format(new Date(invoice.booking.checkOut), 'MMM d, yyyy') : 'N/A'}
                    </p>
                    <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">
                      Booking File: #{invoice.bookingId?.substring(0, 12)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Line Item Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5">
                  <div>
                    <p className="font-black text-[var(--expressive-text)]">Primary Accommodation</p>
                    <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase">Calculated daily rate for stay duration</p>
                  </div>
                  <span className="text-xl font-black text-[var(--expressive-text)]">${invoice.totalAmount?.toLocaleString()}</span>
                </div>

                {invoice.notes && (
                  <div className="p-4 rounded-xl bg-blue-50/50 border-2 border-blue-100 italic text-sm text-blue-800">
                    <p className="font-black uppercase text-[10px] mb-1 not-italic opacity-50">Auditor Notes</p>
                    {invoice.notes}
                  </div>
                )}

                <div className="pt-6 border-t-2 border-[var(--expressive-secondary)] flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Total Certified Amount</span>
                  <span className="text-4xl font-black text-[var(--expressive-primary)] tracking-tighter">
                    ${invoice.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Payment Summary */}
          <Card className="bg-[var(--expressive-primary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b-2 border-white/10 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Settlement Hub</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Outstanding Balance</p>
                <p className="text-5xl font-black tracking-tighter">
                  ${(invoice.remainingAmount || 0).toLocaleString()}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase border-b border-white/10 pb-3">
                  <span className="opacity-60">Paid to date</span>
                  <span>${invoice.paidAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase border-b border-white/10 pb-3">
                  <span className="opacity-60">Gross Value</span>
                  <span>${invoice.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span className="opacity-60">Final Deadline</span>
                  <span>{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-lg font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {invoice.payments && invoice.payments.length > 0 ? (
                <div className="space-y-4">
                  {invoice.payments.map((payment, index) => {
                    const PaymentIcon = getPaymentMethodIcon(payment.method)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[var(--expressive-background)] border border-[var(--expressive-secondary)]/5 group hover:border-[var(--expressive-primary)]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[var(--expressive-surface)] border border-[var(--expressive-secondary)]/10 flex items-center justify-center text-[var(--expressive-primary)]">
                            <PaymentIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[var(--expressive-text)]">${payment.amount?.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">
                              {payment.method?.replace('_', ' ') || 'Electronic'}
                            </p>
                          </div>
                        </div>
                        {payment.date && (
                          <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase">
                            {format(new Date(payment.date), 'MMM d')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center bg-[var(--expressive-background)]/50 rounded-xl border-2 border-dashed border-[var(--expressive-secondary)]/10">
                  <DollarSign className="h-8 w-8 text-[var(--expressive-text-muted)] mx-auto mb-2 opacity-20" />
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">
                    No records found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

