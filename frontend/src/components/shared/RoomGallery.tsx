import { useState } from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RoomGalleryProps {
  images: string[]
  name: string
}

export default function RoomGallery({ images, name }: RoomGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 0) {
    return (
      <Card className="aspect-video w-full">
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-[var(--sea-ink-soft)]">No images available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img
              src={images[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              className="h-full w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="overflow-hidden rounded-lg border-2 transition-opacity hover:opacity-80"
              style={{
                borderColor: index === currentIndex ? 'var(--lagoon-deep)' : 'transparent',
                opacity: index === currentIndex ? 1 : 0.6,
              }}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="aspect-video w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
