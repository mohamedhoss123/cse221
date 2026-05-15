import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookingById } from '#/services/bookings.service'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { ArrowLeft, Calendar, Users, DollarSign, Mail, Phone, MapPin, User } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/admin/bookings/$id')({
  component: AdminBookingDetailsPage,
  loader: async ({ params }) => {
    const booking = await getBookingById(params.id)
    return { booking }
  },
})

function AdminBookingDetailsPage() {
  const { booking } = Route.useLoaderData()
  const [room] = useState(() => (booking ? getRoomById(booking.roomId) : undefined))

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Details */}
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
                    {booking.checkIn ? format(new Date(booking.checkIn), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Check-out</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--sea-ink)]" />
                  <p className="font-medium text-[var(--sea-ink)]">
                    {booking.checkOut ? format(new Date(booking.checkOut), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--sea-ink-soft)]" />
              <span className="text-[var(--sea-ink-soft)]">{booking.guests} guests</span>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-[var(--sea-ink-soft)]">Total Amount</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-[var(--lagoon-deep)]" />
                <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(booking.totalAmount || 0)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-[var(--sea-ink-soft)]">Payment Status</p>
              <Badge variant="secondary">{booking.paymentStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Visitor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[var(--sea-ink-soft)]">Name</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--sea-ink)]" />
                <p className="font-medium text-[var(--sea-ink)]">{booking.customerName}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm text-[var(--sea-ink)]">
              {booking.customerEmail ? (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--sea-ink-soft)]" />
                  <span>{booking.customerEmail}</span>
                </div>
              ) : null}
              {booking.customerPhone ? (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--sea-ink-soft)]" />
                  <span>{booking.customerPhone}</span>
                </div>
              ) : null}
              {booking.visitorAddress ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--sea-ink-soft)]" />
                  <span>{booking.visitorAddress}</span>
                </div>
              ) : null}
              {booking.visitorGender ? (
                <div>
                  <span className="text-[var(--sea-ink-soft)]">Gender: </span>
                  <span className="capitalize">{booking.visitorGender}</span>
                </div>
              ) : null}
              {booking.visitorBirthdate ? (
                <div>
                  <span className="text-[var(--sea-ink-soft)]">Birthdate: </span>
                  <span>{format(new Date(booking.visitorBirthdate), 'MMM d, yyyy')}</span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
