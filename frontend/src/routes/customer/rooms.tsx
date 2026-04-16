import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import RoomCard from '#/components/shared/RoomCard'
import type { RoomFilters as RoomFiltersType } from '#/types/room.types'
import { getRooms } from '#/services/rooms.service'
import {
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

export const Route = createFileRoute('/customer/rooms')({
  component: RoomsPage,
})

function RoomsPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<RoomFiltersType>({})

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    const data = await getRooms(filters)
    setRooms(data)
    setIsLoading(false)
  }

  const handleFiltersChange = async (newFilters: RoomFiltersType) => {
    setFilters(newFilters)
    setIsLoading(true)
    const filteredRooms = await getRooms(newFilters)
    setRooms(filteredRooms)
    setIsLoading(false)
  }

  const clearFilters = () => {
    const emptyFilters: RoomFiltersType = {}
    setFilters(emptyFilters)
    loadRooms()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-light text-slate-900 mb-2">
              Browse <span className="font-semibold text-amber-600">Rooms</span>
            </h1>
            <p className="text-slate-600">
              Discover your perfect stay from our curated collection
            </p>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">{rooms.length}</span> rooms found
          </p>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Room Type */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Room Type</Label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        type: value === 'all' ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Price Range</Label>
                  <Select
                    value={filters.maxPrice ? `${filters.maxPrice}` : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        maxPrice: value === 'all' ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="200">Under $200</SelectItem>
                      <SelectItem value="400">Under $400</SelectItem>
                      <SelectItem value="600">Under $600</SelectItem>
                      <SelectItem value="1000">Under $1000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Guests</Label>
                  <Select
                    value={filters.capacity ? `${filters.capacity}` : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        capacity: value === 'all' ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Capacity</SelectItem>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Availability</Label>
                  <Select
                    value={filters.available ? (filters.available === true ? 'available' : 'all') : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        available: value === 'available' ? true : undefined,
                      })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="All rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      <SelectItem value="available">Available Now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {Object.keys(filters).length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-3">Active Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.type && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          Type: {filters.type}
                          <button
                            onClick={() => handleFiltersChange({ ...filters, type: undefined })}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.maxPrice && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          Under ${filters.maxPrice}
                          <button
                            onClick={() => handleFiltersChange({ ...filters, maxPrice: undefined })}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.capacity && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {filters.capacity}+ guests
                          <button
                            onClick={() => handleFiltersChange({ ...filters, capacity: undefined })}
                            className="hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Room Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <SlidersHorizontal className="w-8 h-8 text-amber-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading rooms...</h3>
              <p className="text-slate-600">
                Please wait while we find the perfect rooms for you
              </p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <SlidersHorizontal className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No rooms found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-amber-600 to-amber-700">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
