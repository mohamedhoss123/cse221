const { query } = require('../../database/connection');
const {
  formatDate,
  calculateInvoiceStatus,
  createError,
  calculateDueDate
} = require('../../utils/helpers');

class InvoiceService {
  async getAllInvoices(visitorId = null) {
    let sql = `
      SELECT
        i.*,
        v.visitor_id,
        u.name as customerName,
        u.email as customerEmail,
        r.name as roomName,
        r.type as roomType,
        res.start_date as checkIn,
        res.end_date as checkOut,
        res.guests
      FROM INVOICE i
      LEFT JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
      LEFT JOIN USER u ON v.USER_user_id = u.user_id
      LEFT JOIN ROOM r ON i.ROOM_room_id = r.room_id
      LEFT JOIN RESERVATION res ON i.RESERVATION_reservation_id = res.reservation_id
    `;
    const params = [];

    if (visitorId) {
      sql += ' WHERE i.VISITOR_visitor_id = ?';
      params.push(visitorId);
    }

    sql += ' ORDER BY i.date DESC';

    const invoices = await query(sql, params);

    // Get payments for each invoice
    const result = await Promise.all(invoices.map(async (invoice) => {
      const payments = await query(
        'SELECT * FROM PAYMENT WHERE INVOICE_invoice_id = ?',
        [invoice.invoice_id]
      );

      const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalAmount = parseFloat(invoice.amount);

      return {
        id: invoice.invoice_id.toString(),
        amount: totalAmount,
        paidAmount: paidAmount,
        remainingAmount: totalAmount - paidAmount,
        status: invoice.status || calculateInvoiceStatus(totalAmount, paidAmount),
        date: invoice.date,
        dueDate: invoice.due_date,
        visitorId: invoice.VISITOR_visitor_id.toString(),
        roomId: invoice.ROOM_room_id.toString(),
        reservationId: invoice.RESERVATION_reservation_id.toString(),
        roomName: invoice.roomName,
        roomType: invoice.roomType,
        customerName: invoice.customerName || invoice.customerEmail || null,
        customerId: invoice.visitor_id?.toString() || null,
        booking: {
          id: invoice.RESERVATION_reservation_id?.toString(),
          roomName: invoice.roomName || `Room ${invoice.ROOM_room_id}`,
          checkIn: invoice.checkIn,
          checkOut: invoice.checkOut,
          guests: invoice.guests
        },
        payments: payments.map(p => ({
          id: p.payment_id.toString(),
          amount: parseFloat(p.amount),
          method: p.type,
          date: p.date
        }))
      };
    }));

    return result;
  }

  async getInvoiceById(invoiceId) {
    const invoices = await query(`
      SELECT
        i.*,
        v.visitor_id,
        u.name as customerName,
        u.email as customerEmail,
        r.name as roomName,
        r.type as roomType,
        res.start_date as checkIn,
        res.end_date as checkOut,
        res.guests
      FROM INVOICE i
      LEFT JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
      LEFT JOIN USER u ON v.USER_user_id = u.user_id
      LEFT JOIN ROOM r ON i.ROOM_room_id = r.room_id
      LEFT JOIN RESERVATION res ON i.RESERVATION_reservation_id = res.reservation_id
      WHERE i.invoice_id = ?
    `, [invoiceId]);

    if (invoices.length === 0) {
      throw createError('Invoice not found', 404);
    }

    const invoice = invoices[0];
    const payments = await query('SELECT * FROM PAYMENT WHERE INVOICE_invoice_id = ?', [invoiceId]);

    const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalAmount = parseFloat(invoice.amount);

    return {
      id: invoice.invoice_id.toString(),
      amount: totalAmount,
      paidAmount: paidAmount,
      remainingAmount: totalAmount - paidAmount,
      status: invoice.status || calculateInvoiceStatus(totalAmount, paidAmount),
      date: invoice.date,
      dueDate: invoice.due_date,
      visitorId: invoice.VISITOR_visitor_id.toString(),
      roomId: invoice.ROOM_room_id.toString(),
      reservationId: invoice.RESERVATION_reservation_id.toString(),
      roomName: invoice.roomName,
      roomType: invoice.roomType,
      customerName: invoice.customerName || invoice.customerEmail || null,
      customerId: invoice.visitor_id?.toString() || null,
      booking: {
        id: invoice.RESERVATION_reservation_id?.toString(),
        roomName: invoice.roomName || `Room ${invoice.ROOM_room_id}`,
        checkIn: invoice.checkIn,
        checkOut: invoice.checkOut,
        guests: invoice.guests
      },
      payments: payments.map(p => ({
        id: p.payment_id.toString(),
        amount: parseFloat(p.amount),
        method: p.type,
        date: p.date
      }))
    };
  }

  async createInvoice(invoiceData) {
    const { amount, visitorId, roomId, reservationId } = invoiceData;
    const date = formatDate(new Date());
    const dueDate = calculateDueDate(date);

    const result = await query(
      'INSERT INTO INVOICE (amount, date, due_date, status, VISITOR_visitor_id, ROOM_room_id, RESERVATION_reservation_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [amount, date, dueDate, 'pending', visitorId, roomId, reservationId]
    );

    return await this.getInvoiceById(result.insertId);
  }

  async getInvoicesByReservation(reservationId) {
    const invoices = await query('SELECT * FROM INVOICE WHERE RESERVATION_reservation_id = ?', [reservationId]);

    return invoices.map(invoice => ({
      id: invoice.invoice_id.toString(),
      amount: parseFloat(invoice.amount),
      date: invoice.date,
      status: invoice.status,
      visitorId: invoice.VISITOR_visitor_id.toString(),
      roomId: invoice.ROOM_room_id.toString(),
      reservationId: invoice.RESERVATION_reservation_id.toString()
    }));
  }
}

module.exports = new InvoiceService();
