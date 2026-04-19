import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getInvoiceById } from '#/services/invoices.service'
import { createPaymentForInvoice } from '#/services/invoices.service'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  FileText,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Invoice } from '#/types/booking.types'

export const Route = createFileRoute('/customer/payments/$invoiceId')({
  component: InvoicePage,
  loader: async ({ params }) => {
    try {
      const invoice = await getInvoiceById(params.invoiceId)
      return { invoice }
    } catch (error) {
      return { invoice: null, error: true }
    }
  },
})

function InvoicePage() {
  const { invoiceId } = Route.useParams()
  const { invoice, error } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(invoice)

  if (error || !invoice) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Invoice Not Found</h1>
          <p className="text-slate-600 mb-6">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button
            onClick={() => navigate({ to: '/customer/payments' })}
            className="bg-[var(--expressive-primary)] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
        </div>
      </div>
    )
  }

  const progressPercentage = (currentInvoice!.paidAmount / currentInvoice!.totalAmount) * 100

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        icon: Clock,
        label: 'Pending',
        className: 'bg-yellow-100 text-[var(--expressive-text)] border-yellow-200',
      },
      partial: {
        icon: AlertCircle,
        label: 'Partial Payment',
        className: 'bg-amber-100 text-[var(--expressive-text)] border-amber-200',
      },
      paid: {
        icon: CheckCircle2,
        label: 'Paid',
        className: 'bg-green-100 text-[var(--expressive-text)] border-green-200',
      },
      overdue: {
        icon: AlertCircle,
        label: 'Overdue',
        className: 'bg-red-100 text-[var(--expressive-primary)] border-red-200',
      },
    }

    const config = statusConfig[currentInvoice!.status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${config.className}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </div>
    )
  }

  const handleMakePayment = async () => {
    const amount = parseFloat(paymentAmount)

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amount > currentInvoice!.remainingAmount) {
      toast.error(`Payment cannot exceed remaining balance of $${currentInvoice!.remainingAmount}`)
      return
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsProcessing(true)

    try {
      const updatedInvoice = await createPaymentForInvoice(
        invoiceId,
        amount,
        paymentMethod as 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
      )

      setCurrentInvoice(updatedInvoice)
      toast.success(`Payment of $${amount} processed successfully!`)
      setPaymentAmount('')
      setPaymentMethod('')
      setShowPaymentDialog(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickAmount = (amount: number) => {
    if (amount <= currentInvoice!.remainingAmount) {
      setPaymentAmount(amount.toString())
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate({ to: '/customer/payments' })}
            className="text-sm text-[var(--expressive-primary)] hover:underline mb-3 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payments
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-light text-[var(--expressive-primary)]">
              Invoice <span className="font-semibold text-[var(--expressive-primary)]">#{currentInvoice.id}</span>
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-[var(--expressive-text)]">
            Booking #{currentInvoice.bookingId} • Created on {format(new Date(currentInvoice.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
            onClick={() => toast.info('Downloading receipt...')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {currentInvoice.status !== 'paid' && (
            <Button
              className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all"
              onClick={() => setShowPaymentDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details Card */}
          <div className="bg-[var(--expressive-surface)] rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--expressive-accent)]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--expressive-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--expressive-primary)]">Booking Details</h2>
                <p className="text-sm text-[var(--expressive-text)]">Reservation information</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Room Type</p>
                  <p className="text-sm font-medium text-[var(--expressive-primary)]">{currentInvoice.booking.roomName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Check-in</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--expressive-text)]" />
                    <p className="text-sm font-medium text-[var(--expressive-primary)]">
                      {format(new Date(currentInvoice.booking.checkIn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Guests</p>
                  <p className="text-sm font-medium text-[var(--expressive-primary)]">{currentInvoice.booking.guests} guests</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Booking ID</p>
                  <p className="text-sm font-medium text-[var(--expressive-primary)]">{currentInvoice.booking.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Check-out</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--expressive-text)]" />
                    <p className="text-sm font-medium text-[var(--expressive-primary)]">
                      {format(new Date(currentInvoice.booking.checkOut), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--expressive-text)] mb-1">Due Date</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--expressive-text)]" />
                    <p className="text-sm font-medium text-[var(--expressive-primary)]">
                      {format(new Date(currentInvoice.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-[var(--expressive-surface)] rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[var(--expressive-text)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--expressive-primary)]">Payment History</h2>
                  <p className="text-sm text-[var(--expressive-text)]">{currentInvoice.payments.length} transaction(s)</p>
                </div>
              </div>
            </div>

            {currentInvoice.payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-[var(--expressive-text)] mx-auto mb-3" />
                <p className="text-[var(--expressive-text)]">No payments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentInvoice.payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-[var(--expressive-background)] rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-[var(--expressive-text)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[var(--expressive-primary)]">
                            {payment.method?.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--expressive-text)]">
                          {format(new Date(payment.date), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[var(--expressive-text)]">${payment.amount}</p>
                      <p className="text-xs text-[var(--expressive-text)]">
                        {index + 1} of {currentInvoice.payments.length} payment{currentInvoice.payments.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          {/* Payment Progress Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Payment Progress</h3>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--expressive-text)]">Amount Paid</span>
                <span className="text-sm font-semibold">${currentInvoice.paidAmount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--expressive-text)]">Progress</span>
                <span className="text-sm font-semibold text-[var(--expressive-accent)]">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--expressive-text)]">Total Amount</span>
                <span className="text-sm font-semibold">${currentInvoice.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--expressive-text)]">Paid</span>
                <span className="text-sm font-semibold text-[var(--expressive-text)]">${currentInvoice.paidAmount}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <span className="text-base font-semibold">Remaining</span>
                <span className="text-xl font-bold text-[var(--expressive-accent)]">${currentInvoice.remainingAmount}</span>
              </div>
            </div>
          </div>

          {/* Quick Payment Actions */}
          {currentInvoice.status !== 'paid' && (
            <div className="bg-[var(--expressive-surface)] rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)] mb-4">Quick Payment</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
                  onClick={() => handleQuickAmount(Math.min(200, currentInvoice.remainingAmount))}
                  disabled={200 > currentInvoice.remainingAmount}
                >
                  $200
                </Button>
                <Button
                  variant="outline"
                  className="bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
                  onClick={() => handleQuickAmount(Math.min(400, currentInvoice.remainingAmount))}
                  disabled={400 > currentInvoice.remainingAmount}
                >
                  $400
                </Button>
                <Button
                  variant="outline"
                  className="col-span-2 bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
                  onClick={() => handleQuickAmount(currentInvoice.remainingAmount)}
                >
                  Pay Remaining (${currentInvoice.remainingAmount})
                </Button>
              </div>
              <Button
                className="w-full mt-3 bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all"
                onClick={() => setShowPaymentDialog(true)}
              >
                Custom Amount
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Payment Methods Info */}
          <div className="bg-[var(--expressive-accent)]/20 rounded-2xl p-6 border border-[var(--expressive-accent)]/30">
            <h3 className="text-sm font-semibold text-[var(--expressive-primary)] mb-3">Accepted Payment Methods</h3>
            <div className="space-y-2 text-xs text-[var(--expressive-text)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Credit/Debit Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>PayPal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Enter the payment amount and select your preferred payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--expressive-text)] font-semibold">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="pl-8 h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--expressive-primary)] transition-colors"
                  min="1"
                  max={currentInvoice.remainingAmount}
                  step="0.01"
                />
              </div>
              <p className="text-xs text-[var(--expressive-text)]">
                Remaining balance: <span className="font-semibold">${currentInvoice.remainingAmount}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-[var(--expressive-primary)] transition-colors">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl">
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              className="bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMakePayment}
              className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
