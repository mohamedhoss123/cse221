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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-12 border-l-8 border-black pl-8">
        <button
          onClick={() => navigate({ to: '/customer/rooms' })}
          className="group mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ABORT_INITIALIZATION
        </button>
        <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
          RESERVATION <span className="text-[#ce0031]">INITIALIZATION</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-black/60 uppercase tracking-[0.2em]">
            Protocol 44.B: Secure Asset Acquisition
          </p>
          <div className="h-0.5 flex-1 bg-black/10" />
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 bg-[#ce0031]" />
            ))}
          </div>
        </div>
      </div>

      <BookingForm room={room} />
    </div>
  )
}

// Import components
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
