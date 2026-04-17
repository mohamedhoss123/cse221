import type { Room, RoomFilters } from '../types/room.types'
import { apiClient } from '../lib/api-client'

export async function getRooms(filters?: RoomFilters): Promise<Room[]> {
  try {
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

    if (filters?.available !== undefined) {
      queryParams.available = filters.available ? 1 : 0
    }

    const response = await apiClient.get<Room[]>('/rooms', { 
      params: queryParams 
    })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get rooms')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get rooms')
  }
}

export async function getRoomById(id: string): Promise<Room> {
  try {
    const response = await apiClient.get<Room>(`/rooms/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get room')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get room')
  }
}

export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  try {
    const response = await apiClient.post<Room>('/rooms', room)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create room')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create room')
  }
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  try {
    const response = await apiClient.put<Room>(`/rooms/${id}`, updates)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update room')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update room')
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const response = await apiClient.delete<{ success: boolean }>(`/rooms/${id}`)

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete room')
    }

    return response.success
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete room')
  }
}
