import { Star, Trash2, Edit2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { format } from 'date-fns'

interface ReviewCardProps {
  id: string
  rating: number
  description: string
  createdAt: string | Date
  visitorName: string
  visitorEmail?: string
  roomName?: string
  isOwn?: boolean
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
}

export function ReviewCard({
  id,
  rating,
  description,
  createdAt,
  visitorName,
  visitorEmail,
  roomName,
  isOwn = false,
  onEdit,
  onDelete
}: ReviewCardProps) {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{visitorName}</h3>
            {roomName && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {roomName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {format(date, 'MMM d, yyyy')}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-semibold text-slate-700">
              {rating}.0/5.0
            </span>
          </div>
        </div>

        {/* Actions */}
        {isOwn && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(id)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(id)}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
        {description}
      </p>
    </div>
  )
}
