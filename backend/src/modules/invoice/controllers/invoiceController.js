const invoiceService = require('../services/invoiceService');

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    // Check if the invoice belongs to the authenticated user
    // For visitors, compare visitorId from JWT with invoice's visitorId
    // For admins, allow access to any invoice
    console.log('Authenticated user:', req.user);
    console.log('Invoice visitorId:', invoice);
    if (req.user.role === 'visitor') {
      if (invoice.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this invoice'
        });
      }
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
    // Get visitor ID from JWT token (for visitors) or use userId (for admins)
    const visitorId = req.user.role === 'visitor' ? req.user.visitorId : null;

    const invoices = await invoiceService.getAllInvoicesForVisitor(visitorId);

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
