import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { CalendarIcon, Users } from 'lucide-react'

interface SearchFormProps {
  onSubmit?: (searchData: SearchData) => void
}

export interface SearchData {
  checkIn: string
  checkOut: string
  guests: number
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const searchData: SearchData = {
      checkIn,
      checkOut,
      guests,
    }

    if (onSubmit) {
      onSubmit(searchData)
    } else {
      navigate({
        to: '/customer/rooms',
        search: searchData,
      })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="island-shell">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="checkIn">Check In</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
              <Input
                id="checkIn"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="checkOut">Check Out</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
              <Input
                id="checkOut"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full sm:w-auto">
              Search Rooms
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
