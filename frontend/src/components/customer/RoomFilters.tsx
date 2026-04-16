import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Slider } from '#/components/ui/slider'
import type { RoomFilters as RoomFiltersType, RoomType } from '#/types/room.types'

interface RoomFiltersProps {
  filters: RoomFiltersType
  onFiltersChange: (filters: RoomFiltersType) => void
}

const roomTypes: { value: RoomType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'penthouse', label: 'Penthouse' },
]

const availableAmenities = [
  'WiFi',
  'TV',
  'Air Conditioning',
  'Mini Bar',
  'Ocean View',
  'Pool Access',
  'Balcony',
  'Kitchenette',
]

export default function RoomFilters({ filters, onFiltersChange }: RoomFiltersProps) {
  const handleTypeChange = (type: RoomType, checked: boolean) => {
    onFiltersChange({
      ...filters,
      type: checked ? type : undefined,
    })
  }

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      maxPrice: values[0],
    })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || []
    onFiltersChange({
      ...filters,
      amenities: checked
        ? [...currentAmenities, amenity]
        : currentAmenities.filter(a => a !== amenity),
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.type || filters.maxPrice || (filters.amenities && filters.amenities.length > 0)

  return (
    <Card className="island-shell h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Type */}
        <div>
          <Label className="mb-3 block">Room Type</Label>
          <div className="space-y-2">
            {roomTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.type === type.value}
                  onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                />
                <Label htmlFor={`type-${type.value}`} className="cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-3 block">
            Max Price: ${filters.maxPrice || 1200}
          </Label>
          <Slider
            value={[filters.maxPrice || 1200]}
            onValueChange={handlePriceChange}
            max={1200}
            min={100}
            step={50}
            className="mt-2"
          />
        </div>

        {/* Amenities */}
        <div>
          <Label className="mb-3 block">Amenities</Label>
          <div className="space-y-2">
            {availableAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities?.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
