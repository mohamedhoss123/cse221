export type RoomType = 'standard' | 'deluxe' | 'suite' | 'penthouse'

export interface Room {
  id: string
  type: RoomType
  price: number
}

export interface RoomFilters {
  type?: RoomType
  minPrice?: number
  maxPrice?: number
  capacity?: number
  available?: boolean
}
