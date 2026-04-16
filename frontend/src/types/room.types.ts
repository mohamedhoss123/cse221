export type RoomType = 'standard' | 'deluxe' | 'suite' | 'penthouse'

export interface Room {
  id: string
  name: string
  type: RoomType
  price: number
  description: string
  amenities: string[]
  images: string[]
  capacity: number
  available: boolean
}

export interface RoomFilters {
  type?: RoomType
  minPrice?: number
  maxPrice?: number
  capacity?: number
  available?: boolean
  amenities?: string[]
}
