import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { getRoomById } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import RoomGallery from '#/components/shared/RoomGallery'
import { Calendar, MapPin, Users, Check, X } from 'lucide-react'

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
  const { isAuthenticated } = useAuth()

  if (!room) {
    return (
      <div className="page-wrap px-4 py-16 text-center">
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)]">
          Room Not Found
        </h1>
        <Button onClick={() => navigate({ to: '/customer/rooms' })}>
          Back to Rooms
        </Button>
      </div>
    )
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/login' })
      return
    }
    navigate({ to: '/customer/bookings/new', search: { roomId: room.id } })
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/customer/rooms' })}
          className="text-sm text-[var(--lagoon-deep)] hover:underline"
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
                <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
                  {room.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--lagoon-deep)]">
                  ${room.price}
                </p>
                <p className="text-sm text-[var(--sea-ink-soft)]">per night</p>
              </div>
            </div>
          </div>

          <RoomGallery images={room.images} name={room.name} />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-[var(--sea-ink)]">
              About This Room
            </h2>
            <p className="text-[var(--sea-ink-soft)]">{room.description}</p>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-[var(--sea-ink)]">
              Amenities
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[var(--lagoon-deep)]" />
                  <span className="text-[var(--sea-ink-soft)]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="island-shell sticky top-24 rounded-2xl p-6">
            <div className="mb-4">
              <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                ${room.price}
              </p>
              <p className="text-sm text-[var(--sea-ink-soft)]">per night</p>
            </div>

            <Separator className="my-4" />

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-[var(--sea-ink-soft)]" />
                <span className="text-[var(--sea-ink-soft)]">
                  Up to {room.capacity} guests
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-5 w-5 text-[var(--sea-ink-soft)]" />
                <span className="text-[var(--sea-ink-soft)]">
                  Hotel Main Building
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4">
              {room.isAvailable ? (
                <div className="flex items-center gap-2 text-sm text-[var(--palm)]">
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
              className="w-full"
              size="lg"
              onClick={handleBookNow}
              disabled={!room.isAvailable}
            >
              {room.isAvailable ? 'Book Now' : 'Unavailable'}
            </Button>

            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-[var(--sea-ink-soft)]">
                Login required to book
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
