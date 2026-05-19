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
  DollarSign,
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
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(
    invoice ? { ...invoice, payments: invoice.payments || [] } : null
  )

  // Safe date formatting helper
  const safeFormatDate = (dateValue: string | null | undefined, formatString: string) => {
    if (!dateValue) return 'N/A'
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return 'N/A'
    try {
      return format(date, formatString)
    } catch {
      return 'N/A'
    }
  }

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

  const progressPercentage = currentInvoice!.totalAmount > 0 ? ((currentInvoice!.totalAmount - (currentInvoice!.remainingAmount || 0)) / currentInvoice!.totalAmount) * 100 : 0

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        icon: Clock,
        label: 'PENDING',
        className: 'bg-amber-100 text-[#000] border-amber-400 shadow-[2px_2px_0_0_#fbbf24]',
      },
      partial: {
        icon: AlertCircle,
        label: 'PARTIAL',
        className: 'bg-blue-100 text-[#000] border-blue-400 shadow-[2px_2px_0_0_#60a5fa]',
      },
      paid: {
        icon: CheckCircle2,
        label: 'SETTLED',
        className: 'bg-green-100 text-[#000] border-green-400 shadow-[2px_2px_0_0_#4ade80]',
      },
      overdue: {
        icon: AlertCircle,
        label: 'OVERDUE',
        className: 'bg-red-100 text-black border-red-400 shadow-[2px_2px_0_0_#f87171]',
      },
    }

    const config = statusConfig[currentInvoice!.status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[10px] font-black border-2 uppercase tracking-tighter ${config.className}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={3} />
        {config.label}
      </div>
    )
  }

  const handleMakePayment = async () => {
    const amount = parseFloat(paymentAmount)
    const remainingAmount = currentInvoice!.remainingAmount || currentInvoice!.amount || 0

    if (!amount || amount <= 0) {
      toast.error('LIQUIDATION_ERROR: INVALID_AMOUNT')
      return
    }

    if (amount > remainingAmount) {
      toast.error(`LIQUIDATION_ERROR: AMOUNT_EXCEEDS_LIABILITY ($${remainingAmount})`)
      return
    }

    if (!paymentMethod) {
      toast.error('LIQUIDATION_ERROR: METHOD_UNDEFINED')
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
      toast.success(`LIQUIDATION_SUCCESS: $${amount} ABSORBED`)
      setPaymentAmount('')
      setPaymentMethod('')
      setShowPaymentDialog(false)
    } catch (error: any) {
      toast.error(error.message || 'LIQUIDATION_FAILURE')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-4 border-black pb-8">
        <div>
          <button
            onClick={() => navigate({ to: '/customer/payments' })}
            className="group mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_LEDGER
          </button>
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-5xl font-black text-black uppercase tracking-tighter leading-none">
              FISCAL_MFST <span className="text-[#ce0031]">#{currentInvoice.id}</span>
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-xs font-bold text-black/60 uppercase tracking-widest">
            BKG_REF: {currentInvoice.reservationId} // GENERATED: {safeFormatDate(currentInvoice.date, 'yyyy.MM.dd')}
          </p>
        </div>
        <div className="mt-8 md:mt-0">
          {currentInvoice.status !== 'paid' && (
            <Button
              className="rounded-none h-14 px-8 border-4 border-black bg-[#ce0031] text-white font-black uppercase tracking-widest shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
              onClick={() => setShowPaymentDialog(true)}
            >
              <Plus className="w-5 h-5 mr-3" strokeWidth={3} />
              INITIATE_LIQUIDATION
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Booking Details Card */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-black text-white text-[8px] font-black uppercase tracking-widest">
              SECURE_INTEL_FEED
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-black text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">Asset Specification</h2>
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest italic">Core Reservation Telemetry</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Asset Class</p>
                  <p className="text-lg font-black text-black uppercase">
                    {currentInvoice.roomType ? `${currentInvoice.roomType.replace('_', ' ')}` : 'UNKNOWN'}
                  </p>
                </div>
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Reservation Key</p>
                  <p className="text-lg font-black text-black">{currentInvoice.reservationId || 'NULL'}</p>
                </div>
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Hardware ID</p>
                  <p className="text-lg font-black text-black">{currentInvoice.roomId || 'NULL'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Operator Identity</p>
                  <p className="text-lg font-black text-black uppercase">{currentInvoice.customerName || 'UNIDENTIFIED'}</p>
                </div>
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Manifest Genesis</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#ce0031]" />
                    <p className="text-lg font-black text-black">
                      {safeFormatDate(currentInvoice.date, 'yyyy.MM.dd')}
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-black/10 pl-4">
                  <p className="text-[10px] font-black text-black/40 uppercase mb-1">Gross Liability</p>
                  <p className="text-lg font-black text-[#ce0031]">${currentInvoice.amount || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center justify-between mb-8 border-b-2 border-black border-dashed pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter">Liquidation History</h2>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                    {currentInvoice.payments?.length ?? 0} Recorded Transitions
                  </p>
                </div>
              </div>
            </div>

            {!currentInvoice.payments || currentInvoice.payments.length === 0 ? (
              <div className="text-center py-12 border-4 border-black border-dashed bg-black/5">
                <CreditCard className="w-16 h-16 text-black/10 mx-auto mb-4" />
                <p className="text-xs font-black text-black/40 uppercase tracking-widest">No Fiscal Transitions Detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentInvoice.payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-6 border-2 border-black bg-white hover:bg-black/5 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 border-2 border-black bg-green-400 flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                        <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-black uppercase tracking-widest mb-1">
                          {payment.method?.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                          T_STAMP: {safeFormatDate(payment.date, 'yyyy.MM.dd // HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-black group-hover:text-[#ce0031] transition-colors">${payment.amount}</p>
                      <p className="text-[8px] font-black text-black/30 uppercase tracking-[0.2em]">
                        Transition {index + 1} OF {currentInvoice.payments.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-8">
          {/* Payment Progress Card */}
          <div className="bg-black border-4 border-black p-8 shadow-[8px_8px_0_0_#ce0031] text-white">
            <h3 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-white/20 pb-4 italic">Fiscal Status Report</h3>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Liquidity Absorbed</span>
                <span className="text-sm font-black text-green-400">${currentInvoice.paidAmount || 0}</span>
              </div>
              <div className="w-full bg-white/10 h-6 border-2 border-white/20 p-1 mb-4">
                <div
                  className="bg-[#ce0031] h-full transition-all duration-1000 ease-out border-r-2 border-black"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Saturation</span>
                <span className="text-xl font-black text-[#ce0031]">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase">Total Liability</span>
                <span className="text-sm font-black">${currentInvoice.amount || currentInvoice.totalAmount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase">Total Liquidated</span>
                <span className="text-sm font-black text-green-400">${currentInvoice.paidAmount || 0}</span>
              </div>
              <div className="flex items-center justify-between pt-6 border-t-2 border-white border-dashed">
                <span className="text-sm font-black uppercase tracking-[0.2em]">Residual</span>
                <span className="text-3xl font-black text-[#ce0031] tracking-tighter">
                  ${currentInvoice.remainingAmount || currentInvoice.amount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods Info */}
          <div className="bg-white border-4 border-black p-6">
            <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6 border-l-4 border-[#ce0031] pl-3">Sanctioned Channels</h3>
            <div className="space-y-4">
              {[
                'CREDIT_DEBIT_DIRECT',
                'PAYPAL_OPERATIONAL',
                'WIRE_TRANSFER_BUREAU'
              ].map(method => (
                <div key={method} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black" />
                  <span className="text-[10px] font-black text-black uppercase tracking-[0.1em]">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md bg-white border-8 border-black rounded-none shadow-none p-0 overflow-hidden">
          <div className="bg-black text-white p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">LIQUIDATION_INITIALIZE</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                Authorize fiscal resource transfer to central vault
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-black">Resource Quantum ($)</Label>
              <div className="relative group">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="h-16 bg-black/5 border-4 border-black rounded-none text-2xl font-black focus-visible:ring-0 focus-visible:bg-white transition-all pl-12"
                  min="1"
                  max={currentInvoice.remainingAmount || currentInvoice.amount || 0}
                  step="0.01"
                />
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black group-focus-within:text-[#ce0031] transition-colors" />
              </div>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                AVAILABLE_RESIDUAL: <span className="text-black font-black">${currentInvoice.remainingAmount || currentInvoice.amount || 0}</span>
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="method" className="text-xs font-black uppercase tracking-widest text-black">Transfer Channel</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-14 bg-black/5 border-4 border-black rounded-none font-black uppercase tracking-widest focus:ring-0">
                  <SelectValue placeholder="SELECT_CHANNEL" />
                </SelectTrigger>
                <SelectContent className="bg-white border-4 border-black rounded-none p-0">
                  <SelectItem value="credit_card" className="font-black uppercase tracking-widest p-4 focus:bg-black focus:text-white rounded-none">CREDIT_CARD</SelectItem>
                  <SelectItem value="debit_card" className="font-black uppercase tracking-widest p-4 focus:bg-black focus:text-white rounded-none">DEBIT_CARD</SelectItem>
                  <SelectItem value="paypal" className="font-black uppercase tracking-widest p-4 focus:bg-black focus:text-white rounded-none">PAYPAL</SelectItem>
                  <SelectItem value="bank_transfer" className="font-black uppercase tracking-widest p-4 focus:bg-black focus:text-white rounded-none">BANK_TRANSFER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <button
              onClick={() => setShowPaymentDialog(false)}
              className="p-6 bg-black/10 text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
              disabled={isProcessing}
            >
              ABORT
            </button>
            <button
              onClick={handleMakePayment}
              className="p-6 bg-[#ce0031] text-white font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  PROCESSING
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  AUTHORIZE
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


