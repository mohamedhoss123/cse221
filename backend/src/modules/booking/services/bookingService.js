const { query } = require('../../../database/connection');

class BookingService {
  async getAllBookings(filters = {}) {
    let sql = 'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, u.name as customerName FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id';
    const params = [];

    if (filters.customerId) {
      sql += ' WHERE u.user_id = ?';
      params.push(filters.customerId);
    }

    const bookings = await query(sql, params);

    return bookings.map(booking => ({
      id: booking.id.toString(),
      roomId: booking.roomId.toString(),
      roomType: booking.roomType,
      roomPrice: booking.price,
      customerId: booking.customerId.toString(),
      customerName: booking.customerName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: 'confirmed',
      totalAmount: booking.price
    }));
  }

  async getBookingById(bookingId) {
    const bookings = await query(
      'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, u.name as customerName FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id WHERE r.reservvaion_id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    const booking = bookings[0];
    return {
      id: booking.id.toString(),
      roomId: booking.roomId.toString(),
      roomType: booking.roomType,
      roomPrice: booking.price,
      customerId: booking.customerId.toString(),
      customerName: booking.customerName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: 'confirmed',
      totalAmount: booking.price
    };
  }

  async createBooking(bookingData) {
    const { roomId, customerId, checkIn, checkOut, guests } = bookingData;

    const result = await query(
      'INSERT INTO RESERVATION (start_date, end_date, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, (SELECT visitor_id FROM VISITOR WHERE USER_user_id = ?))',
      [checkIn, checkOut, roomId, customerId]
    );

    const bookings = await query(
      'SELECT r.reservvaion_id as id, r.start_date as checkIn, r.end_date as checkOut, r.ROOM_room_id as roomId, rm.type as roomType, rm.price, v.USER_user_id as customerId, u.name as customerName FROM RESERVATION r JOIN ROOM rm ON r.ROOM_room_id = rm.room_id JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id WHERE r.reservvaion_id = ?',
      [result.insertId]
    );

    const booking = bookings[0];
    return {
      id: booking.id.toString(),
      roomId: booking.roomId.toString(),
      roomType: booking.roomType,
      roomPrice: booking.price,
      customerId: booking.customerId.toString(),
      customerName: booking.customerName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: 'confirmed',
      totalAmount: booking.price,
      guests: guests
    };
  }

  async cancelBooking(bookingId) {
    const existingBooking = await query(
      'SELECT reservvaion_id FROM RESERVATION WHERE reservvaion_id = ?',
      [bookingId]
    );

    if (existingBooking.length === 0) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    await query('DELETE FROM RESERVATION WHERE reservvaion_id = ?', [bookingId]);

    return { message: 'Booking cancelled successfully' };
  }
}

module.exports = new BookingService();