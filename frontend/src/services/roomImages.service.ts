import BaseService from './base.service'
import apiClient from '#/lib/api-client'
import { handleApiCall } from '#/lib/api/errorHandler'
import type { RoomImage } from '../types/room.types'

export async function uploadRoomImage(
  roomId: string,
  file: File,
  isPrimary = false
): Promise<RoomImage> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('isPrimary', isPrimary.toString())

  // Use apiClient directly for FormData uploads to avoid Content-Type: application/json
  return handleApiCall<RoomImage>(
    apiClient.post(`/room-images/room/${roomId}`, formData, {
      headers: {
        // Don't set Content-Type, let Axios set it automatically with boundary
        'Content-Type': undefined,
      },
    })
  )
}

export async function deleteRoomImage(imageId: string): Promise<void> {
  return BaseService.delete(`/room-images/image/${imageId}`)
}

export async function setPrimaryImage(imageId: string): Promise<RoomImage> {
  return BaseService.patch<RoomImage>(`/room-images/image/${imageId}/set-primary`)
}

export async function getRoomImages(roomId: string): Promise<RoomImage[]> {
  return BaseService.get<RoomImage[]>(`/room-images/room/${roomId}`)
}
