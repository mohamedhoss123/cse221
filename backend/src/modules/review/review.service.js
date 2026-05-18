const { query } = require('../../database/connection');
const { createError } = require('../../utils/helpers');

class ReviewService {
  async getReviewsByRoom(roomId, limit = 10, offset = 0) {
        const args = [parseInt(roomId), parseInt(offset), parseInt(limit)];
    console.log('Executing getReviewsByRoom with args:', args);
    const reviews = await query(
      `SELECT r.review_id, r.rating, r.description, r.created_at, 
              u.name, u.email
       FROM REVIEW r
       JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       WHERE r.ROOM_room_id = ? 
       ORDER BY r.created_at DESC
      `,
      args
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM REVIEW WHERE ROOM_room_id = ?',
      [parseInt(roomId)]
    );

    return {
      reviews: reviews.map(review => ({
        id: review.review_id.toString(),
        rating: review.rating,
        description: review.description,
        createdAt: review.created_at,
        visitorName: review.name,
        visitorEmail: review.email
      })),
      total: countResult[0].total,
      limit,
      offset
    };
  }

  async getReviewsByVisitor(visitorId, limit = 10, offset = 0) {
    const args = [parseInt(visitorId), parseInt(offset), parseInt(limit)];
    console.log('Executing getReviewsByVisitor with args:', args);
    const reviews = await query(
      "SELECT r.review_id, r.rating, r.description, r.created_at, rm.room_id, rm.name as room_name, rm.type as room_type, rm.price FROM REVIEW r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id WHERE r.VISITOR_visitor_id = ? ORDER BY r.created_at DESC ",
      args
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM REVIEW WHERE VISITOR_visitor_id = ?',
      [parseInt(visitorId)]
    );

    return {
      reviews: reviews.map(review => ({
        id: review.review_id.toString(),
        rating: review.rating,
        description: review.description,
        createdAt: review.created_at,
        roomId: review.room_id.toString(),
        roomName: review.room_name || `${review.room_type} Room`,
        roomType: review.room_type,
        roomPrice: review.price
      })),
      total: countResult[0].total,
      limit,
      offset
    };
  }

  async getReview(reviewId) {
    const reviews = await query(
      `SELECT r.review_id, r.rating, r.description, r.created_at, r.updated_at,
              u.name, u.email, rm.room_id, rm.name as room_name
       FROM REVIEW r
       JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       JOIN ROOM rm ON r.ROOM_room_id = rm.room_id
       WHERE r.review_id = ?`,
      [parseInt(reviewId)]
    );

    if (reviews.length === 0) {
      throw createError('Review not found', 404);
    }

    const review = reviews[0];
    return {
      id: review.review_id.toString(),
      rating: review.rating,
      description: review.description,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      visitorName: review.name,
      visitorEmail: review.email,
      roomId: review.room_id.toString(),
      roomName: review.room_name
    };
  }

  async createReview(visitorId, roomId, reviewData) {
    const { rating, description } = reviewData;

    if (!rating || !description) {
      throw createError('Rating and description are required', 400);
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw createError('Rating must be an integer between 1 and 5', 400);
    }

    if (description.trim().length < 10) {
      throw createError('Description must be at least 10 characters long', 400);
    }

    // Check if visitor already reviewed this room
    const existingReview = await query(
      'SELECT review_id FROM REVIEW WHERE VISITOR_visitor_id = ? AND ROOM_room_id = ?',
      [parseInt(visitorId), parseInt(roomId)]
    );

    if (existingReview.length > 0) {
      throw createError('You have already reviewed this room', 400);
    }

    // Verify visitor and room exist
    const visitorCheck = await query('SELECT visitor_id FROM VISITOR WHERE visitor_id = ?', [parseInt(visitorId)]);
    if (visitorCheck.length === 0) {
      throw createError('Visitor not found', 404);
    }

    const roomCheck = await query('SELECT room_id FROM ROOM WHERE room_id = ?', [parseInt(roomId)]);
    if (roomCheck.length === 0) {
      throw createError('Room not found', 404);
    }

    // Check if visitor has a completed booking for this room
    const bookingCheck = await query(
      `SELECT reservation_id FROM RESERVATION 
       WHERE VISITOR_visitor_id = ? AND ROOM_room_id = ? AND status = 'Confirmed'`,
      [parseInt(visitorId), parseInt(roomId)]
    );

    if (bookingCheck.length === 0) {
      throw createError('You can only review rooms you have booked and completed your stay at', 403);
    }

    const result = await query(
      'INSERT INTO REVIEW (rating, description, VISITOR_visitor_id, ROOM_room_id) VALUES (?, ?, ?, ?)',
      [rating, description, parseInt(visitorId), parseInt(roomId)]
    );

    return this.getReview(result.insertId);
  }

