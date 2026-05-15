import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Loader2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>
  isLoading?: boolean
  existingReview?: ReviewFormData
  submitLabel?: string
}

export function ReviewForm({
  onSubmit,
  isLoading = false,
  existingReview,
  submitLabel = 'Submit Review'
}: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: existingReview || {
      rating: 0,
      description: ''
    }
  })

  const selectedRating = watch('rating')

  const handleRatingClick = (rating: number) => {
    setValue('rating', rating)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating Selection */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-slate-900">Rating</Label>
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = i + 1
            const isHovered = hoveredRating >= rating
            const isSelected = selectedRating >= rating

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    isHovered || isSelected
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
        {selectedRating > 0 && (
          <p className="text-sm text-slate-600">
            {selectedRating === 1 && 'Poor'}
            {selectedRating === 2 && 'Fair'}
            {selectedRating === 3 && 'Good'}
            {selectedRating === 4 && 'Very Good'}
            {selectedRating === 5 && 'Excellent'}
          </p>
        )}
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-lg font-semibold text-slate-900">
          Your Review
        </Label>
        <Textarea
          id="description"
          placeholder="Share your experience with this room... (minimum 10 characters)"
          className="min-h-32 border-2 border-slate-200 rounded-xl focus:border-[var(--expressive-primary)] focus:ring-4 focus:ring-[var(--expressive-accent)]/20 transition-all resize-none"
          {...register('description')}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">
            {watch('description')?.length || 0}/1000 characters
          </p>
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:opacity-90 transition-opacity shadow-sm font-semibold py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
