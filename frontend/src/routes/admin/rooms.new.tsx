import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createRoom } from '#/services/rooms.service'
import RoomForm from '#/components/admin/RoomForm'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/rooms/new')({
  component: NewRoomPage,
})

function NewRoomPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Omit<Room, 'id'>) => {
    setIsSubmitting(true)
    try {
      await createRoom(data)
      toast.success('Room created successfully')
      navigate({ to: '/admin/rooms' })
    } catch (error) {
      toast.error('Failed to create room')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/admin/rooms' })}
          className="text-sm text-[var(--lagoon-deep)] hover:underline"
        >
          ← Back to Rooms
        </button>
      </div>

      <div className="mb-6">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
          Create New Room
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          Add a new room to the hotel inventory
        </p>
      </div>

      <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}

// Import Room type
import type { Room } from '#/types/room.types'
