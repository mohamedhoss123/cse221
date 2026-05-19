import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
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
  ChevronRight,
  ShieldCheck,
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
  
  // Credit Card State for 3D View
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    
    if (value.length >= 3) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`)
    } else {
      setExpiry(value)
    }
  }

  const validateExpiry = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false
    const [month, year] = value.split('/').map(Number)
    if (month < 1 || month > 12) return false
    
    const now = new Date()
    const currentYear = now.getFullYear() % 100
    const currentMonth = now.getMonth() + 1
    
    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    
    return true
  }

  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(
    invoice ? { ...invoice, payments: invoice.payments || [] } : null
  )

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
        <div className="bg-white border-4 border-[var(--expressive-primary)] p-12 text-center shadow-[8px_8px_0_0_var(--expressive-primary)]">
          <FileText className="w-16 h-16 text-[var(--expressive-primary)]/20 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[var(--expressive-text)] uppercase tracking-tighter mb-2">Invoice Not Found</h1>
          <p className="text-[var(--expressive-text-muted)] font-bold uppercase text-xs tracking-widest mb-6">Manifest missing from terminal records.</p>
          <Button
            onClick={() => navigate({ to: '/customer/payments' })}
            className="h-12 bg-[var(--expressive-primary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-primary)] shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Ledger
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

    // Validation
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

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('VALIDATION_ERROR: INVALID_CARD_NUMBER (16 DIGITS REQUIRED)')
        return
      }
      if (!cardName || cardName.length < 3) {
        toast.error('VALIDATION_ERROR: VALID_CARDHOLDER_NAME_REQUIRED')
        return
      }
      if (!validateExpiry(expiry)) {
        toast.error('VALIDATION_ERROR: INVALID_OR_EXPIRED_DATE (MM/YY)')
        return
      }
      if (cvc.length < 3) {
        toast.error('VALIDATION_ERROR: INVALID_CVC')
        return
      }
    }

    setIsProcessing(true)

    try {
      const updatedInvoice = await createPaymentForInvoice(
        invoiceId,
        amount,
        paymentMethod as 'credit_card' | 'debit_card' | 'bank_transfer'
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-4 border-[var(--expressive-secondary)] pb-8">
        <div>
          <button
            onClick={() => navigate({ to: '/customer/payments' })}
            className="group mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--expressive-text-muted)] hover:text-[var(--expressive-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_LEDGER
          </button>
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-5xl font-black text-[var(--expressive-text)] uppercase tracking-tighter leading-none">
              FISCAL_MFST <span className="text-[var(--expressive-primary)]">#{currentInvoice.id}</span>
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">
            BKG_REF: {currentInvoice.reservationId} // GENERATED: {safeFormatDate(currentInvoice.date, 'yyyy.MM.dd')}
          </p>
        </div>
        <div className="mt-8 md:mt-0">
          {currentInvoice.status !== 'paid' && (
            <Button
              className="rounded-none h-14 px-8 border-4 border-[var(--expressive-secondary)] bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
              onClick={() => setShowPaymentDialog(true)}
            >
              <Plus className="w-5 h-5 mr-3" strokeWidth={3} />
              INITIATE_LIQUIDATION
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white border-4 border-[var(--expressive-secondary)] p-8 shadow-[8px_8px_0_0_var(--expressive-secondary)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-[var(--expressive-secondary)] text-white text-[8px] font-black uppercase tracking-widest">
              SECURE_INTEL_FEED
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[var(--expressive-secondary)] text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--expressive-text)] uppercase tracking-tighter">Asset Specification</h2>
                <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest italic">Core Reservation Telemetry</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-[var(--expressive-primary)]/10 pl-4">
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase mb-1">Asset Class</p>
                  <p className="text-lg font-black text-[var(--expressive-text)] uppercase">
                    {currentInvoice.roomType ? `${currentInvoice.roomType.replace('_', ' ')}` : 'UNKNOWN'}
                  </p>
                </div>
                <div className="border-l-4 border-[var(--expressive-primary)]/10 pl-4">
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase mb-1">Reservation Key</p>
                  <p className="text-lg font-black text-[var(--expressive-text)]">{currentInvoice.reservationId || 'NULL'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-[var(--expressive-primary)]/10 pl-4">
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase mb-1">Operator Identity</p>
                  <p className="text-lg font-black text-[var(--expressive-text)] uppercase">{currentInvoice.customerName || 'UNIDENTIFIED'}</p>
                </div>
                <div className="border-l-4 border-[var(--expressive-primary)]/10 pl-4">
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase mb-1">Manifest Genesis</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--expressive-primary)]" />
                    <p className="text-lg font-black text-[var(--expressive-text)]">
                      {safeFormatDate(currentInvoice.date, 'yyyy.MM.dd')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-[var(--expressive-secondary)] p-8 shadow-[8px_8px_0_0_var(--expressive-secondary)]">
            <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--expressive-secondary)] border-dashed pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--expressive-secondary)] text-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--expressive-text)] uppercase tracking-tighter">Liquidation History</h2>
                  <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">
                    {currentInvoice.payments?.length ?? 0} Recorded Transitions
                  </p>
                </div>
              </div>
            </div>

            {!currentInvoice.payments || currentInvoice.payments.length === 0 ? (
              <div className="text-center py-12 border-4 border-[var(--expressive-secondary)] border-dashed bg-[var(--expressive-secondary)]/5">
                <CreditCard className="w-16 h-16 text-[var(--expressive-secondary)]/10 mx-auto mb-4" />
                <p className="text-xs font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">No Fiscal Transitions Detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentInvoice.payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-6 border-2 border-[var(--expressive-secondary)] bg-white hover:bg-[var(--expressive-secondary)]/5 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 border-2 border-[var(--expressive-secondary)] bg-green-400 flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                        <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[var(--expressive-text)] uppercase tracking-widest mb-1">
                          {payment.method?.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest italic">
                          T_STAMP: {safeFormatDate(payment.date, 'yyyy.MM.dd // HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[var(--expressive-text)] group-hover:text-[var(--expressive-primary)] transition-colors">${payment.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-[var(--expressive-secondary)] border-4 border-[var(--expressive-secondary)] p-8 shadow-[8px_8px_0_0_var(--expressive-primary)] text-white">
            <h3 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-white/20 pb-4 italic">Fiscal Status Report</h3>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Liquidity Absorbed</span>
                <span className="text-sm font-black text-green-400">${currentInvoice.paidAmount || 0}</span>
              </div>
              <div className="w-full bg-white/10 h-6 border-2 border-white/20 p-1 mb-4">
                <div
                  className="bg-[var(--expressive-primary)] h-full transition-all duration-1000 ease-out border-r-2 border-black"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t-2 border-white border-dashed">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-[0.2em]">Residual</span>
                <span className="text-3xl font-black text-[var(--expressive-primary)] tracking-tighter">
                  ${currentInvoice.remainingAmount || currentInvoice.amount || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-[var(--expressive-secondary)] p-6">
            <h3 className="text-xs font-black text-[var(--expressive-text)] uppercase tracking-widest mb-6 border-l-4 border-[var(--expressive-primary)] pl-3">Security Protocols</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest leading-relaxed">
                  Encryption: AES-256-GCM. All fiscal transitions are routed through secure administrative channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-xl bg-white border-8 border-[var(--expressive-secondary)] rounded-none shadow-none p-0 overflow-hidden">
          <div className="bg-[var(--expressive-secondary)] text-white p-6 border-b-4 border-black">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">LIQUIDATION_TERMINAL</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                Resource Transfer Authorization Interface
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8 bg-white">
            {/* 3D Card Display */}
            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <div className="perspective-1000 h-56 w-full max-w-md mx-auto mb-10 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative h-full w-full transition-transform duration-700 preserve-3d shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#1e3a8a] p-8 backface-hidden border-2 border-white/20 flex flex-col justify-between shadow-inner">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
                        <div className="w-full h-0.5 bg-black/10 rotate-45 translate-y-2" />
                        <div className="w-full h-0.5 bg-black/10 rotate-45" />
                        <div className="w-full h-0.5 bg-black/10 rotate-45 -translate-y-2" />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-white/40 tracking-[0.3em] mb-1 uppercase">Secure_Node</div>
                        <ShieldCheck className="w-10 h-10 text-white opacity-80" />
                      </div>
                    </div>
                    
                    <div className="text-white font-mono text-xl tracking-[0.1em] mb-4 text-center bg-black/20 py-3 rounded whitespace-nowrap overflow-hidden border border-white/10">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">OPERATOR_ID</div>
                        <div className="text-white font-black uppercase text-base tracking-tighter truncate">
                          {cardName || 'IDENT_UNAVAILABLE'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">VALID_THRU</div>
                        <div className="text-white font-black text-base tracking-widest">
                          {expiry || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#172554] p-8 rotate-y-180 backface-hidden border-2 border-white/10 flex flex-col justify-center">
                    <div className="absolute top-8 left-0 h-12 w-full bg-black/90 shadow-lg" />
                    <div className="mt-8">
                      <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 text-right px-2">AUTH_TOKEN (CVC)</div>
                      <div className="bg-white/90 h-12 flex items-center justify-end px-6 rounded shadow-inner">
                        <span className="text-black font-mono text-xl font-bold tracking-[0.3em] italic">{cvc || '•••'}</span>
                      </div>
                      <div className="mt-4 flex gap-1 justify-end opacity-20">
                         {[1,2,3,4].map(i => <div key={i} className="w-8 h-1 bg-white" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text)]">Fiscal Quantum</Label>
                <div className="relative group">
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="h-14 bg-black/5 border-4 border-[var(--expressive-secondary)] rounded-none font-black text-xl pl-12 focus:bg-white text-[var(--expressive-text)]"
                  />
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--expressive-text)]" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text)]">Transfer Channel</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-14 bg-black/5 border-4 border-[var(--expressive-secondary)] rounded-none font-black uppercase tracking-widest text-[var(--expressive-text)]">
                    <SelectValue placeholder="CHOOSE_METHOD" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-4 border-[var(--expressive-secondary)] rounded-none">
                    <SelectItem value="credit_card" className="font-black uppercase tracking-widest p-4 text-[var(--expressive-text)] hover:bg-[var(--expressive-secondary)] hover:text-white rounded-none">CREDIT_CARD</SelectItem>
                    <SelectItem value="debit_card" className="font-black uppercase tracking-widest p-4 text-[var(--expressive-text)] hover:bg-[var(--expressive-secondary)] hover:text-white rounded-none">DEBIT_CARD</SelectItem>
                    <SelectItem value="bank_transfer" className="font-black uppercase tracking-widest p-4 text-[var(--expressive-text)] hover:bg-[var(--expressive-secondary)] hover:text-white rounded-none">BANK_TRANSFER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t-4 border-[var(--expressive-secondary)] border-dashed">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[var(--expressive-text)]">Card Number</Label>
                  <Input 
                    value={cardNumber} 
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="h-10 border-2 border-[var(--expressive-secondary)] rounded-none font-mono text-[var(--expressive-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[var(--expressive-text)]">Cardholder Name</Label>
                  <Input 
                    value={cardName} 
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="IDENT_NAME"
                    className="h-10 border-2 border-[var(--expressive-secondary)] rounded-none font-black uppercase text-[10px] text-[var(--expressive-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[var(--expressive-text)]">Expiry Date (MM/YY)</Label>
                  <Input 
                    value={expiry} 
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="h-10 border-2 border-[var(--expressive-secondary)] rounded-none font-mono text-[var(--expressive-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[var(--expressive-text)]">CVC</Label>
                  <Input 
                    value={cvc} 
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="•••"
                    className="h-10 border-2 border-[var(--expressive-secondary)] rounded-none font-mono text-[var(--expressive-text)]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2">
            <button
              onClick={() => setShowPaymentDialog(false)}
              className="p-6 bg-black/5 text-[var(--expressive-text)] font-black uppercase tracking-widest hover:bg-[var(--expressive-secondary)] hover:text-white transition-all"
            >
              ABORT
            </button>
            <button
              onClick={handleMakePayment}
              disabled={isProcessing}
              className="p-6 bg-[var(--expressive-primary)] text-white font-black uppercase tracking-widest hover:bg-[var(--expressive-secondary)] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <Clock className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              AUTHORIZE_TRANSFER
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  )
}
