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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
            Room <span className="font-semibold text-[var(--expressive-primary)]">Inventory</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] text-lg">
            Monitor and manage your property's room listings and availability.
          </p>
        </div>
        <Button asChild className="bg-[var(--expressive-primary)] hover:bg-[var(--expressive-primary-hover)] text-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-bold h-12 px-6 rounded-xl">
          <Link to="/admin/rooms/new">
            <Plus className="mr-2 h-5 w-5" />
            Add New Room
          </Link>
        </Button>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-4">
                <Search className="h-10 w-10 text-[var(--expressive-primary)] animate-pulse" />
              </div>
              <p className="text-[var(--expressive-text-muted)] font-bold text-xl">Loading room data...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-6">
                <Bed className="h-16 w-16 text-[var(--expressive-text-muted)] opacity-30" />
              </div>
              <p className="text-2xl font-bold text-[var(--expressive-primary)] mb-2">
                Inventory is empty
              </p>
              <p className="text-[var(--expressive-text-muted)] mb-8">
                Start by adding your first hotel room.
              </p>
              <Button asChild variant="outline" className="border-2 border-[var(--expressive-secondary)] font-bold">
                <Link to="/admin/rooms/new">Create Room</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Room Identity</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Configuration</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6">Pricing</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-xs py-5 px-6 text-right">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id} className="border-b border-[var(--expressive-secondary)]/5 hover:bg-[var(--expressive-background)]/60 transition-colors">
                      <TableCell className="py-6 px-6">
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-24 rounded-xl border-2 border-[var(--expressive-secondary)] shadow-[3px_3px_0_0_var(--expressive-secondary)] bg-[var(--expressive-background)] flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative">
                            {/* Placeholder for image if exists */}
                            <Bed className="h-8 w-8 text-[var(--expressive-primary)]" />
                          </div>
                          <div>
                            <p className="font-black text-[var(--expressive-text)] text-lg">
                              {room.name}
                            </p>
                            <p className="text-xs font-bold text-[var(--expressive-text-muted)] mt-1 flex items-center gap-1">
                              <span className="bg-[var(--expressive-secondary)] text-white px-1.5 py-0.5 rounded text-[10px]">ID</span>
                              {room.id?.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-[var(--expressive-background)] text-[var(--expressive-primary)] uppercase tracking-tighter border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                          {room.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-[var(--expressive-primary)] text-2xl">
                            ${room.price}
                          </span>
                          <span className="text-[10px] font-bold text-[var(--expressive-text-muted)] uppercase tracking-widest">per night</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" size="icon" asChild className="h-10 w-10 border-2 border-[var(--expressive-secondary)] shadow-[3px_3px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--expressive-secondary)] transition-all bg-white text-[var(--expressive-text)] hover:text-[var(--expressive-primary)]">
                            <Link to="/admin/rooms/$id/edit" params={{ id: room.id || '' }}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(room.id)}
                            className="h-10 w-10 border-2 border-red-300 shadow-[3px_3px_0_0_#fca5a5] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#fca5a5] transition-all bg-white text-red-500 hover:text-red-600 hover:bg-red-50"
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
