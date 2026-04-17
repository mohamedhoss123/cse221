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
import { AlertTriangle, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { refundPayment } from '#/services/payments.service'

interface RefundDialogProps {
  paymentId: string
  amount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RefundDialog({
  paymentId,
  amount,
  open,
  onOpenChange,
}: RefundDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRefund = async () => {
    setIsProcessing(true)
    try {
      await refundPayment(paymentId)
      toast.success('Refund processed successfully')
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      toast.error('Failed to process refund')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-300 shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Process Refund</DialogTitle>
          <DialogDescription>
            Confirm refund for payment {paymentId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6">
            <DollarSign className="mb-2 h-8 w-8 text-slate-500" />
            <p className="text-sm font-medium text-slate-600">Refund Amount</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">${amount}</p>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-orange-900">Warning</p>
              <p className="text-sm text-orange-800">
                This will refund ${amount} to the customer. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRefund}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? 'Processing...' : `Refund $${amount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
