const { query } = require('../../../database/connection');

class InvoiceService {
  async getAllInvoicesForCustomer(userId) {
    // Get all invoices for a customer with full details
    const invoices = await query(
      `SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId,
              i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId,
              r.type as roomType, r.price as roomPrice,
              res.start_date as checkIn, res.end_date as checkOut,
              u.name as customerName, u.user_id as customerId
       FROM INVOICE i
       JOIN ROOM r ON i.ROOM_room_id = r.room_id
       JOIN RESERVATION res ON i.RESERVATION_reservvaion_id = res.reservvaion_id
       JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       WHERE u.user_id = ?
       ORDER BY i.date DESC`,
      [userId]
    );

    // Helper function to safely format date
    const formatDate = (dateValue) => {
      if (!dateValue) return null;
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    };

    // For each invoice, get payment details and calculate status
    const invoicePromises = invoices.map(async (invoice) => {
      // Get payments for this invoice
      const payments = await query(
        'SELECT payment_id as id, type, amount, date FROM PAYMENT WHERE INVOICE_invoce_id = ?',
        [invoice.id]
      );

      const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalAmount = parseFloat(invoice.amount);
      const remainingAmount = totalAmount - paidAmount;

      // Determine status
      let status = 'pending';
      if (paidAmount === 0) {
        status = 'pending';
      } else if (paidAmount >= totalAmount) {
        status = 'paid';
      } else {
        status = 'partial';
      }

      // Calculate due date (30 days from invoice date)
      const invoiceDate = new Date(invoice.date);
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);

      // Calculate number of nights
      const checkInDate = new Date(invoice.checkIn);
      const checkOutDate = new Date(invoice.checkOut);
      const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      return {
        id: invoice.id.toString(),
        bookingId: invoice.reservationId.toString(),
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        status: status,
        createdAt: formatDate(invoice.date),
        dueDate: formatDate(dueDate),
        customerId: invoice.customerId.toString(),
        booking: {
          id: invoice.reservationId.toString(),
          roomName: `${invoice.roomType.charAt(0).toUpperCase() + invoice.roomType.slice(1)} Room`,
          checkIn: formatDate(invoice.checkIn),
          checkOut: formatDate(invoice.checkOut),
          guests: numberOfNights // Using nights as placeholder since we don't have guest count
        },
        payments: payments
          .map(p => ({
            id: p.id.toString(),
            amount: parseFloat(p.amount),
            method: p.type,
            date: formatDate(p.date)
          }))
          .filter(p => p.date !== null) // Filter out payments with invalid dates
      };
    });

