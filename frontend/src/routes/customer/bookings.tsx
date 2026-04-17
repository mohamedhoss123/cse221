import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookings, cancelBooking } from '#/services/bookings.service'
import { toast } from 'sonner'
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  Hourglass,
  X,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

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

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  )
  const completedBookings = bookings.filter((b) => b.status === 'completed')
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled')

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
      toast.success('Booking cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel booking')
    } finally {
      setCancelDialogOpen(false)
      setBookingToCancel(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        icon: CheckCircle2,
        label: 'Confirmed',
        className: 'bg-green-100 text-[var(--expressive-text)] border-green-200',
      },
      pending: {
        icon: Hourglass,
        label: 'Pending',
        className: 'bg-amber-100 text-[var(--expressive-text)] border-amber-200',
      },
      completed: {
        icon: CheckCircle2,
        label: 'Completed',
        className: 'bg-blue-100 text-[var(--expressive-text)] border-blue-200',
      },
      cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        className: 'bg-red-100 text-[var(--expressive-primary)] border-red-200',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    )
  }

  const BookingCard = ({ booking, showActions = true }: { booking: any, showActions?: boolean }) => (
    <div className="bg-[var(--expressive-surface)] rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">{booking.roomName}</h3>
            {getStatusBadge(booking.status)}
          </div>
          <p className="text-sm text-[var(--expressive-text)]">Booking #{booking.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-[var(--expressive-text)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--expressive-text)] mb-0.5">Check-in</p>
            <p className="text-sm font-medium text-[var(--expressive-primary)]">
              {new Date(booking.checkIn).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-[var(--expressive-text)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--expressive-text)] mb-0.5">Check-out</p>
            <p className="text-sm font-medium text-[var(--expressive-primary)]">
              {new Date(booking.checkOut).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[var(--expressive-text)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--expressive-text)] mb-0.5">Guests</p>
            <p className="text-sm font-medium text-[var(--expressive-primary)]">{booking.guests}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-[var(--expressive-text)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--expressive-text)] mb-0.5">Total</p>
            <p className="text-sm font-semibold text-[var(--expressive-primary)]">${booking.totalPrice}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (booking.status === 'pending' || booking.status === 'confirmed') && (
        <div className="flex gap-3 pt-4 border-t border-[var(--expressive-secondary)] mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
            onClick={() => window.location.href = `/customer/bookings/${booking.id}`}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-[var(--expressive-surface)] border-2 border-[var(--expressive-primary)] text-[var(--expressive-primary)] shadow-[4px_4px_0_0_var(--expressive-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-primary)] transition-all font-semibold hover:bg-[var(--expressive-background)]"
            onClick={() => handleCancelClick(booking.id)}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
          My <span className="font-semibold text-[var(--expressive-primary)]">Bookings</span>
        </h1>
        <p className="text-[var(--expressive-text)]">
          Manage and track all your reservations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--expressive-text)]">{upcomingBookings.length}</p>
              <p className="text-sm text-[var(--expressive-text)]">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--expressive-text)]">{completedBookings.length}</p>
              <p className="text-sm text-[var(--expressive-text)]">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--expressive-background)] to-white rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--expressive-background)] flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--expressive-text)]">{cancelledBookings.length}</p>
              <p className="text-sm text-[var(--expressive-text)]">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] p-1">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[var(--expressive-primary)] data-[state=active]:text-white">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[var(--expressive-primary)] data-[state=active]:text-white">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-[var(--expressive-primary)] data-[state=active]:text-white">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="bg-[var(--expressive-surface)] rounded-2xl p-12 text-center border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[var(--expressive-text)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--expressive-primary)] mb-2">No upcoming bookings</h3>
              <p className="text-[var(--expressive-text)] mb-6">
                Start exploring rooms and book your next stay
              </p>
              <Button
                className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
                onClick={() => window.location.href = '/customer/rooms'}
              >
                Browse Rooms
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length === 0 ? (
            <div className="bg-[var(--expressive-surface)] rounded-2xl p-12 text-center border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[var(--expressive-text)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--expressive-primary)] mb-2">No completed bookings</h3>
              <p className="text-[var(--expressive-text)]">
                Your completed bookings will appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <div className="bg-[var(--expressive-surface)] rounded-2xl p-12 text-center border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-[var(--expressive-text)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--expressive-primary)] mb-2">No cancelled bookings</h3>
              <p className="text-[var(--expressive-text)]">
                Cancelled bookings will appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              Refund policies may apply.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="bg-[var(--expressive-surface)] text-[var(--expressive-text)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleCancelConfirm}
              className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-red-500 shadow-[4px_4px_0_0_#ef4444] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ef4444] transition-all font-semibold"
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
