const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const {authMiddleware} = require('../../middleware/auth');

// Public routes
router.get('/room/:roomId/rating', reviewController.getRoomRating);
router.get('/room/:roomId', reviewController.getReviewsByRoom);
router.get('/:reviewId', reviewController.getReview);

// Protected routes (visitor only)
router.get('/room/:roomId/can-review', authMiddleware, reviewController.canReviewRoom);
router.post('/room/:roomId', authMiddleware, reviewController.createReview);
router.get('/visitor/reviews/list', authMiddleware, reviewController.getReviewsByVisitor);
router.put('/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
