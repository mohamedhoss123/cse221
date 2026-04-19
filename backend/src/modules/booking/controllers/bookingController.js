const bookingService = require('../services/bookingService');

const getAllBookings = async (req, res, next) => {
  try {
    // Get visitor ID from JWT token (for visitors) or customerId from query (for admins)
    const visitorId = req.user.role === 'visitor' ? req.user.visitorId : null;

    // Only allow admins to view all bookings or filter by customerId
    const filters = req.user.role === 'admin' && req.query.customerId
      ? { customerId: req.query.customerId }
      : { visitorId };

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
    // For visitors, we need to compare visitor IDs
    if (req.user.role === 'visitor') {
      // Get visitor ID from booking to compare
      const { query } = require('../../../database/connection');
      const bookings = await query(
        'SELECT VISITOR_visitor_id as visitorId FROM RESERVATION WHERE reservvaion_id = ?',
        [req.params.id]
      );

      if (bookings.length === 0 || bookings[0].visitorId !== req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this booking'
        });
      }
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
    // For visitors, use visitorId from JWT token
    // For admins, use customerId from request body
    const bookingData = req.user.role === 'visitor'
      ? {
          ...req.body,
          visitorId: req.user.visitorId
        }
      : req.body;

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
    // Check if the booking belongs to the authenticated user
    if (req.user.role === 'visitor') {
      const { query } = require('../../../database/connection');
      const bookings = await query(
        'SELECT VISITOR_visitor_id as visitorId FROM RESERVATION WHERE reservvaion_id = ?',
        [req.params.id]
      );

      if (bookings.length === 0 || bookings[0].visitorId !== req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to cancel this booking'
        });
      }
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
