import { Bed } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'

interface RoomGalleryProps {
  type: string
  description: string
  price: number
  capacity: number
}

export default function RoomGallery({ type, description, price, capacity }: RoomGalleryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="aspect-video w-full">
        <CardContent className="flex h-full items-center justify-center bg-[var(--expressive-background)]">
          <Bed className="h-12 w-12 text-[var(--expressive-primary)]" />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-[var(--expressive-primary)] mb-2">{type} Room</h3>
          <p className="text-[var(--expressive-text)] mb-4">{description}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-[var(--expressive-text-muted)]">Price per night</p>
              <p className="text-2xl font-bold text-[var(--expressive-primary)]">${price}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--expressive-text-muted)]">Capacity</p>
              <p className="text-2xl font-bold text-[var(--expressive-primary)]">{capacity} guests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
