import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import RoomGallery from '#/components/shared/RoomGallery'
import { MapPin, Users, Check, X } from 'lucide-react'

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
    // Auth disabled - allow booking without login
    navigate({ to: '/customer/bookings/new', search: { roomId: room.id } })
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
                  {room.name}
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

          <RoomGallery images={room.images} name={room.name} />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-[var(--expressive-primary)]">
              About This Room
            </h2>
            <p className="text-[var(--expressive-text)]">{room.description}</p>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-[var(--expressive-primary)]">
              Amenities
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[var(--expressive-primary)]" />
                  <span className="text-[var(--expressive-text)]">{amenity}</span>
                </div>
              ))}
            </div>
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
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-[var(--expressive-text)]" />
                <span className="text-[var(--expressive-text)]">
                  Up to {room.capacity} guests
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-5 w-5 text-[var(--expressive-text)]" />
                <span className="text-[var(--expressive-text)]">
                  Hotel Main Building
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4">
              {room.available ? (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Check className="h-5 w-5" />
                  <span>Available for your dates</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <X className="h-5 w-5" />
                  <span>Currently unavailable</span>
                </div>
              )}
            </div>

            <Button
              className="w-full bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
              size="lg"
              onClick={handleBookNow}
              disabled={!room.available}
            >
              {room.available ? 'Book Now' : 'Unavailable'}
            </Button>

            {/* Auth disabled
            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-[var(--expressive-text)]">
                Login required to book
              </p>
            )}
            */}
          </div>
        </div>
      </div>
    </div>
  )
}
