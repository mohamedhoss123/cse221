const { query } = require('../../database/connection');
const { createError, formatDate, calculateInvoiceStatus } = require('../../utils/helpers');

class PaymentService {
  async createPaymentForInvoice(paymentData) {
    const { invoiceId, amount, method } = paymentData;

     // Verify invoice exists and get details
     const invoices = await query(
       'SELECT invoice_id, amount, status, RESERVATION_reservation_id as reservationId FROM INVOICE WHERE invoice_id = ?',
       [invoiceId]
     );

    if (invoices.length === 0) {
      throw createError('Invoice not found', 404);
    }

    const invoice = invoices[0];

    // Prevent payment on already paid invoice
    if (invoice.status === 'paid') {
      throw createError('Invoice is already fully paid', 400);
    }

    // Get all existing payments for this invoice
    const payments = await query(
      'SELECT amount FROM PAYMENT WHERE INVOICE_invoice_id = ?',
      [invoiceId]
    );

    // Calculate current paid amount
    const currentPaidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Validate payment amount doesn't exceed remaining balance
    const remainingAmount = invoice.amount - currentPaidAmount;
    if (amount > remainingAmount) {
      throw createError(`Payment amount ($${amount}) exceeds remaining balance ($${remainingAmount.toFixed(2)})`, 400);
    }

    // Calculate new paid amount
    const newPaidAmount = currentPaidAmount + amount;

    // Create the payment
    const date = formatDate(new Date());
    const result = await query(
      'INSERT INTO PAYMENT (type, amount, date, INVOICE_invoice_id) VALUES (?, ?, ?, ?)',
      [method, amount, date, invoiceId]
    );

    const paymentId = result.insertId;

     // Calculate and update invoice status based on new paid amount
     const newStatus = calculateInvoiceStatus(invoice.amount, newPaidAmount);

     await query(
       'UPDATE INVOICE SET status = ? WHERE invoice_id = ?',
       [newStatus, invoiceId]
     );

      // If invoice is now fully paid, confirm the associated booking
      if (newStatus === 'paid') {
        await query(
          'UPDATE RESERVATION SET status = ? WHERE reservation_id = ?',
          ['confirmed', invoice.reservationId]
        );
      }

    // Get all payments for the updated invoice
    const updatedPayments = await query(
      'SELECT payment_id as id, type, amount, date FROM PAYMENT WHERE INVOICE_invoice_id = ? ORDER BY date DESC',
      [invoiceId]
    );

    // Get updated invoice details
    const updatedInvoices = await query(
      `SELECT i.invoice_id as id, i.amount, i.date, i.status, i.due_date, i.VISITOR_visitor_id as visitorId,
              i.ROOM_room_id as roomId, i.RESERVATION_reservation_id as reservationId,
              r.type as roomType, r.price as roomPrice,
              res.start_date as checkIn, res.end_date as checkOut,
              u.name as customerName, u.user_id as customerId
       FROM INVOICE i
       JOIN ROOM r ON i.ROOM_room_id = r.room_id
       JOIN RESERVATION res ON i.RESERVATION_reservation_id = res.reservation_id
       JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
       JOIN USER u ON v.USER_user_id = u.user_id
       WHERE i.invoice_id = ?`,
      [invoiceId]
    );

    if (updatedInvoices.length === 0) {
      throw createError('Failed to retrieve updated invoice', 500);
    }

    const updatedInvoice = updatedInvoices[0];

    // Calculate remaining amount
    const remainingAmountAfterPayment = invoice.amount - newPaidAmount;

    return {
      id: updatedInvoice.id.toString(),
      bookingId: updatedInvoice.reservationId.toString(),
      totalAmount: parseFloat(updatedInvoice.amount),
      paidAmount: newPaidAmount,
      remainingAmount: remainingAmountAfterPayment,
      status: newStatus,
      createdAt: updatedInvoice.date,
      dueDate: updatedInvoice.due_date,
      customerId: updatedInvoice.customerId.toString(),
      booking: {
        id: updatedInvoice.reservationId.toString(),
        roomName: `${updatedInvoice.roomType.charAt(0).toUpperCase() + updatedInvoice.roomType.slice(1)} Room`,
        checkIn: updatedInvoice.checkIn,
        checkOut: updatedInvoice.checkOut,
        guests: 0 // Will be calculated by invoice service if needed
      },
      payments: updatedPayments
        .map(p => ({
          id: p.id.toString(),
          amount: parseFloat(p.amount),
          method: p.type,
          date: p.date
        }))
        .filter(p => p.date !== null),
      // Additional fields for frontend compatibility
      reservationId: updatedInvoice.reservationId.toString(),
      roomId: updatedInvoice.roomId.toString(),
      roomType: updatedInvoice.roomType,
      visitorId: updatedInvoice.visitorId.toString(),
      date: updatedInvoice.date,
      customerName: updatedInvoice.customerName,
      amount: parseFloat(updatedInvoice.amount)
    };
  }

