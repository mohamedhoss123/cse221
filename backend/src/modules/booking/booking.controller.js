const bookingService = require('./booking.service');

const getAllBookings = async (req, res, next) => {
  try {
    const visitorId = req.user.role === 'visitor' ? req.user.visitorId : null;
    const bookings = await bookingService.getAllBookings(visitorId);

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

    // Check ownership for visitors
    if (req.user.role === 'visitor') {
      if (booking.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
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
    const bookingData = req.user.role === 'visitor'
      ? { ...req.body, visitorId: req.user.visitorId }
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
    const booking = await bookingService.getBookingById(req.params.id);

    // Check ownership for visitors
    if (req.user.role === 'visitor') {
      if (booking.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
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
