import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Button } from '#/components/ui/button'
import { toast } from 'sonner'
import { updateBookingStatus } from '#/services/bookings.service'
import type { BookingStatus } from '#/types/booking.types'

interface BookingStatusUpdateProps {
  bookingId: string
  currentStatus: BookingStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingStatusUpdate({
  bookingId,
  currentStatus,
  open,
  onOpenChange,
}: BookingStatusUpdateProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateBookingStatus(bookingId, status)
      toast.success('Booking status updated successfully')
      onOpenChange(false)
      window.location.reload() // Refresh to show updated status
    } catch (error) {
      toast.error('Failed to update booking status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Change the status for booking {bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as BookingStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
