import { mockDelay } from '../lib/api'
import { mockRooms } from '../mock-data/rooms'
import type { Room, RoomFilters } from '../types/room.types'

export async function getRooms(filters?: RoomFilters): Promise<Room[]> {
  await mockDelay()

  let filtered = [...mockRooms]

  if (filters?.type) {
    filtered = filtered.filter(room => room.type === filters.type)
  }

  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter(room => room.price >= filters.minPrice!)
  }

  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter(room => room.price <= filters.maxPrice!)
  }

  if (filters?.capacity !== undefined) {
    filtered = filtered.filter(room => room.capacity >= filters.capacity!)
  }

  if (filters?.available !== undefined) {
    filtered = filtered.filter(room => room.available === filters.available)
  }

  if (filters?.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(room =>
      filters.amenities!.every(amenity => room.amenities.includes(amenity))
    )
  }

  return filtered
}

export async function getRoomById(id: string): Promise<Room | undefined> {
  await mockDelay()
  return mockRooms.find(room => room.id === id)
}

export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  await mockDelay()
  const newRoom: Room = {
    ...room,
    id: `${mockRooms.length + 1}`,
  }
  mockRooms.push(newRoom)
  return newRoom
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined> {
  await mockDelay()
  const index = mockRooms.findIndex(room => room.id === id)
  if (index !== -1) {
    mockRooms[index] = { ...mockRooms[index], ...updates }
    return mockRooms[index]
  }
  return undefined
}

export async function deleteRoom(id: string): Promise<boolean> {
  await mockDelay()
  const index = mockRooms.findIndex(room => room.id === id)
  if (index !== -1) {
    mockRooms.splice(index, 1)
    return true
  }
  return false
}
