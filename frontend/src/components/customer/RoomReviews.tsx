import { useEffect, useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { getReviewsByRoom, getRoomRating } from '#/services/reviews.service'
import { ReviewCard } from './ReviewCard'
import { Button } from '#/components/ui/button'

interface RoomReviewsProps {
  roomId: string
  onWriteReview?: () => void
}

export function RoomReviews({ roomId, onWriteReview }: RoomReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
  }, [roomId])

  const loadReviews = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [reviewsData, ratingData] = await Promise.all([
        getReviewsByRoom(roomId, 5, 0),
        getRoomRating(roomId)
      ])

      setReviews(reviewsData.reviews)
      setRating(ratingData)
    } catch (err) {
      console.error('Error loading reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--expressive-primary)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {rating && (
        <div className="bg-gradient-to-r from-[var(--expressive-primary)]/10 to-[var(--expressive-accent)]/10 rounded-xl p-6 border-2 border-[var(--expressive-secondary)]/20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[var(--expressive-primary)]">
                {rating.averageRating}
              </span>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rating.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-slate-900">
                Based on {rating.totalReviews} review{rating.totalReviews !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-slate-600">
                {rating.averageRating >= 4.5 && 'Excellent ratings from our guests!'}
                {rating.averageRating >= 4 && rating.averageRating < 4.5 && 'Highly rated by our guests'}
                {rating.averageRating >= 3 && rating.averageRating < 4 && 'Good ratings from our guests'}
                {rating.averageRating > 0 && rating.averageRating < 3 && 'Be one of our reviewers'}
                {rating.averageRating === 0 && 'No reviews yet'}
              </p>
            </div>
            {onWriteReview && (
              <Button
                onClick={onWriteReview}
                className="bg-[var(--expressive-primary)] text-white hover:bg-[var(--expressive-primary)]/90"
              >
                Write Review
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {error ? (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-600 mb-4">No reviews yet. Be the first to review this room!</p>
          {onWriteReview && (
            <Button
              onClick={onWriteReview}
              className="bg-[var(--expressive-primary)] text-white hover:bg-[var(--expressive-primary)]/90"
            >
              Write the First Review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Reviews</h3>
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
