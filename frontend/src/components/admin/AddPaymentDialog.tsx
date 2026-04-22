import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
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
import { CreditCard, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { createPaymentForInvoice } from '#/services/invoices.service'

interface AddPaymentDialogProps {
  invoiceId: string
  remainingAmount: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddPaymentDialog({
  invoiceId,
  remainingAmount,
  open,
  onOpenChange,
  onSuccess,
}: AddPaymentDialogProps) {
  const [amount, setAmount] = useState(remainingAmount.toString())
  const [method, setMethod] = useState<string>('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (paymentAmount > remainingAmount) {
      toast.error(`Amount cannot exceed remaining balance of $${remainingAmount}`)
      return
    }

    setIsProcessing(true)
    try {
      await createPaymentForInvoice(invoiceId, paymentAmount, method)
      toast.success('Payment added successfully')
      onOpenChange(false)
      onSuccess?.()
      window.location.reload()
    } catch (error) {
      toast.error('Failed to add payment')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFillRemaining = () => {
    setAmount(remainingAmount.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-300 shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Payment</DialogTitle>
          <DialogDescription>
            Record a payment for invoice {invoiceId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remainingAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillRemaining}
                className="whitespace-nowrap"
              >
                Fill Remaining
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Remaining balance: <span className="font-semibold">${remainingAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon
                  return (
                    <SelectItem key={pm.value} value={pm.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{pm.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <DollarSign className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-blue-900">Payment Summary</p>
              <p className="text-sm text-blue-800">
                Recording a payment of ${parseFloat(amount || '0').toFixed(2)} via {method.replace('_', ' ')}.
                {parseFloat(amount || '0') === remainingAmount && ' This will fully pay the invoice.'}
              </p>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? 'Processing...' : `Add Payment $${parseFloat(amount || '0').toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
