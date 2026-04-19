const { query } = require('../../../database/connection');
const invoiceService = require('../../invoice/services/invoiceService');

class BookingService {
  async checkRoomAvailability(roomId, checkIn, checkOut, excludeReservationId = null) {
    // Check if there are any overlapping reservations for this room
    let sql = `
      SELECT r.reservvaion_id
      FROM RESERVATION r
      WHERE r.ROOM_room_id = ?
      AND (
        (r.start_date <= ? AND r.end_date >= ?) OR
        (r.start_date <= ? AND r.end_date >= ?) OR
        (r.start_date >= ? AND r.end_date <= ?)
      )
    `;

    const params = [roomId, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut];

    // If updating an existing reservation, exclude it from the check
    if (excludeReservationId) {
      sql += ' AND r.reservvaion_id != ?';
      params.push(excludeReservationId);
    }

    const overlappingBookings = await query(sql, params);

    return {
      available: overlappingBookings.length === 0,
      conflictingBookings: overlappingBookings.length
    };
  }

  async getAllBookings(filters = {}) {
    let sql = 'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, v.visitor_id, u.name as customerName, i.invoce_id as invoiceId FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id LEFT JOIN INVOICE i ON r.reservvaion_id = i.RESERVATION_reservvaion_id';
    const params = [];

    if (filters.visitorId) {
      sql += ' WHERE v.visitor_id = ?';
      params.push(filters.visitorId);
    } else if (filters.customerId) {
      sql += ' WHERE u.user_id = ?';
      params.push(filters.customerId);
    }

    const bookings = await query(sql, params);

    return bookings.map(booking => {
      // Calculate total amount from invoice or use room price
      const totalAmount = booking.price; // Fallback to room price if no invoice

      return {
        id: booking.id.toString(),
        roomId: booking.roomId.toString(),
        roomType: booking.roomType,
        roomPrice: booking.price,
        customerId: booking.customerId.toString(),
        visitorId: booking.visitor_id.toString(),
        customerName: booking.customerName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: 'confirmed',
        totalAmount: totalAmount,
        invoiceId: booking.invoiceId ? booking.invoiceId.toString() : null
      };
    });
  }

  async getBookingById(bookingId) {
    const bookings = await query(
      'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, v.visitor_id, u.name as customerName, i.invoce_id as invoiceId, i.amount as invoiceAmount FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id LEFT JOIN INVOICE i ON r.reservvaion_id = i.RESERVATION_reservvaion_id WHERE r.reservvaion_id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    const booking = bookings[0];

    // Calculate number of nights
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Use invoice amount if available, otherwise calculate from room price
    const totalAmount = booking.invoiceAmount || booking.price;

    return {
      id: booking.id.toString(),
      roomId: booking.roomId.toString(),
      roomType: booking.roomType,
      roomPrice: booking.price,
      customerId: booking.customerId.toString(),
      visitorId: booking.visitor_id.toString(),
      customerName: booking.customerName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: 'confirmed',
      totalAmount: totalAmount,
      invoiceId: booking.invoiceId ? booking.invoiceId.toString() : null,
      numberOfNights: numberOfNights
    };
  }

  async createBooking(bookingData) {
    const { roomId, visitorId, customerId, checkIn, checkOut, guests, totalAmount } = bookingData;

    // First, check if the room is available for the requested dates
    const availability = await this.checkRoomAvailability(roomId, checkIn, checkOut);

    if (!availability.available) {
      const error = new Error('Room is not available for the selected dates');
      error.statusCode = 409; // Conflict status code
      error.conflictingBookings = availability.conflictingBookings;
      throw error;
    }

    // Use visitorId if provided, otherwise get it from customerId
    let finalVisitorId = visitorId;
    if (!finalVisitorId && customerId) {
      const visitors = await query(
        'SELECT visitor_id FROM VISITOR WHERE USER_user_id = ?',
        [customerId]
      );

      if (visitors.length === 0) {
        const error = new Error('Visitor not found');
        error.statusCode = 404;
        throw error;
      }

      finalVisitorId = visitors[0].visitor_id;
    }

    // Create the reservation
    const result = await query(
      'INSERT INTO RESERVATION (start_date, end_date, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, ?)',
      [checkIn, checkOut, roomId, finalVisitorId]
    );

    const reservationId = result.insertId;

    // Get room details for calculating total amount
    const rooms = await query(
      'SELECT price, type FROM ROOM WHERE room_id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    const room = rooms[0];
    const pricePerNight = parseFloat(room.price);

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate total amount (use provided totalAmount or calculate it)
    const calculatedTotalAmount = totalAmount || (pricePerNight * numberOfNights);

    // Create invoice for this booking
    const invoice = await invoiceService.createInvoice({
      amount: calculatedTotalAmount,
      visitorId: finalVisitorId,
      roomId: roomId,
      reservationId: reservationId
    });

    // Get the complete booking details
    const bookings = await query(
      'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, v.visitor_id, u.name as customerName FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id WHERE r.reservvaion_id = ?',
      [reservationId]
    );

    const booking = bookings[0];
    return {
      id: booking.id.toString(),
      roomId: booking.roomId.toString(),
      roomType: booking.roomType,
      roomPrice: booking.price,
      customerId: booking.customerId.toString(),
      visitorId: booking.visitor_id.toString(),
      customerName: booking.customerName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: 'confirmed',
      totalAmount: calculatedTotalAmount,
      guests: guests,
      invoiceId: invoice.id,
      numberOfNights: numberOfNights
    };
  }

  async cancelBooking(bookingId) {
    // Check if booking exists
    const existingBooking = await query(
      'SELECT r.reservvaion_id, i.invoce_id FROM RESERVATION r LEFT JOIN INVOICE i ON r.reservvaion_id = i.RESERVATION_reservvaion_id WHERE r.reservvaion_id = ?',
      [bookingId]
    );

    if (existingBooking.length === 0) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    const invoiceId = existingBooking[0].invoce_id;

    // Start a transaction to ensure both operations succeed or fail together
    // Note: MySQL doesn't support transactions with the simple query function we're using
    // So we'll delete in sequence and handle errors appropriately

    try {
      // Delete associated invoice if exists
      if (invoiceId) {
        await query('DELETE FROM INVOICE WHERE invoce_id = ?', [invoiceId]);
      }

      // Delete the reservation
      await query('DELETE FROM RESERVATION WHERE reservvaion_id = ?', [bookingId]);

      return {
        message: 'Booking cancelled successfully',
        bookingId: bookingId,
        invoiceDeleted: !!invoiceId
      };
    } catch (error) {
      // If deletion fails, throw an error
      const deleteError = new Error('Failed to cancel booking');
      deleteError.statusCode = 500;
      throw deleteError;
    }
  }
}

module.exports = new BookingService();