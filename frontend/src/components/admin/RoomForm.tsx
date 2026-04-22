import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import type { Room, RoomType, RoomStatus, RoomImage } from '#/types/room.types'
import * as roomImagesService from '#/services/roomImages.service'

interface RoomFormProps {
  room?: Room
}

const roomTypes: { value: RoomType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'penthouse', label: 'Penthouse' },
]

const roomStatuses: { value: RoomStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'maintenance', label: 'Maintenance' },
]

export default function RoomForm({ room }: RoomFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || ('standard' as RoomType),
    price: room?.price || 100,
    capacity: room?.capacity || 2,
    status: room?.status || ('available' as RoomStatus),
  })
  const [images, setImages] = useState<RoomImage[]>(room?.images || [])
  const [pendingImages, setPendingImages] = useState<{ file: File; preview: string }[]>([])
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create FormData with room fields
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('type', formData.type)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('capacity', formData.capacity.toString())
    formDataToSend.append('status', formData.status)

    // Add pending images
    for (const { file } of pendingImages) {
      formDataToSend.append('images', file)
    }

    setUploading(true)

    try {
      // Send as FormData
      const response = await fetch(room?.id ? `/api/rooms/${room.id}` : '/api/rooms', {
        method: room?.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          // Don't set Content-Type, let browser set it for FormData
        },
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(room?.id ? 'Room updated successfully' : 'Room created successfully')
        setPendingImages([])
        setTimeout(() => navigate({ to: '/admin/rooms' }), 1500)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to save room')
      }
    } catch (error) {
      console.error('Failed to save room:', error)
      toast.error('Failed to save room')
    } finally {
      setUploading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: { file: File; preview: string }[] = []

    for (const file of Array.from(files)) {
      const preview = URL.createObjectURL(file)
      newImages.push({ file, preview })
    }

    setPendingImages([...pendingImages, ...newImages])
  }

  const handleRemovePendingImage = (index: number) => {
    const newPendingImages = [...pendingImages]
    URL.revokeObjectURL(newPendingImages[index].preview) // Clean up
    newPendingImages.splice(index, 1)
    setPendingImages(newPendingImages)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !room?.id) return

    setUploading(true)
    try {
      const newImages: RoomImage[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const isPrimary = images.length === 0 && pendingImages.length === 0 && i === 0
        const result = await roomImagesService.uploadRoomImage(room.id, file, isPrimary)
        newImages.push(result)
      }
      // Update state with all new images at once
      setImages([...images, ...newImages])
      toast.success(`${files.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      await roomImagesService.deleteRoomImage(imageId)
      setImages(images.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="island-shell">
        <CardHeader>
          <CardTitle>{room ? 'Edit Room' : 'Create New Room'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Deluxe Ocean View"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity (Guests)</Label>
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

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                className="flex h-10 w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
                required
              >
                {roomStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Room Images</Label>
              <p className="text-sm text-slate-500 mb-2">
                {room?.id
                  ? 'Upload multiple images. First image will be marked as primary.'
                  : 'Select images now. They will be uploaded automatically after the room is created.'}
              </p>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={room?.id ? handleImageUpload : handleImageSelect}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-slate-600 mt-2">Uploading...</p>}
            </div>

            {/* Pending Image Previews (for new rooms) */}
            {pendingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Images to upload ({pendingImages.length})</p>
                <div className="grid grid-cols-4 gap-4">
                  {pendingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Pending upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1">Primary</Badge>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => handleRemovePendingImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images (for editing) */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Images ({images.length})</p>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Room image`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      {image.isPrimary && (
                        <Badge className="absolute top-1 left-1">Primary</Badge>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={uploading}>
              {uploading
                ? 'Saving...'
                : room
                ? 'Update Room'
                : 'Create Room'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin/rooms' })}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}