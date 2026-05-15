import BaseService from './base.service'

export interface Review {
  id: string
  rating: number
  description: string
  createdAt: string
  visitorName: string
  visitorEmail?: string
  roomName?: string
}

export interface ReviewsResponse {
  reviews: Review[]
  total: number
  limit: number
  offset: number
}

export interface RoomRating {
  averageRating: number
  totalReviews: number
  minRating: number | null
  maxRating: number | null
}

// Get reviews for a specific room
export async function getReviewsByRoom(
  roomId: string,
  limit = 10,
  offset = 0
): Promise<ReviewsResponse> {
  return BaseService.get<ReviewsResponse>(`/reviews/room/${roomId}`, {
    params: { limit, offset }
  })
}

// Get reviews written by current visitor
export async function getMyReviews(limit = 10, offset = 0): Promise<ReviewsResponse> {
  return BaseService.get<ReviewsResponse>('/reviews/visitor/reviews/list', {
    params: { limit, offset }
  })
}

// Get a specific review
export async function getReview(reviewId: string): Promise<Review> {
  return BaseService.get<Review>(`/reviews/${reviewId}`)
}

// Create a new review for a room
export async function createReview(
  roomId: string,
  reviewData: { rating: number; description: string }
): Promise<Review> {
  return BaseService.post<Review>(`/reviews/room/${roomId}`, reviewData)
}

// Update an existing review
export async function updateReview(
  reviewId: string,
  reviewData: { rating?: number; description?: string }
): Promise<Review> {
  return BaseService.put<Review>(`/reviews/${reviewId}`, reviewData)
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<{ message: string }> {
  return BaseService.delete<{ message: string }>(`/reviews/${reviewId}`)
}

// Get room average rating and stats
export async function getRoomRating(roomId: string): Promise<RoomRating> {
  return BaseService.get<RoomRating>(`/reviews/room/${roomId}/rating`)
}
