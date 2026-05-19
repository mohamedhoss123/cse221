import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getBookings } from '#/services/bookings.service'
import { getRooms } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Calendar, Search, Eye, DollarSign, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'
import type { Booking } from '#/types/booking.types'
import type { Room } from '#/types/room.types'

export const Route = createFileRoute('/admin/bookings/')({
  component: AdminBookingsPage,
})

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Record<string, Room>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [bookingsData, roomsData] = await Promise.all([
        getBookings(),
        getRooms()
      ])

      const roomsMap = roomsData.reduce((acc, room) => {
        acc[room.id] = room
        return acc
      }, {} as Record<string, Room>)

      setBookings(bookingsData)
      setRooms(roomsMap)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[2px_2px_0_0_#fcd34d]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
            {status}
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5" />
            {status}
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
          Reservation <span className="font-semibold text-[var(--expressive-primary)]">Center</span>
        </h1>
        <p className="text-[var(--expressive-text-muted)] text-lg">
          Track, manage and authorize hotel reservations in real-time.
        </p>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-4">
                <Search className="h-10 w-10 text-[var(--expressive-primary)] animate-pulse" />
              </div>
              <p className="text-[var(--expressive-text-muted)] font-bold text-xl">Accessing reservation logs...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-6">
                <Calendar className="h-16 w-16 text-[var(--expressive-text-muted)] opacity-30" />
              </div>
              <p className="text-2xl font-bold text-[var(--expressive-primary)] mb-2">
                No active reservations
              </p>
              <p className="text-[var(--expressive-text-muted)]">
                Incoming bookings will be listed here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">ID & Date</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Room Configuration</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Guest Info</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Billing</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Stay Period</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Status</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const room = rooms[booking.roomId]
                    return (
                      <TableRow key={booking.id} className="border-b border-[var(--expressive-secondary)]/5 hover:bg-[var(--expressive-background)]/60 transition-colors">
                        <TableCell className="py-6 px-6">
                          <div className="flex flex-col">
                            <span className="font-black text-[var(--expressive-primary)] text-sm mb-1">
                              #{booking.id.substring(0, 8)}
                            </span>
                            <span className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase">
                              Placed {booking.createdAt ? format(new Date(booking.createdAt), 'MMM d, p') : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="font-black text-[var(--expressive-text)]">
                            {room?.name || `Room ${booking.roomId}`}
                          </div>
                          <div className="text-[10px] font-bold text-[var(--expressive-primary)] uppercase tracking-tighter mt-1 bg-[var(--expressive-background)] inline-block px-1.5 py-0.5 rounded border border-[var(--expressive-secondary)]/10">
                            {booking.guests} Guests
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="font-bold text-[var(--expressive-text)] text-sm">
                            {booking.customerName || booking.customerId}
                          </div>
                          <div className="mt-1 flex flex-col gap-0.5 text-[10px] font-bold text-[var(--expressive-text-muted)]">
                            {booking.customerEmail && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3" />
                                <span>{booking.customerEmail}</span>
                              </div>
                            )}
                            {booking.customerPhone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3" />
                                <span>{booking.customerPhone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="font-black text-[var(--expressive-primary)] text-lg">
                            ${booking.totalAmount?.toLocaleString()}
                          </div>

                        </TableCell>
                        <TableCell className="px-6">
                          <div className="text-xs font-black text-[var(--expressive-text)]">
                            {booking.checkIn && !isNaN(new Date(booking.checkIn).getTime()) ? format(new Date(booking.checkIn), 'MMM d') : 'N/A'} - {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime()) ? format(new Date(booking.checkOut), 'MMM d') : 'N/A'}
                          </div>
                          <div className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-tighter">
                            {booking.checkIn && booking.checkOut && !isNaN(new Date(booking.checkIn).getTime()) && !isNaN(new Date(booking.checkOut).getTime()) ? `${Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24))} Nights` : ''}
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <Button variant="outline" size="sm" asChild className="h-9 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-white text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] font-black text-[10px] uppercase tracking-widest">
                            {/* @ts-ignore */}
                            <Link to={`/admin/bookings/${booking.id}`}>
                              View File
                            </Link>
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
