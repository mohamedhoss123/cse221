const paymentService = require('./payment.service');
const invoiceService = require('../invoice/invoice.service');

const createPayment = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    if (!method || !['credit_card', 'debit_card', 'paypal', 'bank_transfer'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Verify invoice belongs to authenticated user
    if (req.user.role === 'visitor') {
      const invoice = await invoiceService.getInvoiceById(invoiceId);
      if (invoice.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const invoice = await paymentService.createPaymentForInvoice({
      invoiceId,
      amount,
      method
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentsByInvoice = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByInvoice(req.params.id);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete payments'
      });
    }

    const result = await paymentService.deletePayment(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPaymentsByInvoice,
  deletePayment
};
