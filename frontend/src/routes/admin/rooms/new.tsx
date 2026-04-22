import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import RoomForm from '#/components/admin/RoomForm'

export const Route = createFileRoute('/admin/rooms/new')({
  component: NewRoomPage,
})

function NewRoomPage() {
  const navigate = useNavigate()

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

      <RoomForm />
    </div>
  )
}
