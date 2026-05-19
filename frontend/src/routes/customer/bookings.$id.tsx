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

import { ShieldCheck, Zap, Activity, Info } from 'lucide-react'

function BookingDetailsPage() {
  const { booking } = Route.useLoaderData()
  const [room] = useState(() =>
    booking ? getRoomById(booking.roomId) : undefined
  )

  if (!booking || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--expressive-background)]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-white border-2 border-[var(--expressive-secondary)] mb-6 shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <Activity className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--expressive-primary)] mb-4 uppercase tracking-tighter">
            Manifest Not Found
          </h1>
          <Button asChild className="h-12 px-8 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 transition-all">
            <Link to="/customer/bookings">Return to Manifest</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <ShieldCheck className="h-3.5 w-3.5 mr-2" />
            Verified Manifest
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[2px_2px_0_0_#fef3c7]">
            <Activity className="h-3.5 w-3.5 mr-2 animate-pulse" />
            Sync Awaiting
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <Activity className="h-3.5 w-3.5 mr-2" />
            Manifest Voided
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <ShieldCheck className="h-3.5 w-3.5 mr-2" />
            Manifest Fulfilled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <Button
          variant="outline"
          asChild
          className="h-10 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 transition-all text-[10px] font-black uppercase tracking-widest bg-white"
        >
          <Link to="/customer/bookings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Manifest
          </Link>
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 leading-none">Record Reference</p>
          <p className="text-xl font-black text-[var(--expressive-primary)] tracking-tighter leading-none">#{booking.id.substring(0, 12).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Column: Operational Data */}
        <div className="flex-1 space-y-10 w-full">
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-secondary)] text-white text-[10px] font-black uppercase tracking-widest mb-3">
                  <Zap className="h-3 w-3" />
                  Live Operational Base
                </div>
                <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
                  Reservation <span className="text-[var(--expressive-primary)]">Intelligence</span>
                </h1>
                <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
                  Confirmed operational manifest for your upcoming deployment.
                </p>
              </div>
              <div>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_var(--expressive-secondary)] rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-x-4 divide-[var(--expressive-secondary)]/10 border-b-4 border-[var(--expressive-secondary)]/10">
                  <div className="p-8">
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-2">Check-In Sync</p>
                    <div className="flex items-center gap-3 text-2xl font-black text-[var(--expressive-text)] tracking-tighter">
                      <Calendar className="h-6 w-6 text-[var(--expressive-primary)]" />
                      {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-2">Check-Out Target</p>
                    <div className="flex items-center gap-3 text-2xl font-black text-[var(--expressive-text)] tracking-tighter">
                      <Calendar className="h-6 w-6 text-[var(--expressive-primary)]" />
                      {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[var(--expressive-background)]/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 text-center md:text-left">Throughput Volume</p>
                    <div className="flex items-center gap-2 text-lg font-black uppercase">
                      <Users className="h-5 w-5 text-[var(--expressive-primary)]" />
                      {booking.guests} Authenticated Guests
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 text-right">Operational Unit</p>
                    <p className="text-lg font-black uppercase text-right">{room.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--expressive-secondary)] flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Unit Specs</h2>
              </div>
              <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[var(--expressive-primary)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text)]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--expressive-primary)] flex items-center justify-center text-white">
                  <Info className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Intelligence Note</h2>
              </div>
              <div className="p-6 bg-[var(--expressive-primary)]/5 border-2 border-dashed border-[var(--expressive-primary)]/30 rounded-2xl">
                <p className="text-xs font-bold text-[var(--expressive-text-muted)] italic leading-relaxed">
                  "Ensure your identity credentials are ready for synchronization at the check-in terminal. Operational base access is granted at 14:00 hours on the start date."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Fiscal Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <div className="sticky top-8">
            <Card className="bg-white border-4 border-[var(--expressive-secondary)] shadow-[10px_10px_0_0_var(--expressive-secondary)] rounded-3xl overflow-hidden">
              <CardHeader className="bg-[var(--expressive-primary)] p-6 text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter">Fiscal Ledger</h3>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-1">Settlement Summary</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Total Manifest Yield</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-8 w-8 text-[var(--expressive-primary)]" />
                    <p className="text-5xl font-black text-[var(--expressive-primary)] tracking-tighter">
                      {booking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-[var(--expressive-text-muted)]">Settlement Status</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                      {booking.paymentStatus === 'paid' ? 'SETTLED' : 'OUTSTANDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-[var(--expressive-text-muted)]">Manifest Timestamp</span>
                    <span className="text-xs font-black uppercase">{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <Button className="w-full h-14 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest text-[10px] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all" asChild>
                    <Link to="/customer/complaints" className="flex items-center justify-center gap-2">
                      Initialize Incident Report <Activity className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                <p className="text-[9px] font-black text-center text-[var(--expressive-text-muted)] uppercase tracking-widest italic pt-4">
                  * Official fiscal record. Keep for audit.
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}

