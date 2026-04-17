import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookingById } from '#/services/bookings.service'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { ArrowLeft, Calendar, Users, DollarSign, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import BookingStatusUpdate from '#/components/admin/BookingStatusUpdate'

export const Route = createFileRoute('/admin/bookings/id')({
  component: AdminBookingDetailsPage,
  loader: async ({ params }) => {
    const booking = await getBookingById(params.id)
    return { booking }
  },
})

function AdminBookingDetailsPage() {
  const { booking } = Route.useLoaderData()
  const [room] = useState(() => (booking ? getRoomById(booking.roomId) : undefined))
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  if (!booking || !room) {
    return (
      <div className="page-wrap px-4 py-16 text-center">
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)]">
          Booking Not Found
        </h1>
        <Button asChild>
          <Link to="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: typeof booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[var(--palm)] text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'completed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/admin/bookings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Booking Details
          </h1>
          <p className="text-[var(--sea-ink-soft)]">Booking ID: {booking.id}</p>
        </div>
        <Badge className={getStatusColor(booking.status)} variant="secondary">
          {booking.status}
        </Badge>
      </div>

      <div className="gap-6 lg:grid lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="island-shell">
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--sea-ink)]">
                  {room.name}
                </h3>
                <p className="text-sm text-[var(--sea-ink-soft)] capitalize">
                  {room.type}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Check-in</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--sea-ink)]" />
                    <p className="font-medium text-[var(--sea-ink)]">
                      {format(new Date(booking.checkIn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Check-out</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--sea-ink)]" />
                    <p className="font-medium text-[var(--sea-ink)]">
                      {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--sea-ink-soft)]" />
                <span className="text-[var(--sea-ink-soft)]">{booking.guests} guests</span>
              </div>
            </CardContent>
          </Card>

          <Card className="island-shell">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--sea-ink-soft)]">Customer ID: {booking.customerId}</p>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                Booking created: {format(new Date(booking.createdAt), 'MMM d, yyyy • h:mm a')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Payment */}
        <div className="lg:col-span-1">
          <Card className="island-shell sticky top-24">
            <CardHeader>
              <CardTitle>Booking Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Current Status</p>
                <Badge className={getStatusColor(booking.status)} variant="secondary">
                  {booking.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Total Amount</p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-[var(--lagoon-deep)]" />
                  <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                    {booking.totalAmount}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Payment Status</p>
                <Badge variant="secondary">{booking.paymentStatus}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setStatusDialogOpen(true)}
                >
                  Update Status
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/admin/payments`}>View Payment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingStatusUpdate
        bookingId={booking.id}
        currentStatus={booking.status}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  )
}
