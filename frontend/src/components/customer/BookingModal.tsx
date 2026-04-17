import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { CalendarIcon, Users, DollarSign, Check, X, Loader2 } from 'lucide-react'
import { useAuth } from '#/stores/auth.store'
import { createBooking, checkRoomAvailability } from '#/services/bookings.service'
import { useNavigate } from '@tanstack/react-router'
import type { Room } from '#/types/room.types'

interface BookingModalProps {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BookingData {
  checkIn: string
  checkOut: string
  guests: number
}

export function BookingModal({ room, open, onOpenChange }: BookingModalProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
  })
  const [totalNights, setTotalNights] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setBookingData({
        checkIn: '',
        checkOut: '',
        guests: 1,
      })
      setTotalNights(0)
      setTotalAmount(0)
      setError(null)
    }
  }, [open])

  // Calculate total nights and amount
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn)
      const checkOutDate = new Date(bookingData.checkOut)
      const diffTime = checkOutDate.getTime() - checkInDate.getTime()
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (nights > 0) {
        setTotalNights(nights)
        setTotalAmount(nights * room.price)

        // Check room availability
        checkAvailability()
      } else {
        setTotalNights(0)
        setTotalAmount(0)
        setIsAvailable(null)
      }
    } else {
      setTotalNights(0)
      setTotalAmount(0)
      setIsAvailable(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.checkIn, bookingData.checkOut, room.price])

  const checkAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setIsAvailable(null)
      return
    }

    const checkInDate = new Date(bookingData.checkIn)
    const checkOutDate = new Date(bookingData.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today || checkOutDate <= checkInDate) {
      setIsAvailable(null)
      return
    }

    setIsCheckingAvailability(true)
    try {
      const availability = await checkRoomAvailability(
        room.id,
        bookingData.checkIn,
        bookingData.checkOut
      )
      setIsAvailable(availability.available)
      if (!availability.available) {
        setError(`Room is not available for the selected dates. ${availability.conflictingBookings} conflicting booking(s) found.`)
      } else {
        setError(null)
      }
    } catch (err: any) {
      console.error('Failed to check availability:', err)
      setIsAvailable(null)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select both check-in and check-out dates')
      return
    }

    const checkInDate = new Date(bookingData.checkIn)
    const checkOutDate = new Date(bookingData.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      setError('Check-in date cannot be in the past')
      return
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date')
      return
    }

    if (totalNights === 0) {
      setError('Invalid date range')
      return
    }

    setIsSubmitting(true)

    try {
      if (!user?.id) {
        setError('You must be logged in to make a booking')
        return
      }

      const booking = await createBooking({
        roomId: room.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalAmount,
      })

      // Close modal and navigate to booking details
      onOpenChange(false)
      navigate({ to: '/customer/bookings/$id', params: { id: booking.id } })
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = bookingData.checkIn || today

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Book {room.type} Room</DialogTitle>
          <DialogDescription>
            Select your dates and confirm your booking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="checkOut"
                  type="date"
                  min={minCheckOut}
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
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
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
          </div>

          <Separator />

          <div className="space-y-3 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price per night</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{room.price}</span>
              </div>
            </div>

            {totalNights > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Number of nights</span>
                  <span className="font-medium">{totalNights}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total amount</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-[var(--expressive-primary)]" />
                    <span className="text-xl font-bold text-[var(--expressive-primary)]">
                      {totalAmount}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Availability Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Availability</span>
                  <div className="flex items-center gap-2">
                    {isCheckingAvailability ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Checking...</span>
                      </div>
                    ) : isAvailable === true ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Available</span>
                      </div>
                    ) : isAvailable === false ? (
                      <div className="flex items-center gap-1 text-destructive">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">Not Available</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || totalAmount === 0 || isAvailable === false || isCheckingAvailability}
              className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)]"
            >
              {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
