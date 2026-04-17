export type RoomType = 'standard' | 'deluxe' | 'suite' | 'penthouse'

export interface Room {
  room_id: string
  type: RoomType
  price: number
  description: string
  capacity: number
  available: boolean
}

export interface RoomFilters {
  type?: RoomType
  minPrice?: number
  maxPrice?: number
  capacity?: number
  available?: boolean
}
