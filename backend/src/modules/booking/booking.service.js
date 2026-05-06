const { query } = require('../../database/connection');
const invoiceService = require('../invoice/invoice.service');
const {
  calculateNights,
  createError
} = require('../../utils/helpers');

class BookingService {
  async checkRoomAvailability(roomId, checkIn, checkOut, excludeReservationId = null) {
    let sql = 'SELECT reservation_id FROM RESERVATION WHERE ROOM_room_id = ? AND status != "cancelled" AND ';
    sql += '(start_date <= ? AND end_date >= ? OR ';
    sql += 'start_date <= ? AND end_date >= ? OR ';
    sql += 'start_date >= ? AND end_date <= ?)';

    const params = [roomId, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut];

    if (excludeReservationId) {
      sql += ' AND reservation_id != ?';
      params.push(excludeReservationId);
    }

    const conflictingBookings = await query(sql, params);

    return {
      available: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length
    };
  }

  async getAllBookings(visitorId = null) {
    let sql = `
      SELECT
        r.*,
        v.visitor_id,
        u.user_id AS customerId,
        u.name AS customerName
      FROM RESERVATION r
      LEFT JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id
      LEFT JOIN USER u ON v.USER_user_id = u.user_id
    `;
    const params = [];

    if (visitorId) {
      sql += ' WHERE r.VISITOR_visitor_id = ?';
      params.push(visitorId);
    }

    sql += ' ORDER BY r.start_date DESC';

    const bookings = await query(sql, params);

    return bookings.map(b => ({
      id: b.reservation_id.toString(),
      roomId: b.ROOM_room_id.toString(),
      visitorId: b.VISITOR_visitor_id.toString(),
      customerId: b.customerId?.toString() || b.visitor_id?.toString() || b.VISITOR_visitor_id.toString(),
      customerName: b.customerName || 'Unknown Customer',
      checkIn: b.start_date,
      checkOut: b.end_date,
      guests: b.guests || 2,
      status: b.status || 'confirmed'
    }));
  }

  async getBookingById(bookingId) {
    const bookings = await query(
      `
        SELECT
          r.*,
          v.visitor_id,
          u.user_id AS customerId,
          u.name AS customerName
        FROM RESERVATION r
        LEFT JOIN VISITOR v ON r.VISITOR_visitor_id = v.visitor_id
        LEFT JOIN USER u ON v.USER_user_id = u.user_id
        WHERE r.reservation_id = ?
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      throw createError('Booking not found', 404);
    }

    const booking = bookings[0];

    return {
      id: booking.reservation_id.toString(),
      roomId: booking.ROOM_room_id.toString(),
      visitorId: booking.VISITOR_visitor_id.toString(),
      customerId: booking.customerId?.toString() || booking.visitor_id?.toString() || booking.VISITOR_visitor_id.toString(),
      customerName: booking.customerName || 'Unknown Customer',
      checkIn: booking.start_date,
      checkOut: booking.end_date,
      guests: booking.guests || 2,
      status: booking.status || 'confirmed'
    };
  }

  async createBooking(bookingData) {
    const { roomId, visitorId, checkIn, checkOut, guests = 2 } = bookingData;

    // Check availability
    const availability = await this.checkRoomAvailability(roomId, checkIn, checkOut);

    if (!availability.available) {
      throw createError('Room is not available for the selected dates', 409);
    }

    // Create booking
    const result = await query(
      'INSERT INTO RESERVATION (start_date, end_date, guests, status, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [checkIn, checkOut, guests, 'confirmed', roomId, visitorId]
    );

    // Get room price
    const rooms = await query('SELECT price FROM ROOM WHERE room_id = ?', [roomId]);
    const price = parseFloat(rooms[0].price);
    const nights = calculateNights(checkIn, checkOut);
    const totalAmount = price * nights;

    // Create invoice
    await invoiceService.createInvoice({
      amount: totalAmount,
      visitorId: visitorId,
      roomId: roomId,
      reservationId: result.insertId
    });

    return await this.getBookingById(result.insertId);
  }

  async cancelBooking(bookingId) {
    const existing = await query('SELECT reservation_id FROM RESERVATION WHERE reservation_id = ?', [bookingId]);

    if (existing.length === 0) {
      throw createError('Booking not found', 404);
    }

    // Delete associated invoice
    await query('DELETE FROM INVOICE WHERE RESERVATION_reservation_id = ?', [bookingId]);

    // Delete booking
    await query('DELETE FROM RESERVATION WHERE reservation_id = ?', [bookingId]);

    return { message: 'Booking cancelled successfully', bookingId };
  }
}

module.exports = new BookingService();
