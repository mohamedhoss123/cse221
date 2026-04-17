import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Users, Star } from 'lucide-react'
import type { Room } from '#/types/room.types'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const formatPrice = (price: number) => `$${price}`

  return (
    <Card className="overflow-hidden border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white">
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.images[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80'}
          alt={room.name}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
        />
        {!room.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <Badge variant="secondary" className="text-sm bg-white/90 text-[var(--expressive-primary)] border-none font-semibold px-3 py-1">
              Currently Unavailable
            </Badge>
          </div>
        )}
        <Badge className="absolute right-3 top-3 capitalize bg-[var(--expressive-accent)] text-white hover:bg-[var(--expressive-primary)] border-none shadow-sm">
          {room.type}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1 text-xl font-semibold text-[var(--expressive-primary)]">{room.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-[#000]">{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <Users className="h-4 w-4 text-[#000]" />
            <span className="font-medium">{room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 text-amber-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-[var(--expressive-primary)]">
            {formatPrice(room.price)}
          </span>
          <span className="text-sm text-[#000] mb-1">/night</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          className="w-full bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:opacity-90 transition-opacity shadow-sm" 
          disabled={!room.available}
        >
          <Link to="/customer/rooms/$id" params={{ id: room.id }}>
            {room.available ? 'View Details' : 'Unavailable'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
