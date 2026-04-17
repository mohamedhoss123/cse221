import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { Checkbox } from '#/components/ui/checkbox'
import type { Room, RoomType } from '#/types/room.types'

interface RoomFormProps {
  room?: Room
  onSubmit: (data: Omit<Room, 'id'>) => Promise<void>
  isSubmitting?: boolean
}

const roomTypes: { value: RoomType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'penthouse', label: 'Penthouse' },
]

const availableAmenities = [
  'WiFi',
  'TV',
  'Air Conditioning',
  'Mini Bar',
  'Ocean View',
  'Pool Access',
  'Balcony',
  'Kitchenette',
  'Living Room',
  'Dining Area',
  'Bathtub',
  'Jacuzzi',
  'Private Terrace',
  'Panoramic View',
  'Butler Service',
  'Room Service',
  'King Bed',
  'Queen Bed',
]

export default function RoomForm({ room, onSubmit, isSubmitting = false }: RoomFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || ('standard' as RoomType),
    price: room?.price || 100,
    description: room?.description || '',
    capacity: room?.capacity || 2,
    isAvailable: room?.isAvailable ?? true,
    amenities: room?.amenities || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="island-shell">
        <CardHeader>
          <CardTitle>{room ? 'Edit Room' : 'Create New Room'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Deluxe Ocean View Suite"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Room Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                className="flex h-10 w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
                required
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                type="number"
                min="50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the room..."
              rows={3}
              required
            />
          </div>
 
          <Separator />
 
          <div>
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityToggle(amenity, checked as boolean)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
 
          <Separator />
 
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked as boolean })}
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">
              Available for booking
            </Label>
          </div>
 
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin/rooms' })}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
