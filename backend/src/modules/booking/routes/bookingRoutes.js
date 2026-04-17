const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  checkRoomAvailability
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.delete('/:id', cancelBooking);
router.get('/room/:roomId/availability', checkRoomAvailability);

module.exports = router;