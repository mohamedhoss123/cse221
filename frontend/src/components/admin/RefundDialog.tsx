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
import { AlertTriangle } from 'lucide-react'
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
      window.location.reload() // Refresh to show updated status
    } catch (error) {
      toast.error('Failed to process refund')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Confirm refund for payment {paymentId}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-800">Confirm Refund</p>
            <p className="text-sm text-yellow-700">
              You are about to refund ${amount}. This action cannot be undone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRefund}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Refund $${amount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