  async getPaymentsByInvoice(invoiceId) {
    const payments = await query(
      'SELECT payment_id as id, type, amount, date, INVOICE_invoice_id as invoiceId FROM PAYMENT WHERE INVOICE_invoice_id = ? ORDER BY date DESC',
      [invoiceId]
    );

    return payments.map(payment => ({
      id: payment.id.toString(),
      amount: parseFloat(payment.amount),
      method: payment.type,
      date: payment.date,
      invoiceId: payment.invoiceId.toString()
    }));
  }

  /**
   * Recalculate and update invoice status based on payments
   * Useful for fixing inconsistent invoice statuses
   * @param {string} invoiceId - Invoice ID to update
   * @returns {object} Updated invoice
   */
  async updateInvoiceStatus(invoiceId) {
    // Get invoice details
    const invoices = await query(
      'SELECT invoice_id, amount, status FROM INVOICE WHERE invoice_id = ?',
      [invoiceId]
    );

    if (invoices.length === 0) {
      throw createError('Invoice not found', 404);
    }

    const invoice = invoices[0];

    // Get all payments for this invoice
    const payments = await query(
      'SELECT amount FROM PAYMENT WHERE INVOICE_invoice_id = ?',
      [invoiceId]
    );

    // Calculate total paid amount
    const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Calculate new status
    const newStatus = calculateInvoiceStatus(invoice.amount, paidAmount);

    // Update invoice status in database
    await query(
      'UPDATE INVOICE SET status = ? WHERE invoice_id = ?',
      [newStatus, invoiceId]
    );

    return {
      invoiceId: invoiceId.toString(),
      previousStatus: invoice.status,
      newStatus: newStatus,
      totalAmount: parseFloat(invoice.amount),
      paidAmount: paidAmount,
      remainingAmount: invoice.amount - paidAmount
    };
  }

  /**
   * Update all invoice statuses based on their payments
   * Useful for data migration or bulk status fixes
   * @returns {object} Summary of updated invoices
   */
  async updateAllInvoiceStatuses() {
    // Get all invoices
    const invoices = await query(
      'SELECT invoice_id, amount, status FROM INVOICE'
    );

    let updatedCount = 0;
    const results = [];

    for (const invoice of invoices) {
      // Get all payments for this invoice
      const payments = await query(
        'SELECT amount FROM PAYMENT WHERE INVOICE_invoice_id = ?',
        [invoice.invoice_id]
      );

      // Calculate total paid amount
      const paidAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      // Calculate new status
      const newStatus = calculateInvoiceStatus(invoice.amount, paidAmount);

      // Only update if status has changed
      if (newStatus !== invoice.status) {
        await query(
          'UPDATE INVOICE SET status = ? WHERE invoice_id = ?',
          [newStatus, invoice.invoice_id]
        );

        updatedCount++;
        results.push({
          invoiceId: invoice.invoice_id.toString(),
          previousStatus: invoice.status,
          newStatus: newStatus
        });
      }
    }

    return {
      totalInvoices: invoices.length,
      updatedCount: updatedCount,
      updates: results
    };
  }

  /**
   * Delete a payment and update invoice status
   * @param {string} paymentId - Payment ID to delete
   * @returns {object} Deleted payment info and updated invoice status
   */
  async deletePayment(paymentId) {
    // Get payment details
    const payments = await query(
      'SELECT payment_id, INVOICE_invoice_id, amount FROM PAYMENT WHERE payment_id = ?',
      [paymentId]
    );

    if (payments.length === 0) {
      throw createError('Payment not found', 404);
    }

    const payment = payments[0];

    // Delete the payment
    await query(
      'DELETE FROM PAYMENT WHERE payment_id = ?',
      [paymentId]
    );

    // Recalculate invoice status
    const statusUpdate = await this.updateInvoiceStatus(payment.INVOICE_invoice_id);

    return {
      paymentId: paymentId.toString(),
      deletedAmount: parseFloat(payment.amount),
      invoiceId: payment.INVOICE_invoice_id.toString(),
      statusUpdate: statusUpdate
    };
  }
}

module.exports = new PaymentService();
