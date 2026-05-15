import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import { ReviewForm } from './ReviewForm'
import { useState } from 'react'

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomName: string
  onSubmit: (data: { rating: number; description: string }) => Promise<void>
  isLoading?: boolean
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  roomName,
  onSubmit,
  isLoading = false
}: WriteReviewDialogProps) {
  const handleSubmit = async (data: { rating: number; description: string }) => {
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the parent component
      console.error('Failed to submit review:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-2 border-slate-200 shadow-lg">
        <DialogHeader className="border-b-2 border-slate-200 pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">Write a Review</DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            Share your experience with {roomName}. Help other guests make informed decisions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ReviewForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Post Review"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
