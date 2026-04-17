import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getRoomById, updateRoom } from '#/services/rooms.service'
import RoomForm from '#/components/admin/RoomForm'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/rooms/$id/edit')({
  component: EditRoomPage,
  loader: async ({ params }) => {
    const room = await getRoomById(params.id)
    return { room }
  },
})

function EditRoomPage() {
  const { room: initialRoom } = Route.useLoaderData()
  const navigate = useNavigate()
  const [room, setRoom] = useState(initialRoom)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!initialRoom) {
      navigate({ to: '/admin/rooms' })
    } else {
      setRoom(initialRoom)
    }
  }, [initialRoom, navigate])

  const handleSubmit = async (data: Omit<Room, 'id'>) => {
    if (!room) return

    setIsSubmitting(true)
    try {
      const updated = await updateRoom(room.id, data)
      if (updated) {
        setRoom(updated)
        toast.success('Room updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update room')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!room) {
    return null
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
          Edit Room
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          Update room information
        </p>
      </div>

      <RoomForm room={room} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}

// Import Room type
import type { Room } from '#/types/room.types'
