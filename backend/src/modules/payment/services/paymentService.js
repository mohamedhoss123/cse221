const { query } = require('../../../database/connection');
const invoiceService = require('../../invoice/services/invoiceService');

class PaymentService {
  async createPaymentForInvoice(paymentData) {
    const { invoiceId, amount, method } = paymentData;

    // Verify invoice exists
    const invoice = await invoiceService.getInvoiceById(invoiceId);

    // Calculate current paid amount
    const currentPaidAmount = invoice.paidAmount || 0;
    const newPaidAmount = currentPaidAmount + amount;

    // Create the payment
    const date = new Date().toISOString().split('T')[0];
    const result = await query(
      'INSERT INTO PAYMENT (type, amount, date, INVOICE_invoce_id) VALUES (?, ?, ?, ?)',
      [method, amount, date, invoiceId]
    );

    const paymentId = result.insertId;

    // Get the created payment
    const payments = await query(
      'SELECT payment_id as id, type, amount, date FROM PAYMENT WHERE payment_id = ?',
      [paymentId]
    );

    const payment = payments[0];

    // Return updated invoice
    return await invoiceService.getInvoiceById(invoiceId);
  }

  async getPaymentsByInvoice(invoiceId) {
    const payments = await query(
      'SELECT payment_id as id, type, amount, date, INVOICE_invoce_id as invoiceId FROM PAYMENT WHERE INVOICE_invoce_id = ? ORDER BY date DESC',
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
}

module.exports = new PaymentService();
