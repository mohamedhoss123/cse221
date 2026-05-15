import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookingById } from '#/services/bookings.service'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { ArrowLeft, Calendar, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/customer/bookings/$id')({
  component: BookingDetailsPage,
  loader: async ({ params }) => {
    const booking = await getBookingById(params.id)
    return { booking }
  },
})

function BookingDetailsPage() {
  const { booking } = Route.useLoaderData()
  const [room] = useState(() =>
    booking ? getRoomById(booking.roomId) : undefined
  )

  if (!booking || !room) {
    return (
      <div className="p-8 py-16 text-center">
        <h1 className="font-light mb-4 text-3xl font-bold text-[var(--expressive-primary)]">
          Booking Not Found
        </h1>
        <Button asChild>
          <Link to="/customer/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: typeof booking.status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-amber-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'completed':
        return 'bg-slate-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/customer/bookings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Bookings
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-light text-3xl font-bold text-[var(--expressive-primary)]">
              Booking Details
            </h1>
            <p className="text-[var(--expressive-text)]">Booking ID: {booking.id}</p>
          </div>
          <Badge className={getStatusColor(booking.status)} variant="secondary">
            {booking.status}
          </Badge>
        </div>
      </div>

      <div className="gap-6 lg:grid lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)]">
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">
                  {room.name}
                </h3>
                <p className="text-sm text-[var(--expressive-text)] capitalize">
                  {room.type}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--expressive-text)]">Check-in</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--expressive-primary)]" />
                    <p className="font-medium text-[var(--expressive-primary)]">
                      {format(new Date(booking.checkIn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--expressive-text)]">Check-out</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--expressive-primary)]" />
                    <p className="font-medium text-[var(--expressive-primary)]">
                      {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--expressive-text)]" />
                <span className="text-[var(--expressive-text)]">{booking.guests} guests</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)]">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--expressive-primary)]" />
                    <span className="text-sm text-[var(--expressive-primary)]">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] sticky top-24">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--expressive-text)]">Total Amount</p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-[var(--expressive-primary)]" />
                  <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                    {booking.totalAmount}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--expressive-text)]">Payment Status</p>
                <Badge variant="secondary">
                  {booking.paymentStatus}
                </Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--expressive-text)]">Booking Date</p>
                <p className="font-medium text-[var(--expressive-primary)]">
                  {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                </p>
              </div>

              {booking.status === 'confirmed' && (
                <>
                  <Separator />
                  <Button className="w-full" asChild>
                    <Link to="/customer/complaints">Report an Issue</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
