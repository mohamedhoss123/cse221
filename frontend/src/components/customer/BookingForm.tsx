import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { CalendarIcon, Users, DollarSign } from 'lucide-react'
import { useBookingCalculation, getTodayDate, getMinCheckOutDate } from '#/hooks/useBookingCalculation'
import { formatRoomTitle, formatPrice } from '#/lib/utils/formatters'
import type { Room } from '#/types/room.types'

interface BookingFormProps {
  room: Room
}

interface BookingData {
  checkIn: string
  checkOut: string
  guests: number
}

export default function BookingForm({ room }: BookingFormProps) {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
  })

  const { numberOfNights, totalAmount, isValidDates } = useBookingCalculation(
    bookingData,
    room.price
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidDates) return

    // Navigate to booking confirmation
    navigate({
      to: '/customer/bookings/success',
      search: {
        roomId: room.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests.toString(),
        totalAmount: totalAmount.toString(),
      },
    })
  }

  const today = getTodayDate()

  return (
    <div className="gap-8 lg:grid lg:grid-cols-3">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <Card className="island-shell">
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="checkIn"
                      type="date"
                      min={today}
                      value={bookingData.checkIn}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, checkIn: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                    <Input
                      id="checkOut"
                      type="date"
                      min={getMinCheckOutDate(bookingData.checkIn) || today}
                      value={bookingData.checkOut}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, checkOut: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={room.capacity || 10}
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guests: parseInt(e.target.value) || 1,
                      })
                    }
                    className="pl-10"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                  Maximum capacity: {room.capacity || 10} guests
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold text-[var(--sea-ink)]">Room Details</h3>
                <div className="rounded-lg bg-[var(--foam)] p-4">
                  <p className="font-medium text-[var(--sea-ink)]">{formatRoomTitle(room.type)}</p>
                  <p className="text-sm text-[var(--sea-ink-soft)]">{room.type}</p>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!isValidDates}>
                Confirm Booking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="island-shell sticky top-24">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[var(--sea-ink-soft)]">Room</p>
              <p className="font-medium text-[var(--sea-ink)]">{room.name || formatRoomTitle(room.type)}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-[var(--sea-ink-soft)]">Price per night</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-[var(--sea-ink)]" />
                <p className="font-medium text-[var(--sea-ink)]">{formatPrice(room.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
