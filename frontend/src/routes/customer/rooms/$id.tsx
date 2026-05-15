import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getRoomById } from '#/services/rooms.service'
import { createReview } from '#/services/reviews.service'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { BookingModal } from '#/components/customer/BookingModal'
import { RoomReviews } from '#/components/customer/RoomReviews'
import { WriteReviewDialog } from '#/components/customer/WriteReviewDialog'
import { AlertCircle, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/customer/rooms/$id')({
  component: RoomDetailsPage,
  loader: async ({ params }) => {
    const room = await getRoomById(params.id)
    return { room }
  },
})

function RoomDetailsPage() {
  const { room } = Route.useLoaderData()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!room) {
    return (
      <div className="p-8 py-16 text-center">
        <h1 className="font-light mb-4 text-3xl font-bold text-[var(--expressive-primary)]">
          Room Not Found
        </h1>
        <Button onClick={() => navigate({ to: '/customer/rooms' })}>
          Back to Rooms
        </Button>
      </div>
    )
  }

  const handleBookNow = () => {
    setIsBookingModalOpen(true)
  }

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/login', search: { redirect: `/customer/rooms/${room.id}` } })
      return
    }
    if (user?.role !== 'visitor') {
      setReviewMessage({ type: 'error', text: 'Only guests can write reviews' })
      return
    }
    setIsReviewDialogOpen(true)
  }

  const handleSubmitReview = async (data: { rating: number; description: string }) => {
    try {
      setIsSubmittingReview(true)
      await createReview(room.id, data)
      setReviewMessage({ type: 'success', text: 'Review posted successfully!' })
      setIsReviewDialogOpen(false)
      // Reset message after 3 seconds
      setTimeout(() => setReviewMessage(null), 3000)
    } catch (error: any) {
      setReviewMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to post review'
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/customer/rooms' })}
          className="text-sm text-[var(--expressive-primary)] hover:underline"
        >
          ← Back to Rooms
        </button>
      </div>

      <div className="gap-8 lg:grid lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge className="mb-2 capitalize">{room.type}</Badge>
                <h1 className="font-light text-3xl font-bold text-[var(--expressive-primary)]">
                  {room.name || `${room.type} Room`}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--expressive-primary)]">
                  ${room.price}
                </p>
                <p className="text-sm text-[var(--expressive-text)]">per night</p>
              </div>
            </div>
          </div>

           {/* Image Gallery */}
           {room.images && room.images.length > 0 && (
             <div className="mb-8">
               <div className="grid grid-cols-2 gap-4">
                 {/* Primary Image */}
                 <div className="col-span-2 aspect-video overflow-hidden rounded-2xl shadow-lg">
                   <img
                     src={`/api${room.images.find(img => img.isPrimary)?.url || room.images[0].url}`}
                     alt={`${room.type} room`}
                     className="w-full h-full object-cover rounded-2xl"
                   />
                 </div>

                 {/* Secondary Images */}
                 {room.images.slice(1).map((image) => (
                   <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                     <img
                       src={`/api${image.url}`}
                       alt={`${room.type} room`}
                       className="w-full h-full object-cover rounded-xl"
                     />
                   </div>
                 ))}
               </div>
             </div>
           )}

          <Separator className="my-8" />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-[var(--expressive-primary)]">
              Room Type
            </h2>
            <p className="text-[var(--expressive-text)]">{room.type}</p>
          </div>

          <Separator className="my-8" />

          {/* Reviews Section */}
          <div>
            <RoomReviews
              roomId={room.id}
              onWriteReview={handleWriteReview}
            />
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] sticky top-24 rounded-2xl p-6">
            <div className="mb-4">
              <p className="text-2xl font-bold text-[var(--expressive-primary)]">
                ${room.price}
              </p>
              <p className="text-sm text-[var(--expressive-text)]">per night</p>
            </div>

            <Separator className="my-4" />

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-[var(--expressive-text)] font-medium">
                  {room.type} Room
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-[var(--expressive-primary)] text-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all font-semibold"
              size="lg"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {reviewMessage && (
        <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          reviewMessage.type === 'success'
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          {reviewMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={reviewMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {reviewMessage.text}
          </span>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        room={room}
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
      />

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        roomName={room.name || `${room.type} Room`}
        onSubmit={handleSubmitReview}
        isLoading={isSubmittingReview}
      />
    </div>
  )
}
