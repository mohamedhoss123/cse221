import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getBookingById } from '#/services/bookings.service'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 rounded-full bg-red-50 p-6 text-red-500 border-2 border-red-200 shadow-[4px_4px_0_0_#fecaca]">
          <Calendar className="h-12 w-12" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-[var(--expressive-text)]">
          Record Not Found
        </h1>
        <p className="mb-8 text-[var(--expressive-text-muted)] font-bold">
          The requested booking identifier does not exist in our secure archives.
        </p>
        <Button asChild className="bg-[var(--expressive-primary)] hover:bg-[var(--expressive-primary-hover)] text-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 transition-all font-black uppercase tracking-widest px-8 h-12">
          <Link to="/admin/bookings">Return to Center</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[3px_3px_0_0_#bbf7d0]">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[3px_3px_0_0_#fcd34d]">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
            {status}
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[3px_3px_0_0_#fecaca]">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[3px_3px_0_0_#bfdbfe]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="icon" asChild className="h-10 w-10 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 transition-all bg-white">
              <Link to="/admin/bookings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--expressive-text-muted)] bg-[var(--expressive-surface)] px-2 py-1 rounded border border-[var(--expressive-secondary)]/10">
              Archive / Reservations
            </span>
          </div>
          <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
            File <span className="font-semibold text-[var(--expressive-primary)]">#{booking.id.substring(0, 8)}</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] text-lg">
            Detailed manifest for client <span className="text-[var(--expressive-text)] font-bold">{booking.customerName}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {getStatusBadge(booking.status)}
          <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">
            Record Created: {booking.createdAt && !isNaN(new Date(booking.createdAt).getTime()) ? format(new Date(booking.createdAt), 'MMM d, yyyy | p') : 'Unknown'}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule & Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-12 sm:grid-cols-2">
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[var(--expressive-primary)] rounded-full opacity-20" />
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-3">Check-In Protocol</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)]">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[var(--expressive-text)]">
                        {booking.checkIn && !isNaN(new Date(booking.checkIn).getTime()) ? format(new Date(booking.checkIn), 'MMM d, yyyy') : 'N/A'}
                      </p>
                      <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">Earliest Entry: 2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-red-400 rounded-full opacity-20" />
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-3">Check-Out Deadline</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-red-500">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[var(--expressive-text)]">
                        {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime()) ? format(new Date(booking.checkOut), 'MMM d, yyyy') : 'N/A'}
                      </p>
                      <p className="text-xs font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">Final Vacancy: 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t-2 border-[var(--expressive-secondary)]/5 flex flex-wrap gap-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">Guest Count</p>
                    <p className="text-lg font-black text-[var(--expressive-text)]">{booking.guests} Total Pax</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">Configuration</p>
                    <p className="text-lg font-black text-[var(--expressive-text)] capitalize">{room.name} ({room.type})</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-2">Total Transaction Value</p>
                  <p className="text-5xl font-black text-[var(--expressive-primary)] tracking-tighter">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(booking.totalAmount || 0)}
                  </p>
                </div>
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex justify-between md:justify-end items-center gap-6 p-4 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]">
                    <span className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Settlement Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${booking.paymentStatus === 'paid'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                      {booking.paymentStatus || 'UNPAID'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Info */}
        <div className="space-y-8">
          <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
              <CardTitle className="text-xl font-black text-[var(--expressive-primary)] flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                <div className="h-12 w-12 rounded-full bg-[var(--expressive-primary)] text-white flex items-center justify-center font-black text-xl">
                  {booking.customerName?.[0] || 'G'}
                </div>
                <div>
                  <p className="text-lg font-black text-[var(--expressive-text)]">{booking.customerName}</p>
                  <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">Verified Identity</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {booking.customerEmail && (
                  <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="h-8 w-8 rounded bg-white border border-[var(--expressive-secondary)]/10 flex items-center justify-center group-hover:border-blue-200">
                      <Mail className="h-4 w-4 text-[var(--expressive-primary)]" />
                    </div>
                    <span className="text-sm font-bold text-[var(--expressive-text)]">{booking.customerEmail}</span>
                  </div>
                )}
                {booking.customerPhone && (
                  <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="h-8 w-8 rounded bg-white border border-[var(--expressive-secondary)]/10 flex items-center justify-center group-hover:border-blue-200">
                      <Phone className="h-4 w-4 text-[var(--expressive-primary)]" />
                    </div>
                    <span className="text-sm font-bold text-[var(--expressive-text)]">{booking.customerPhone}</span>
                  </div>
                )}
                {booking.visitorAddress && (
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="h-8 w-8 shrink-0 rounded bg-white border border-[var(--expressive-secondary)]/10 flex items-center justify-center group-hover:border-blue-200 mt-0.5">
                      <MapPin className="h-4 w-4 text-[var(--expressive-primary)]" />
                    </div>
                    <span className="text-sm font-bold text-[var(--expressive-text)]">{booking.visitorAddress}</span>
                  </div>
                )}
              </div>

              {(booking.visitorGender || booking.visitorBirthdate) && (
                <div className="mt-4 pt-6 border-t-2 border-[var(--expressive-secondary)]/5 grid grid-cols-2 gap-4">
                  {booking.visitorGender && (
                    <div>
                      <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">Gender</p>
                      <p className="text-sm font-black text-[var(--expressive-text)] capitalize">{booking.visitorGender}</p>
                    </div>
                  )}
                  {booking.visitorBirthdate && (
                    <div>
                      <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">Birthdate</p>
                      <p className="text-sm font-black text-[var(--expressive-text)]">
                        {booking.visitorBirthdate && !isNaN(new Date(booking.visitorBirthdate).getTime()) ? format(new Date(booking.visitorBirthdate), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--expressive-secondary)] bg-[var(--expressive-surface)] text-center">
            <p className="text-xs font-black text-[var(--expressive-text-muted)] uppercase tracking-[0.2em] mb-4">Operations Center</p>
            <div className="grid gap-3">
              <Button className="w-full bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest h-11">
                Issue Invoice
              </Button>
              <Button variant="outline" className="w-full border-2 border-red-200 text-red-500 font-black uppercase tracking-widest h-11 hover:bg-red-50">
                Void Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
