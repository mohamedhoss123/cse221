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
    <div className="gap-12 lg:grid lg:grid-cols-3">
      {/* Booking Form */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-black text-white text-[8px] font-black uppercase tracking-widest">
            SECURE_ENTRY_INTERFACE
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-black text-white">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black uppercase tracking-tighter">Temporal Parameters</h2>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest italic">Check-in / Check-out Windows</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="checkIn" className="text-xs font-black uppercase tracking-widest">Entry Date</Label>
                <div className="relative group">
                  <Input
                    id="checkIn"
                    type="date"
                    min={today}
                    value={bookingData.checkIn}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkIn: e.target.value })
                    }
                    className="h-16 bg-black/5 border-4 border-black rounded-none text-lg font-black focus-visible:ring-0 focus-visible:bg-white transition-all pl-12"
                    required
                  />
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black group-focus-within:text-[#ce0031] transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="checkOut" className="text-xs font-black uppercase tracking-widest">Exit Date</Label>
                <div className="relative group">
                  <Input
                    id="checkOut"
                    type="date"
                    min={getMinCheckOutDate(bookingData.checkIn) || today}
                    value={bookingData.checkOut}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkOut: e.target.value })
                    }
                    className="h-16 bg-black/5 border-4 border-black rounded-none text-lg font-black focus-visible:ring-0 focus-visible:bg-white transition-all pl-12"
                    required
                  />
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black group-focus-within:text-[#ce0031] transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="guests" className="text-xs font-black uppercase tracking-widest text-black">Operator Personnel Count</Label>
              <div className="relative group">
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
                  className="h-16 bg-black/5 border-4 border-black rounded-none text-xl font-black focus-visible:ring-0 focus-visible:bg-white transition-all pl-12"
                  required
                />
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black group-focus-within:text-[#ce0031] transition-colors" />
              </div>
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                Unit Threshold: {room.capacity || 10} Authorized Personnel
              </p>
            </div>

            <div className="pt-8 border-t-4 border-black border-dashed">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-[#ce0031] text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black uppercase tracking-tighter">Asset Specification</h3>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{room.type?.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="bg-black/5 p-6 border-2 border-black">
                <p className="text-sm font-black text-black uppercase tracking-widest">{formatRoomTitle(room.type)}</p>
                <div className="mt-2 flex gap-4">
                   <div className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase">Verified_Status</div>
                   <div className="px-2 py-1 bg-black/10 text-black text-[8px] font-black uppercase">Class_{room.type}</div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-16 rounded-none border-4 border-black bg-[#ce0031] text-white text-xl font-black uppercase tracking-[0.2em] shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale" 
              disabled={!isValidDates}
            >
              EXECUTE_RESERVATION
            </Button>
          </form>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <div className="bg-black border-4 border-black p-8 shadow-[8px_8px_0_0_#ce0031] text-white sticky top-24">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/20 pb-4 italic">Fiscal Projection</h3>
          
          <div className="space-y-8">
            <div className="border-l-4 border-[#ce0031] pl-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Target Asset</p>
              <p className="text-lg font-black text-white uppercase">{room.name || formatRoomTitle(room.type)}</p>
            </div>

            <div className="border-l-4 border-white/10 pl-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Unit Valuation (p/n)</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#ce0031]" />
                <p className="text-2xl font-black text-white tracking-tighter">{formatPrice(room.price)}</p>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Duration</span>
                <span className="text-sm font-black">{numberOfNights || 0} CYCLES</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Personnel</span>
                <span className="text-sm font-black">{bookingData.guests} OPERATORS</span>
              </div>
              <div className="flex items-center justify-between pt-8 border-t-2 border-white border-dashed">
                <span className="text-sm font-black uppercase tracking-[0.2em]">Quantum_Total</span>
                <span className="text-4xl font-black text-[#ce0031] tracking-tighter">${totalAmount}</span>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
              * Reservation initialization requires full fiscal clearance upon manifest generation. Failure to settle liability may result in asset forfeiture.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