    return await Promise.all(invoicePromises);
  }

  async getInvoiceById(invoiceId) {
    const invoices = await query(
      `SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId,
              i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId,
              r.type as roomType, r.price as roomPrice,
              res.start_date as checkIn, res.end_date as checkOut,
              u.name as customerName, u.user_id as customerId
       FROM INVOICE i
       JOIN ROOM r ON i.ROOM_room_id = r.room_id
       JOIN RESERVATION res ON i.RESERVATION_reservvaion_id = res.reservvaion_id
       JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       WHERE i.invoce_id = ?`,
      [invoiceId]
    );
    console.log('Invoice query result:', invoices);
    if (invoices.length === 0) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }

    const invoice = invoices[0];

    // Get payments for this invoice
    const payments = await query(
      'SELECT payment_id as id, type, amount, date FROM PAYMENT WHERE INVOICE_invoce_id = ?',
      [invoiceId]
    );

    const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalAmount = parseFloat(invoice.amount);
    const remainingAmount = totalAmount - paidAmount;

    // Determine status
    let status = 'pending';
    if (paidAmount === 0) {
      status = 'pending';
    } else if (paidAmount >= totalAmount) {
      status = 'paid';
    } else {
      status = 'partial';
    }

    // Helper function to safely format date
    const formatDate = (dateValue) => {
      if (!dateValue) return null;
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    };

    // Calculate due date (30 days from invoice date)
    const invoiceDate = new Date(invoice.date);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // Calculate number of nights
    const checkInDate = new Date(invoice.checkIn);
    const checkOutDate = new Date(invoice.checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    return {
      id: invoice.id.toString(),
      bookingId: invoice.reservationId.toString(),
      totalAmount: totalAmount,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      status: status,
      createdAt: formatDate(invoice.date),
      dueDate: formatDate(dueDate),
      customerId: invoice.customerId.toString(),
      booking: {
        id: invoice.reservationId.toString(),
        roomName: `${invoice.roomType.charAt(0).toUpperCase() + invoice.roomType.slice(1)} Room`,
        checkIn: formatDate(invoice.checkIn),
        checkOut: formatDate(invoice.checkOut),
        guests: numberOfNights
      },
      payments: payments.map(p => ({
        id: p.id.toString(),
        amount: parseFloat(p.amount),
        method: p.type,
        date: formatDate(p.date)
      })).filter(p => p.date !== null), // Filter out payments with invalid dates
      // Additional fields for frontend compatibility
      reservationId: invoice.reservationId.toString(),
      roomId: invoice.roomId.toString(),
      roomType: invoice.roomType,
      visitorId: invoice.visitorId.toString(),
      date: formatDate(invoice.date),
      customerName: invoice.customerName,
      amount: totalAmount
    };
  }

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

  async getAllInvoicesForVisitor(visitorId) {
    // Get all invoices for a visitor with full details
    const invoices = await query(
      `SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId,
              i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId,
              r.type as roomType, r.price as roomPrice,
              res.start_date as checkIn, res.end_date as checkOut,
              u.name as customerName, u.user_id as customerId
       FROM INVOICE i
       JOIN ROOM r ON i.ROOM_room_id = r.room_id
       JOIN RESERVATION res ON i.RESERVATION_reservvaion_id = res.reservvaion_id
       JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       WHERE v.visitor_id = ?
       ORDER BY i.date DESC`,
      [visitorId]
    );

    // Helper function to safely format date
    const formatDate = (dateValue) => {
      if (!dateValue) return null;
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    };

    // For each invoice, get payment details and calculate status
    const invoicePromises = invoices.map(async (invoice) => {
      // Get payments for this invoice
      const payments = await query(
        'SELECT payment_id as id, type, amount, date FROM PAYMENT WHERE INVOICE_invoce_id = ?',
        [invoice.id]
      );

      const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalAmount = parseFloat(invoice.amount);
      const remainingAmount = totalAmount - paidAmount;

      // Determine status
      let status = 'pending';
      if (paidAmount === 0) {
        status = 'pending';
      } else if (paidAmount >= totalAmount) {
        status = 'paid';
      } else {
        status = 'partial';
      }

      // Calculate due date (30 days from invoice date)
      const invoiceDate = new Date(invoice.date);
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);

      // Calculate number of nights
      const checkInDate = new Date(invoice.checkIn);
      const checkOutDate = new Date(invoice.checkOut);
      const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      return {
        id: invoice.id.toString(),
        bookingId: invoice.reservationId.toString(),
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        status: status,
        createdAt: formatDate(invoice.date),
        dueDate: formatDate(dueDate),
        customerId: invoice.customerId.toString(),
        booking: {
          id: invoice.reservationId.toString(),
          roomName: `${invoice.roomType.charAt(0).toUpperCase() + invoice.roomType.slice(1)} Room`,
          checkIn: formatDate(invoice.checkIn),
          checkOut: formatDate(invoice.checkOut),
          guests: numberOfNights // Using nights as placeholder since we don't have guest count
        },
        payments: payments
          .map(p => ({
            id: p.id.toString(),
            amount: parseFloat(p.amount),
            method: p.type,
            date: formatDate(p.date)
          }))
          .filter(p => p.date !== null) // Filter out payments with invalid dates
      };
    });

    return await Promise.all(invoicePromises);
  }

  async getInvoicesByVisitor(visitorId) {
    // This method is kept for backward compatibility but delegates to getAllInvoicesForVisitor
    return this.getAllInvoicesForVisitor(visitorId);
  }

  async getInvoicesByReservation(reservationId) {
    const invoices = await query(
      `SELECT i.invoce_id as id, i.amount, i.date, i.VISITOR_visitor_id as visitorId,
              i.ROOM_room_id as roomId, i.RESERVATION_reservvaion_id as reservationId,
              r.type as roomType
       FROM INVOICE i
       JOIN ROOM r ON i.ROOM_room_id = r.room_id
       WHERE i.RESERVATION_reservvaion_id = ?`,
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
