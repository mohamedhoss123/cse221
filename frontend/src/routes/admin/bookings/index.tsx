import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getBookings } from '#/services/bookings.service'
import { getRooms } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Calendar, Search, Eye } from 'lucide-react'
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
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 capitalize border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-700 capitalize border-2 border-yellow-200 shadow-[2px_2px_0_0_#fef08a]">
            {status}
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-[var(--expressive-primary)] capitalize border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            {status}
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 capitalize border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--expressive-background)] text-[var(--expressive-text)] capitalize border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
            {status}
          </span>
        )
    }
  }

  const getPaymentStatusBadge = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 capitalize border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-700 capitalize border-2 border-yellow-200 shadow-[2px_2px_0_0_#fef08a]">
            {status}
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 capitalize border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--expressive-background)] text-[var(--expressive-text)] capitalize border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
          Booking <span className="font-semibold text-[var(--expressive-primary)]">Management</span>
        </h1>
        <p className="text-[var(--expressive-text)]">
          View and manage all hotel bookings
        </p>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Search className="mx-auto mb-4 h-8 w-8 text-[var(--expressive-text)] animate-spin" />
              <p className="text-[var(--expressive-text)] font-semibold">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-[var(--expressive-text)] opacity-50" />
              <p className="text-lg font-bold text-[var(--expressive-primary)] mb-1">
                No bookings found
              </p>
              <p className="text-sm text-[var(--expressive-text)] font-medium">
                New bookings will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-[var(--expressive-background)]">
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Booking ID</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Room</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Customer</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Dates</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Amount</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Status</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Payment</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const room = rooms[booking.roomId]
                    return (
                      <TableRow key={booking.id} className="border-b border-[var(--expressive-secondary)]/30 hover:bg-[var(--expressive-background)]/50 transition-colors">
                        <TableCell className="py-4 font-bold text-[var(--expressive-primary)]">
                          {booking.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[var(--expressive-primary)]">
                            {room?.name || `Room ${booking.roomId}`}
                          </div>
                          <div className="text-xs text-[var(--expressive-text)] font-medium">
                            {booking.guests} Guests
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-[var(--expressive-text)]">
                            {booking.customerId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-semibold text-[var(--expressive-text)]">
                            {format(new Date(booking.checkIn), 'MMM d, yy')}
                          </div>
                          <div className="text-xs text-[var(--expressive-text)] opacity-70">
                            to {format(new Date(booking.checkOut), 'MMM d, yy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-[var(--expressive-primary)] text-lg">
                            ${booking.totalAmount}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild className="border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-[var(--expressive-surface)] text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] font-bold">
                            {/* @ts-ignore - The route exists in the system but TypeScript might not know about it dynamically */}
                            <Link to={`/admin/bookings/${booking.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
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


