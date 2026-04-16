import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getRooms, deleteRoom } from '#/services/rooms.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Plus, Pencil, Trash2, Bed } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/rooms')({
  component: AdminRoomsPage,
})

function AdminRoomsPage() {
  const [rooms, setRooms] = useState(getRooms())

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      await deleteRoom(roomId)
      setRooms((prev) => prev.filter((r) => r.id !== roomId))
      toast.success('Room deleted successfully')
    } catch (error) {
      toast.error('Failed to delete room')
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
            Room Management
          </h1>
          <p className="text-[var(--sea-ink-soft)]">
            Manage hotel rooms and pricing
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Link>
        </Button>
      </div>

      <Card className="island-shell">
        <CardContent className="p-0">
          {rooms.length === 0 ? (
            <div className="py-12 text-center">
              <Bed className="mx-auto mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
              <p className="text-lg text-[var(--sea-ink-soft)]">
                No rooms available
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={room.images[0]}
                            alt={room.name}
                            className="h-12 w-16 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-[var(--sea-ink)]">
                              {room.name}
                            </p>
                            <p className="text-sm text-[var(--sea-ink-soft)]">
                              ID: {room.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {room.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${room.price}/night
                      </TableCell>
                      <TableCell>{room.capacity} guests</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={room.isAvailable ? 'bg-[var(--palm)] text-white' : ''}
                        >
                          {room.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/rooms/${room.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(room.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
