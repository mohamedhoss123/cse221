const invoiceService = require('./invoice.service');

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    // Check ownership for visitors
    if (req.user.role === 'visitor') {
      if (invoice.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
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
    // Visitors get their own invoices, admins get all
    const visitorId = req.user.role === 'visitor' ? req.user.visitorId : null;
    const invoices = await invoiceService.getAllInvoices(visitorId);

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
  getInvoicesByReservation
};
