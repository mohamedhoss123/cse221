import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Calendar, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import type { Booking } from '#/types/booking.types'

interface BookingCardProps {
  booking: Booking
  showActions?: boolean
  onCancel?: (id: string) => void
}

export default function BookingCard({ booking, showActions = true, onCancel }: BookingCardProps) {
  const getStatusColor = (status: Booking['status']) => {
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

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
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
    <Card className="feature-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Booking {booking.id}</CardTitle>
          <Badge className={getStatusColor(booking.status)} variant="secondary">
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-[var(--sea-ink-soft)]" />
          <span className="text-[var(--sea-ink-soft)]">
            {format(new Date(booking.checkIn), 'MMM d, yyyy')} -{' '}
            {format(new Date(booking.checkOut), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-[var(--sea-ink-soft)]" />
          <span className="text-[var(--sea-ink-soft)]">{booking.guests} guests</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-[var(--sea-ink-soft)]" />
          <span className="text-lg font-semibold text-[var(--sea-ink)]">
            ${booking.totalAmount}
          </span>
          <Badge className={getPaymentStatusColor(booking.paymentStatus)} variant="secondary">
            {booking.paymentStatus}
          </Badge>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/customer/bookings/${booking.id}`}>View Details</Link>
          </Button>
          {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
