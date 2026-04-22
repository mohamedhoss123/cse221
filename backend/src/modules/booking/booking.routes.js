const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  checkRoomAvailability
} = require('./booking.controller');

// All booking routes require authentication except availability check
router.use((req, res, next) => {
  if (req.path.includes('/availability')) {
    // Skip auth for availability check
    next();
  } else {
    authMiddleware(req, res, next);
  }
});

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.delete('/:id', cancelBooking);
router.get('/room/:roomId/availability', checkRoomAvailability);

module.exports = router;
