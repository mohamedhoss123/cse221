import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getRoomById } from '#/services/rooms.service'
import { createReview } from '#/services/reviews.service'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { BookingModal } from '#/components/customer/BookingModal'
import { RoomReviews } from '#/components/customer/RoomReviews'
import { WriteReviewDialog } from '#/components/customer/WriteReviewDialog'

export const Route = createFileRoute('/customer/rooms/$id')({
  component: RoomDetailsPage,
  loader: async ({ params }) => {
    const room = await getRoomById(params.id)
    return { room }
  },
})

import { AlertCircle, CheckCircle, ArrowLeft, Star, MapPin, Zap, ShieldCheck, FileText } from 'lucide-react'

function RoomDetailsPage() {
  const { room } = Route.useLoaderData()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reviewErrorModal, setReviewErrorModal] = useState<{ open: boolean; title: string; message: string } | null>(null)

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--expressive-background)]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-white border-2 border-[var(--expressive-secondary)] mb-6 shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--expressive-primary)] mb-4 uppercase tracking-tighter">
            Asset Not Found
          </h1>
          <Button onClick={() => navigate({ to: '/customer/rooms' })} className="h-12 px-8 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 transition-all">
            Return to Library
          </Button>
        </div>
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
      setReviewMessage({ type: 'error', text: 'Only verified guests can transmit feedback' })
      return
    }
    setIsReviewDialogOpen(true)
  }

  const handleSubmitReview = async (data: { rating: number; description: string }) => {
    try {
      setIsSubmittingReview(true)
      await createReview(room.id, data)
      setReviewMessage({ type: 'success', text: 'Telemetry feedback synchronized' })
      setIsReviewDialogOpen(false)
      setTimeout(() => setReviewMessage(null), 3000)
    } catch (error: any) {
      const errorMessage = error.message || 'Transmission failure'
      setIsReviewDialogOpen(false)

      if (errorMessage.toLowerCase().includes('already reviewed')) {
        setReviewErrorModal({
          open: true,
          title: 'Feedback Redundancy',
          message: 'This asset has already been evaluated by your profile. Redundant feedback is prohibited by protocol.'
        })
      }
      else if (errorMessage.toLowerCase().includes('review rooms you have booked and completed y')) {
        setReviewErrorModal({
          open: true,
          title: 'Evaluation Denied',
          message: 'Operational feedback is only authorized after manifest fulfillment. Complete your stay to unlock feedback transmission.'
        })
      }
      else {
        setReviewMessage({ type: 'error', text: errorMessage })
      }
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/customer/rooms' })}
          className="h-10 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 transition-all text-[10px] font-black uppercase tracking-widest bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Asset Reference</p>
          <p className="text-xl font-black text-[var(--expressive-primary)] tracking-tighter">#{room.id.substring(0, 12).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Column: Asset Intelligence */}
        <div className="flex-1 space-y-10 w-full">
          {/* Hero Identity */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-primary)] text-white text-[10px] font-black uppercase tracking-widest mb-3">
                <ShieldCheck className="h-3 w-3" />
                Verified Asset
              </div>
              <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
                {room.name || `${room.type} Unit`}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-[var(--expressive-secondary)] rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  4.9 Rating
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-[var(--expressive-secondary)] rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <MapPin className="h-3 w-3 text-[var(--expressive-primary)]" />
                  Primary Sector
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-4 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_#ce0031] rounded-2xl text-center min-w-40">
              <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Nightly Yield</p>
              <p className="text-4xl font-black text-[var(--expressive-primary)] tracking-tighter">${room.price}</p>
            </div>
          </div>

          {/* Visual Data Stream (Images) */}
          {room.images && room.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 md:col-span-3 aspect-video bg-white border-4 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_var(--expressive-secondary)] rounded-3xl overflow-hidden group">
                <img
                  src={`/api${room.images.find(img => img.isPrimary)?.url || room.images[0].url}`}
                  alt="Asset primary view"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="col-span-4 md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4">
                {room.images.slice(1, 3).map((image) => (
                  <div key={image.id} className="aspect-square bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group">
                    <img
                      src={`/api${image.url}`}
                      alt="Asset secondary view"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="h-1 bg-[var(--expressive-secondary)]/5" />

          {/* Specification Manifest */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--expressive-secondary)] flex items-center justify-center text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Unit Specs</h2>
              </div>
              <Card className="bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--expressive-secondary)]/5 pb-2">
                  <span className="text-[10px] font-black uppercase text-[var(--expressive-text-muted)]">Category</span>
                  <span className="text-xs font-black uppercase text-[var(--expressive-primary)]">{room.type}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--expressive-secondary)]/5 pb-2">
                  <span className="text-[10px] font-black uppercase text-[var(--expressive-text-muted)]">Capacity</span>
                  <span className="text-xs font-black uppercase">{room.capacity || 2} Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-[var(--expressive-text-muted)]">Status</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-green-100 text-green-600 rounded">Available</span>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--expressive-primary)] flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Amenities</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Hyper-Speed Wi-Fi', 'Environmental Control', 'Security Protocol', 'Privacy Shield', 'Digital Key'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border-2 border-[var(--expressive-secondary)] rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <Separator className="h-1 bg-[var(--expressive-secondary)]/5" />

          {/* Feedback Stream */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Evaluations</h2>
              <Button
                variant="outline"
                onClick={handleWriteReview}
                className="h-10 px-4 border-2 border-[var(--expressive-primary)] shadow-[2px_2px_0_0_#ce0031] hover:-translate-y-0.5 transition-all text-[10px] font-black uppercase tracking-widest bg-white text-[var(--expressive-primary)]"
              >
                Transmit Feedback
              </Button>
            </div>
            <RoomReviews roomId={room.id} onWriteReview={handleWriteReview} />
          </section>
        </div>

        {/* Right Column: Reservation Terminal */}
        <aside className="w-full lg:w-96 shrink-0">
          <div className="sticky top-8">
            <Card className="bg-white border-4 border-[var(--expressive-secondary)] shadow-[10px_10px_0_0_var(--expressive-secondary)] rounded-3xl overflow-hidden">
              <CardHeader className="bg-[var(--expressive-secondary)] p-6 text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter">Reservation Hub</h3>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-1">Live Deployment Terminal</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest">Base Rate</p>
                    <p className="text-4xl font-black text-[var(--expressive-primary)] tracking-tighter">${room.price}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-[var(--expressive-background)] flex items-center justify-center border-2 border-[var(--expressive-secondary)]/10 shadow-inner">
                    <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5 rounded-2xl">
                    <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Selected Configuration</p>
                    <p className="text-sm font-black uppercase">{room.type} OPERATIONAL BASE</p>
                  </div>
                  <div className="p-4 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)]/5 rounded-2xl">
                    <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Inventory Status</p>
                    <p className="text-sm font-black text-green-600 uppercase">SYNCHRONIZED & READY</p>
                  </div>
                </div>

                <Button
                  className="w-full h-16 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest text-sm border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ce0031] active:translate-y-0.5 transition-all"
                  size="lg"
                  onClick={handleBookNow}
                >
                  Confirm Reservation
                </Button>

                <p className="text-[9px] font-black text-center text-[var(--expressive-text-muted)] uppercase tracking-widest italic">
                  * Fiscal finalization occurs at check-out
                </p>
              </CardContent>
            </Card>

            {/* Tactical Briefing */}
            <div className="mt-8 p-6 bg-[var(--expressive-primary)]/5 border-2 border-dashed border-[var(--expressive-primary)]/30 rounded-2xl">
              <p className="text-[10px] font-black text-[var(--expressive-primary)] uppercase tracking-widest mb-2">Tactical Note</p>
              <p className="text-xs font-bold text-[var(--expressive-text-muted)] italic leading-relaxed">
                "This asset is high-demand. Securing this manifest now guarantees sector availability for your operational window."
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Sync Notification */}
      {reviewMessage && (
        <div className={`fixed bottom-8 right-8 flex items-center gap-4 px-6 py-4 rounded-2xl border-4 shadow-[8px_8px_0_0_#000000] z-50 ${reviewMessage.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${reviewMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
            {reviewMessage.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none mb-1">System Message</p>
            <p className={`text-sm font-black uppercase tracking-tight ${reviewMessage.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
              {reviewMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal room={room} open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        roomName={room.name || `${room.type} Room`}
        onSubmit={handleSubmitReview}
        isLoading={isSubmittingReview}
      />

      {/* Protocol Alert Modal */}
      {reviewErrorModal && (
        <Dialog open={reviewErrorModal.open} onOpenChange={(open) => !open && setReviewErrorModal(null)}>
          <DialogContent className="sm:max-w-md bg-white border-4 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_#000000] rounded-3xl z-50">
            <DialogHeader className="space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                <AlertCircle className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-center uppercase tracking-tighter">{reviewErrorModal.title}</DialogTitle>
              <DialogDescription className="text-center font-bold text-[var(--expressive-text-muted)]">
                {reviewErrorModal.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button
                onClick={() => setReviewErrorModal(null)}
                className="w-full h-12 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest text-xs border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all"
              >
                Acknowledge Protocol
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

