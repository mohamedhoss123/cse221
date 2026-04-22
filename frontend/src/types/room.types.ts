export type RoomType = 'standard' | 'deluxe' | 'suite' | 'penthouse'
export type RoomStatus = 'available' | 'unavailable' | 'maintenance'

export interface Room {
  id: string
  type: RoomType
  price: number
  capacity?: number
  status?: RoomStatus
  name?: string
  images?: RoomImage[]
}

export interface RoomImage {
  id: string
  url: string
  caption?: string
  isPrimary: boolean
  displayOrder: number
}

export interface RoomFilters {
  type?: RoomType
  minPrice?: number
  maxPrice?: number
  capacity?: number
  available?: boolean
  status?: RoomStatus
}