  async updateReview(reviewId, visitorId, reviewData) {
    const { rating, description } = reviewData;

    // Verify review exists and belongs to visitor
    const existingReview = await query(
      'SELECT review_id, VISITOR_visitor_id FROM REVIEW WHERE review_id = ?',
      [parseInt(reviewId)]
    );

    if (existingReview.length === 0) {
      throw createError('Review not found', 404);
    }

    if (existingReview[0].VISITOR_visitor_id !== parseInt(visitorId)) {
      throw createError('You can only update your own reviews', 403);
    }

    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      throw createError('Rating must be an integer between 1 and 5', 400);
    }

    if (description && description.trim().length < 10) {
      throw createError('Description must be at least 10 characters long', 400);
    }

    const updateQuery = [];
    const updateValues = [];

    if (rating !== undefined) {
      updateQuery.push('rating = ?');
      updateValues.push(rating);
    }

    if (description !== undefined) {
      updateQuery.push('description = ?');
      updateValues.push(description);
    }

    if (updateQuery.length === 0) {
      throw createError('No fields to update', 400);
    }

    updateValues.push(parseInt(reviewId));

    await query(
      `UPDATE REVIEW SET ${updateQuery.join(', ')} WHERE review_id = ?`,
      updateValues
    );

    return this.getReview(reviewId);
  }

  async deleteReview(reviewId, visitorId) {
    // Verify review exists and belongs to visitor
    const existingReview = await query(
      'SELECT review_id, VISITOR_visitor_id FROM REVIEW WHERE review_id = ?',
      [parseInt(reviewId)]
    );

    if (existingReview.length === 0) {
      throw createError('Review not found', 404);
    }

    if (existingReview[0].VISITOR_visitor_id !== parseInt(visitorId)) {
      throw createError('You can only delete your own reviews', 403);
    }

    await query('DELETE FROM REVIEW WHERE review_id = ?', [parseInt(reviewId)]);

    return { message: 'Review deleted successfully', reviewId };
  }

  async getRoomAverageRating(roomId) {
    const result = await query(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(review_id) as total_reviews,
        MIN(rating) as min_rating,
        MAX(rating) as max_rating
       FROM REVIEW 
       WHERE ROOM_room_id = ?`,
      [parseInt(roomId)]
    );

    if (result[0].total_reviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        minRating: null,
        maxRating: null
      };
    }

    return {
      averageRating: parseFloat(result[0].average_rating).toFixed(1),
      totalReviews: result[0].total_reviews,
      minRating: result[0].min_rating,
      maxRating: result[0].max_rating
    };
  }

  async checkExistingReview(visitorId, roomId) {
    const result = await query(
      'SELECT review_id FROM REVIEW WHERE VISITOR_visitor_id = ? AND ROOM_room_id = ?',
      [parseInt(visitorId), parseInt(roomId)]
    );
    return result.length > 0;
  }

  async checkCompletedBooking(visitorId, roomId) {
    const result = await query(
      `SELECT reservation_id FROM RESERVATION 
       WHERE VISITOR_visitor_id = ? AND ROOM_room_id = ? AND status = 'completed'`,
      [parseInt(visitorId), parseInt(roomId)]
    );
    return result.length > 0;
  }
}

module.exports = new ReviewService();
