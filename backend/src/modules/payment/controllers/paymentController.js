const paymentService = require('../services/paymentService');
const invoiceService = require('../../invoice/services/invoiceService');

const createPayment = async (req, res, next) => {
  try {
    const invoiceId = req.params.id; // Route uses :id, not :invoiceId
    const { amount, method } = req.body;

    // Validate input
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
      const invoiceForAuth = await invoiceService.getInvoiceById(invoiceId);
      if (invoiceForAuth.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create payments for this invoice'
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
    const invoiceId = req.params.id; // Route uses :id, not :invoiceId

    const payments = await paymentService.getPaymentsByInvoice(invoiceId);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPaymentsByInvoice
};
