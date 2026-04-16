import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { MapPin, Users, Star } from 'lucide-react'
import type { Room } from '#/types/room.types'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const formatPrice = (price: number) => `$${price}/night`

  return (
    <Card className="feature-card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        {!room.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="secondary" className="text-sm">Currently Unavailable</Badge>
          </div>
        )}
        <Badge className="absolute right-2 top-2 capitalize">
          {room.type}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{room.name}</CardTitle>
        <CardDescription className="line-clamp-2">{room.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-[var(--sea-ink-soft)]">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-[var(--lagoon-deep)]">
          {formatPrice(room.price)}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" disabled={!room.isAvailable}>
          <Link to={`/customer/rooms/${room.id}`}>
            {room.isAvailable ? 'View Details' : 'Unavailable'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
