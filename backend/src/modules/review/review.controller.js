const reviewService = require('./review.service');

const getReviewsByRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await reviewService.getReviewsByRoom(
      roomId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const getReviewsByVisitor = async (req, res, next) => {
  try {
    const visitorId = req.user.visitorId;
    const { limit = 10, offset = 0 } = req.query;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID not found in user data'
      });
    }

    const reviews = await reviewService.getReviewsByVisitor(
      visitorId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewService.getReview(reviewId);

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'visitor') {
      return res.status(403).json({
        success: false,
        message: 'Only visitors can create reviews'
      });
    }

    const visitorId = req.user.visitorId;
    const { roomId } = req.params;
    const { rating, description } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID not found in user data'
      });
    }

    const review = await reviewService.createReview(visitorId, roomId, {
      rating,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'visitor') {
      return res.status(403).json({
        success: false,
        message: 'Only visitors can update reviews'
      });
    }

    const visitorId = req.user.visitorId;
    const { reviewId } = req.params;
    const { rating, description } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID not found in user data'
      });
    }

    const review = await reviewService.updateReview(reviewId, visitorId, {
      rating,
      description
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'visitor') {
      return res.status(403).json({
        success: false,
        message: 'Only visitors can delete reviews'
      });
    }

    const visitorId = req.user.visitorId;
    const { reviewId } = req.params;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID not found in user data'
      });
    }

    const result = await reviewService.deleteReview(reviewId, visitorId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getRoomRating = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const rating = await reviewService.getRoomAverageRating(roomId);

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    next(error);
  }
};

const canReviewRoom = async (req, res, next) => {
  try {
    const visitorId = req.user.visitorId;
    const { roomId } = req.params;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID not found in user data'
      });
    }

    // Check if already reviewed
    const existingReview = await reviewService.checkExistingReview(visitorId, roomId);
    if (existingReview) {
      return res.status(200).json({
        success: true,
        data: {
          canReview: false,
          reason: 'already_reviewed'
        }
      });
    }

    // Check if has completed booking
    const hasCompletedBooking = await reviewService.checkCompletedBooking(visitorId, roomId);
    if (!hasCompletedBooking) {
      return res.status(200).json({
        success: true,
        data: {
          canReview: false,
          reason: 'no_completed_booking'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        canReview: true,
        reason: null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviewsByRoom,
  getReviewsByVisitor,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getRoomRating,
  canReviewRoom
};
