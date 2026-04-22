import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { BookingModal } from '#/components/customer/BookingModal'

export const Route = createFileRoute('/customer/rooms/$id')({
  component: RoomDetailsPage,
  loader: async ({ params }) => {
    const room = await getRoomById(params.id)
    return { room }
  },
})

function RoomDetailsPage() {
  const { room } = Route.useLoaderData()
  const navigate = useNavigate()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  if (!room) {
    return (
      <div className="p-8 py-16 text-center">
        <h1 className="font-light mb-4 text-3xl font-bold text-[var(--expressive-primary)]">
          Room Not Found
        </h1>
        <Button onClick={() => navigate({ to: '/customer/rooms' })}>
          Back to Rooms
        </Button>
      </div>
    )
  }

  const handleBookNow = () => {
    setIsBookingModalOpen(true)
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

      <div className="gap-8 lg:grid lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge className="mb-2 capitalize">{room.type}</Badge>
                <h1 className="font-light text-3xl font-bold text-[var(--expressive-primary)]">
                  {room.name || `${room.type} Room`}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--expressive-primary)]">
                  ${room.price}
                </p>
                <p className="text-sm text-[var(--expressive-text)]">per night</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {room.images && room.images.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Primary Image */}
                <div className="col-span-2">
                  <img
                    src={`/api${room.images.find(img => img.isPrimary)?.url || room.images[0].url}`}
                    alt={`${room.type} room`}
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Secondary Images */}
                {room.images.slice(1).map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={`/api${image.url}`}
                      alt={`${room.type} room`}
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-8" />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-[var(--expressive-primary)]">
              Room Type
            </h2>
            <p className="text-[var(--expressive-text)]">{room.type}</p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] sticky top-24 rounded-2xl p-6">
            <div className="mb-4">
              <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                ${room.price}
              </p>
              <p className="text-sm text-[var(--expressive-text)]">per night</p>
            </div>

            <Separator className="my-4" />

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-[var(--expressive-text)] font-medium">
                  {room.type} Room
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
              size="lg"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        room={room}
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
      />
    </div>
  )
}
