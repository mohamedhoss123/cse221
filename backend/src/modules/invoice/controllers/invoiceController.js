const invoiceService = require('../services/invoiceService');

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    // Check if the invoice belongs to the authenticated user
    // console.log('Authenticated user:', req.user);
    // console.log('Invoice customer ID:', invoice);
    if (invoice.visitorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this invoice'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

const getAllInvoices = async (req, res, next) => {
  try {
    // Get customer ID from JWT token
    const customerId = req.user.userId;

    const invoices = await invoiceService.getAllInvoicesForCustomer(customerId);

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

const getInvoicesByVisitor = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoicesByVisitor(req.params.visitorId);

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

const getInvoicesByReservation = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoicesByReservation(req.params.reservationId);

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoiceById,
  getAllInvoices,
  getInvoicesByVisitor,
  getInvoicesByReservation
};
