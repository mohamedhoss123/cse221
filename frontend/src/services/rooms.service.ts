import type { Room, RoomFilters } from '../types/room.types'
import BaseService from './base.service'

export async function getRooms(filters?: RoomFilters): Promise<Room[]> {
  const queryParams: any = {}

  if (filters?.type) {
    queryParams.type = filters.type
  }

  if (filters?.minPrice !== undefined) {
    queryParams.minPrice = filters.minPrice
  }

  if (filters?.maxPrice !== undefined) {
    queryParams.maxPrice = filters.maxPrice
  }

  if (filters?.capacity !== undefined) {
    queryParams.capacity = filters.capacity
  }

  if (filters?.status !== undefined) {
    queryParams.status = filters.status
  }

  if (filters?.available !== undefined) {
    queryParams.available = filters.available
  }

  // Pass params as config object instead of building into URL
  return BaseService.get<Room[]>('/rooms', { params: queryParams })
}

export async function getRoomById(id: string): Promise<Room> {
  return BaseService.get<Room>(`/rooms/${id}`)
}

export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  return BaseService.post<Room>('/rooms', room)
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  return BaseService.put<Room>(`/rooms/${id}`, updates)
}

export async function deleteRoom(id: string): Promise<{ message: string }> {
  return BaseService.delete<{ message: string }>(`/rooms/${id}`)
}
