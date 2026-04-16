import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookings } from '#/services/bookings.service'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/admin/bookings')({
  component: AdminBookingsPage,
})

function AdminBookingsPage() {
  const [bookings] = useState(getBookings())

  const getStatusColor = (status: typeof bookings[number]['status']) => {
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

  const getPaymentStatusColor = (status: typeof bookings[number]['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-[var(--palm)] text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'refunded':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          Booking Management
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          View and manage all bookings
        </p>
      </div>

      <Card className="island-shell">
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
              <p className="text-lg text-[var(--sea-ink-soft)]">
                No bookings found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const room = getRoomById(booking.roomId)
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          {room?.name || `Room ${booking.roomId}`}
                        </TableCell>
                        <TableCell>{booking.customerId}</TableCell>
                        <TableCell>
                          {format(new Date(booking.checkIn), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell className="font-semibold">
                          ${booking.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(booking.status)}
                            variant="secondary"
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentStatusColor(booking.paymentStatus)}
                            variant="secondary"
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/bookings/${booking.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
