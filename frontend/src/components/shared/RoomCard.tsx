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
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[var(--expressive-background)] to-[var(--expressive-primary)]/20">
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="mb-2">
              <span className="text-3xl font-bold text-white">{room.type.charAt(0).toUpperCase()}</span>
            </div>
            <div className="mb-4">
              <p className="text-xl font-semibold text-white">{room.type} Room</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-white mb-1">Price</p>
              <p className="text-2xl font-bold text-white">${formatPrice(room.price)}</p>
              <p className="text-xs text-white/60">per night</p>
            </div>
          </div>
        </div>
        <Badge className="absolute right-3 top-3 capitalize bg-[var(--expressive-accent)] text-white hover:bg-[var(--expressive-primary)] border-none shadow-sm">
          {room.type}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1 text-xl font-semibold text-[var(--expressive-primary)]">
          {room.type} Room
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
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
        >
          <Link to="/customer/rooms/$id" params={{ id: room.id }}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
