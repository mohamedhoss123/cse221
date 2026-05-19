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
  Calendar as CalendarIcon,
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
import { format } from 'date-fns'

export const Route = createFileRoute('/customer/rooms/')({
  component: RoomsPage,
})

function RoomsPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<RoomFiltersType & { checkIn?: string; checkOut?: string }>({})

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    const data = await getRooms(filters)
    setRooms(data)
    setIsLoading(false)
  }

  const handleFiltersChange = async (newFilters: typeof filters) => {
    setFilters(newFilters)
    setIsLoading(true)
    const filteredRooms = await getRooms(newFilters)
    setRooms(filteredRooms)
    setIsLoading(false)
  }

  const clearFilters = () => {
    const emptyFilters: typeof filters = {}
    setFilters(emptyFilters)
    loadRooms()
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-primary)] text-white text-[10px] font-black uppercase tracking-widest mb-3">
            <CalendarIcon className="h-3 w-3" />
            Inventory Terminal
          </div>
          <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
            Room <span className="text-[var(--expressive-primary)]">Explorer</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
            Scan our premium asset library and select your operational base.
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-6 bg-white border-2 border-[var(--expressive-secondary)] text-[var(--expressive-secondary)] font-black uppercase tracking-widest shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Protocol Filters
          <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Navigation Filters Sidebar */}
        {showFilters && (
          <aside className="w-full lg:w-80 shrink-0 sticky top-8">
            <div className="bg-white border-4 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
              <div className="bg-[var(--expressive-secondary)] p-4 flex items-center justify-between">
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Filter Protocol</h2>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[9px] font-black text-white/70 hover:text-white uppercase tracking-widest underline decoration-white/30 hover:decoration-white transition-all"
                  >
                    Reset System
                  </button>
                )}
              </div>

              <div className="p-6 space-y-8">
                {/* Check-in Date */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Check-in Window</Label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                    <input
                      type="date"
                      value={filters.checkIn || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, checkIn: e.target.value })}
                      min={format(today, 'yyyy-MM-dd')}
                      className="w-full pl-12 pr-4 h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-black text-xs focus:outline-none focus:ring-0 focus:border-[var(--expressive-primary)] transition-all text-[var(--expressive-text)]"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Check-out Target</Label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                    <input
                      type="date"
                      value={filters.checkOut || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, checkOut: e.target.value })}
                      min={filters.checkIn ? format(new Date(filters.checkIn), 'yyyy-MM-dd') : format(tomorrow, 'yyyy-MM-dd')}
                      disabled={!filters.checkIn}
                      className="w-full pl-12 pr-4 h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-black text-xs focus:outline-none focus:ring-0 focus:border-[var(--expressive-primary)] transition-all text-[var(--expressive-text)] disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Classification */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Asset Classification</Label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        type: value === 'all' ? undefined : value as any,
                      })
                    }
                  >
                    <SelectTrigger className="h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-black text-xs">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] rounded-xl">
                      <SelectItem value="all" className="font-bold py-3">ALL CLASSIFICATIONS</SelectItem>
                      <SelectItem value="standard" className="font-bold py-3">STANDARD UNIT</SelectItem>
                      <SelectItem value="deluxe" className="font-bold py-3">DELUXE SUITE</SelectItem>
                      <SelectItem value="suite" className="font-bold py-3">PREMIUM SUITE</SelectItem>
                      <SelectItem value="penthouse" className="font-bold py-3">PENTHOUSE ELITE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Threshold */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Fiscal Threshold</Label>
                  <Select
                    value={filters.maxPrice ? `${filters.maxPrice}` : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        maxPrice: value === 'all' ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-12 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-black text-xs">
                      <SelectValue placeholder="Max Budget" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] rounded-xl">
                      <SelectItem value="all" className="font-bold py-3">ANY BUDGET</SelectItem>
                      <SelectItem value="200" className="font-bold py-3">UNDER $200</SelectItem>
                      <SelectItem value="400" className="font-bold py-3">UNDER $400</SelectItem>
                      <SelectItem value="600" className="font-bold py-3">UNDER $600</SelectItem>
                      <SelectItem value="1000" className="font-bold py-3">UNDER $1000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {Object.keys(filters).length > 0 && (
                  <div className="pt-6 border-t-2 border-[var(--expressive-secondary)]/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)] mb-3">Active Parameters</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null
                        return (
                          <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--expressive-primary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_#000000] rounded-full text-[9px] font-black uppercase tracking-widest">
                            {key === 'maxPrice' ? `≤ $${value}` : `${value}`}
                            <button
                              onClick={() => handleFiltersChange({ ...filters, [key]: undefined })}
                              className="hover:scale-125 transition-transform"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Room Intelligence Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between p-4 bg-white border-2 border-[var(--expressive-secondary)] rounded-xl shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">
              Telemetry Scan Result: <span className="text-[var(--expressive-primary)]">{rooms.length} Assets Identified</span>
            </p>
          </div>

          {isLoading ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-white border-4 border-[var(--expressive-secondary)] mb-6 shadow-[6px_6px_0_0_var(--expressive-secondary)] animate-bounce">
                <SlidersHorizontal className="h-12 w-12 text-[var(--expressive-primary)]" />
              </div>
              <p className="text-xl font-black uppercase tracking-tighter text-[var(--expressive-text)] italic">Deep Scanning Asset Library...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-32 text-center bg-white border-4 border-dashed border-[var(--expressive-secondary)]/20 rounded-3xl">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-red-50 border-2 border-red-200 mb-6">
                <X className="h-16 w-16 text-red-500 opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-[var(--expressive-primary)] uppercase tracking-tighter mb-2">Zero Assets Found</h3>
              <p className="text-[var(--expressive-text-muted)] font-bold mb-8">Parameters yield no operational matches. Reconfigure filters.</p>
              <Button onClick={clearFilters} className="h-14 px-8 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all">
                Reset Parameters
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.id} className="hover:-translate-y-2 transition-transform duration-300">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
