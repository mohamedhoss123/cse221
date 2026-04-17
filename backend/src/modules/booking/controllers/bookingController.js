const bookingService = require('../services/bookingService');

const getAllBookings = async (req, res, next) => {
  try {
    // Get customer ID from JWT token
    const customerId = req.user.userId;

    // Only allow admins to view all bookings, customers see only theirs
    const filters = req.user.role === 'admin' && req.query.customerId
      ? { customerId: req.query.customerId }
      : { customerId };

    const bookings = await bookingService.getAllBookings(filters);

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    // Check if the booking belongs to the authenticated user
    if (booking.customerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    // Get customer ID from JWT token
    const bookingData = {
      ...req.body,
      customerId: req.user.userId
    };

    const booking = await bookingService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    // Check if the booking belongs to the authenticated user
    if (booking.customerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking'
      });
    }

    const result = await bookingService.cancelBooking(req.params.id);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'checkIn and checkOut dates are required'
      });
    }

    const availability = await bookingService.checkRoomAvailability(roomId, checkIn, checkOut);

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  checkRoomAvailability
};
