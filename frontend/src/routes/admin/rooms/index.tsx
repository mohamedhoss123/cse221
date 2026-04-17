import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getRooms, deleteRoom } from '#/services/rooms.service'
import type { Room } from '#/types/room.types'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Plus, Pencil, Trash2, Bed, Search } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/rooms/')({
  component: AdminRoomsPage,
})

function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    try {
      const data = await getRooms()
      setRooms(data)
    } catch (error) {
      toast.error('Failed to load rooms')
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
            Room <span className="font-semibold text-[var(--expressive-primary)]">Management</span>
          </h1>
          <p className="text-[var(--expressive-text)]">
            Manage hotel rooms, pricing, and availability
          </p>
        </div>
        <Button asChild className="bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold">
          <Link to="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Link>
        </Button>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Search className="mx-auto mb-4 h-8 w-8 text-[var(--expressive-text)] animate-spin" />
              <p className="text-[var(--expressive-text)] font-semibold">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-20 text-center">
              <Bed className="mx-auto mb-4 h-12 w-12 text-[var(--expressive-text)] opacity-50" />
              <p className="text-lg font-bold text-[var(--expressive-primary)] mb-1">
                No rooms found
              </p>
              <p className="text-sm text-[var(--expressive-text)] font-medium">
                Add a new room to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-[var(--expressive-background)]">
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Room Details</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Type</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4">Price/Night</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-bold py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {rooms.map((room) => (
                    <TableRow key={room.id} className="border-b border-[var(--expressive-secondary)]/30 hover:bg-[var(--expressive-background)]/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-20 rounded-xl border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] bg-[var(--expressive-background)] flex items-center justify-center">
                            <Bed className="h-8 w-8 text-[var(--expressive-primary)]" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--expressive-primary)]">
                              {room.type}
                            </p>
                            <p className="text-xs text-[var(--expressive-text)] mt-0.5 font-medium">
                              ID: {room.id || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--expressive-background)] text-[var(--expressive-text)] capitalize border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                          {room.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-[var(--expressive-primary)] text-lg">
                          ${room.price}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild className="border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-[var(--expressive-surface)] text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] font-bold">
                            <Link to="/admin/rooms/$id/edit" params={{ id: room.id || '' }}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(room.id)}
                            className="border-2 border-red-300 shadow-[2px_2px_0_0_#fca5a5] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#fca5a5] transition-all bg-[var(--expressive-surface)] text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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
