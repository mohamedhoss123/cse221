const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.delete('/:id', cancelBooking);

module.exports = router;