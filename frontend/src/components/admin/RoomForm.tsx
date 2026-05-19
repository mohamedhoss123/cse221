import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { X, Plus } from 'lucide-react'
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
      <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6">
          <CardTitle className="text-2xl font-black text-[var(--expressive-primary)]">
            {room ? 'Update Room Intelligence' : 'Register New Asset'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Room Designation</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Executive Panorama Suite"
              required
              className="h-12 border-2 border-[var(--expressive-secondary)] rounded-xl focus-visible:ring-0 focus-visible:border-[var(--expressive-primary)] transition-colors font-bold"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Classification</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                className="flex h-12 w-full rounded-xl border-2 border-[var(--expressive-secondary)] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:border-[var(--expressive-primary)] transition-colors"
                required
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Tariff (USD / Cycle)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[var(--expressive-primary)]">$</span>
                <Input
                  id="price"
                  type="number"
                  min="50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  className="h-12 pl-8 border-2 border-[var(--expressive-secondary)] rounded-xl focus-visible:ring-0 focus-visible:border-[var(--expressive-primary)] transition-colors font-black text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Occupancy Limit</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
                className="h-12 border-2 border-[var(--expressive-secondary)] rounded-xl focus-visible:ring-0 focus-visible:border-[var(--expressive-primary)] transition-colors font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Operational Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                className="flex h-12 w-full rounded-xl border-2 border-[var(--expressive-secondary)] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:border-[var(--expressive-primary)] transition-colors"
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
          <div className="space-y-4 pt-4 border-t-2 border-[var(--expressive-secondary)]/5">
            <div className="flex items-center justify-between">
              <Label htmlFor="images" className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Visual Assets</Label>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {images.length + pendingImages.length} Files Attached
              </span>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[var(--expressive-background)] border-2 border-dashed border-[var(--expressive-secondary)] rounded-xl group-hover:bg-blue-50/50 group-hover:border-[var(--expressive-primary)] transition-all flex flex-col items-center justify-center p-8 pointer-events-none">
                <div className="h-12 w-12 rounded-full bg-white border-2 border-[var(--expressive-secondary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-[var(--expressive-primary)]" />
                </div>
                <p className="font-bold text-sm text-[var(--expressive-text)]">Select Images to Upload</p>
                <p className="text-[10px] font-bold text-[var(--expressive-text-muted)] mt-1 uppercase tracking-tighter">PNG, JPG up to 10MB</p>
              </div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={room?.id ? handleImageUpload : handleImageSelect}
                disabled={uploading}
                className="h-40 opacity-0 cursor-pointer"
              />
            </div>

            {uploading && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 font-bold text-sm animate-pulse">
                <div className="h-2 w-2 rounded-full bg-amber-600 animate-bounce" />
                Synchronizing assets with server...
              </div>
            )}

            {/* Combined Image Grid */}
            {(pendingImages.length > 0 || images.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {/* Pending Images */}
                {pendingImages.map((img, index) => (
                  <div key={`pending-${index}`} className="relative group aspect-square rounded-xl border-2 border-[var(--expressive-secondary)] overflow-hidden shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                    <img
                      src={img.preview}
                      alt={`Pending upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => handleRemovePendingImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {index === 0 && images.length === 0 && (
                      <Badge className="absolute top-2 left-2 bg-[var(--expressive-primary)] text-white border-none text-[8px] font-black uppercase">Primary</Badge>
                    )}
                    <div className="absolute bottom-2 right-2 bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">Pending</div>
                  </div>
                ))}

                {/* Existing Images */}
                {images.map((image) => (
                  <div key={image.id} className="relative group aspect-square rounded-xl border-2 border-[var(--expressive-secondary)] overflow-hidden shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                    <img
                      src={image.url}
                      alt={`Room image`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white border-none text-[8px] font-black uppercase">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-[var(--expressive-primary)] hover:bg-[var(--expressive-primary-hover)] text-white h-12 rounded-xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-black uppercase tracking-widest"
            >
              {uploading ? 'Processing...' : (room ? 'Commit Changes' : 'Initialize Room')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin/rooms' })}
              disabled={uploading}
              className="sm:w-32 h-12 rounded-xl border-2 border-[var(--expressive-secondary)] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              Abort
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )

}