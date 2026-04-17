import { createFileRoute } from '@tanstack/react-router'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { getRoomById } from '#/services/rooms.service'
import BookingForm from '#/components/customer/BookingForm'

export const Route = createFileRoute('/customer/bookings/new')({
  component: NewBookingPage,
})

function NewBookingPage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const roomId = (search as { roomId?: string }).roomId

  const [room] = useState(() => (roomId ? getRoomById(roomId) : undefined))

  useEffect(() => {
    if (!room) {
      navigate({ to: '/customer/rooms' })
    }
  }, [room, navigate])

  if (!room) {
    return null
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/customer/rooms' })}
          className="text-sm text-[var(--expressive-primary)] hover:underline"
        >
          ← Back to Rooms
        </button>
      </div>

      <div className="mb-6">
        <h1 className="font-light text-3xl font-bold text-[var(--expressive-primary)]">
          Book Your Stay
        </h1>
        <p className="text-[#000]">
          Complete the form below to reserve your room
        </p>
      </div>

      <BookingForm room={room} />
    </div>
  )
}

// Import useState and useEffect
import { useState, useEffect } from 'react'
