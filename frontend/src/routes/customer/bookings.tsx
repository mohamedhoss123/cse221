import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookings, cancelBooking } from '#/services/bookings.service'
import { toast } from 'sonner'
import {
  Calendar,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Hourglass,
  X,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
export const Route = createFileRoute('/customer/bookings')({
  loader: async () => {
    const initialBookings = await getBookings()
    return { initialBookings }
  },
  component: MyBookingsPage,
})

function MyBookingsPage() {
  const { initialBookings } = Route.useLoaderData()
  const [bookings, setBookings] = useState(initialBookings)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return

    try {
      await cancelBooking(bookingToCancel)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToCancel ? { ...b, status: 'cancelled' as const } : b
        )
      )
      toast.success('Reservation voided successfully')
    } catch (error) {
      toast.error('Failed to void reservation')
    } finally {
      setCancelDialogOpen(false)
      setBookingToCancel(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[2px_2px_0_0_#fef3c7]">
            <Hourglass className="h-3 w-3 mr-1.5" />
            Awaiting
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            Fulfilled
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <XCircle className="h-3 w-3 mr-1.5" />
            Voided
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  const BookingCard = ({ booking, showActions = true }: { booking: any, showActions?: boolean }) => (
    <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all">
      <CardContent className="p-0">
        <div className="p-6 border-b-2 border-[var(--expressive-secondary)]/5">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-[var(--expressive-primary)]/10 flex items-center justify-center text-[var(--expressive-primary)] border-2 border-[var(--expressive-primary)]/20 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            {getStatusBadge(booking.status)}
          </div>
          <h3 className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
            {booking.roomName}
          </h3>
          <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-2">
            Record Reference: #{booking.id.substring(0, 8)}
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x-2 divide-[var(--expressive-secondary)]/5">
          <div className="p-6">
            <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 leading-none text-center">Check-In</p>
            <p className="text-sm font-black text-[var(--expressive-text)] tracking-tight text-center">
              {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="p-6">
            <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 leading-none text-center">Check-Out</p>
            <p className="text-sm font-black text-[var(--expressive-text)] tracking-tight text-center">
              {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="p-6 bg-[var(--expressive-background)]/30 border-t-2 border-[var(--expressive-secondary)]/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--expressive-text-muted)]" />
            <span className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">{booking.guests} GUESTS</span>
          </div>
          {showActions && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelClick(booking.id)}
              className="h-8 px-4 border-2 border-red-500 shadow-[2px_2px_0_0_#ef4444] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#ef4444] transition-all bg-white text-red-600 font-black text-[10px] uppercase tracking-widest"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-secondary)] text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-[2px_2px_0_0_#ce0031]">
          <Calendar className="h-3 w-3" />
          Active Manifest
        </div>
        <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
          My <span className="text-[var(--expressive-primary)]">Reservations</span>
        </h1>
        <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
          Track and manage your operational headquarters during your stay.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-32 text-center bg-white border-4 border-dashed border-[var(--expressive-secondary)]/20 rounded-3xl">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-[var(--expressive-primary)]/10 border-2 border-[var(--expressive-primary)]/20 mb-6">
            <Calendar className="h-16 w-16 text-[var(--expressive-primary)] opacity-30" />
          </div>
          <h3 className="text-2xl font-black text-[var(--expressive-primary)] uppercase tracking-tighter mb-2">Manifest Empty</h3>
          <p className="text-[var(--expressive-text-muted)] font-bold mb-8">No active reservations detected in your profile telemetry.</p>
          <Button
            asChild
            className="h-14 px-8 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all"
          >
            <Link to="/customer/rooms">Initialize Scan</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showActions={booking.status === 'pending' || booking.status === 'confirmed'}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-4 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_#000000] rounded-2xl">
          <DialogHeader className="space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-center uppercase tracking-tighter">Void Reservation?</DialogTitle>
            <DialogDescription className="text-center font-bold text-[var(--expressive-text-muted)]">
              You are about to terminate this operational manifest. This action is irreversible and may trigger fiscal penalties according to the directive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="flex-1 h-12 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 transition-all font-black uppercase text-xs tracking-widest bg-white"
            >
              Maintain Entry
            </Button>
            <Button
              onClick={handleCancelConfirm}
              className="flex-1 h-12 bg-red-600 text-white font-black uppercase tracking-widest text-xs border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 transition-all"
            >
              Terminate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

