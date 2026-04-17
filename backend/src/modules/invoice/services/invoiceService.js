const { query } = require('../../../database/connection');

class InvoiceService {
  async createInvoice(invoiceData) {
    const { amount, visitorId, roomId, reservationId } = invoiceData;

    // Set invoice date to today
    const date = new Date().toISOString().split('T')[0];

    const result = await query(
      'INSERT INTO INVOICE (amount, date, VISITOR_visitor_id, ROOM_room_id, RESERVATION_reservvaion_id) VALUES (?, ?, ?, ?, ?)',
      [amount, date, visitorId, roomId, reservationId]
    );

    const invoices = await query(
      'SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId, i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId FROM INVOICE i WHERE i.invoce_id = ?',
      [result.insertId]
    );

    const invoice = invoices[0];
    return {
      id: invoice.id.toString(),
      amount: parseFloat(invoice.amount),
      date: invoice.date,
      visitorId: invoice.visitorId.toString(),
      roomId: invoice.roomId.toString(),
      reservationId: invoice.reservationId.toString()
    };
  }

  async getInvoiceById(invoiceId) {
    const invoices = await query(
      'SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId, i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId, r.type as roomType, u.name as customerName FROM INVOICE i JOIN ROOM r ON i.ROOM_room_id = r.room_id JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id JOIN USER u ON v.USER_user_id = u.user_id WHERE i.invoce_id = ?',
      [invoiceId]
    );

    if (invoices.length === 0) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }

    const invoice = invoices[0];
    return {
      id: invoice.id.toString(),
      amount: parseFloat(invoice.amount),
      date: invoice.date,
      visitorId: invoice.visitorId.toString(),
      roomId: invoice.roomId.toString(),
      reservationId: invoice.reservationId.toString(),
      roomType: invoice.roomType,
      customerName: invoice.customerName
    };
  }

  async getInvoicesByVisitor(visitorId) {
    const invoices = await query(
      'SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId, i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId, r.type as roomType FROM INVOICE i JOIN ROOM r ON i.ROOM_room_id = r.room_id WHERE i.VISITOR_visitor_id = ?',
      [visitorId]
    );

    return invoices.map(invoice => ({
      id: invoice.id.toString(),
      amount: parseFloat(invoice.amount),
      date: invoice.date,
      visitorId: invoice.visitorId.toString(),
      roomId: invoice.roomId.toString(),
      reservationId: invoice.reservationId.toString(),
      roomType: invoice.roomType
    }));
  }

  async getInvoicesByReservation(reservationId) {
    const invoices = await query(
      'SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId, i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId, r.type as roomType FROM INVOICE i JOIN ROOM r ON i.ROOM_room_id = r.room_id WHERE i.RESERVATION_reservvaion_id = ?',
      [reservationId]
    );

    return invoices.map(invoice => ({
      id: invoice.id.toString(),
      amount: parseFloat(invoice.amount),
      date: invoice.date,
      visitorId: invoice.visitorId.toString(),
      roomId: invoice.roomId.toString(),
      reservationId: invoice.reservationId.toString(),
      roomType: invoice.roomType
    }));
  }
}

module.exports = new InvoiceService();
