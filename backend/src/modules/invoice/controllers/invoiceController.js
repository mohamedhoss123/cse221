const invoiceService = require('../services/invoiceService');

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    res.status(200).json({
      success: true,
      data: invoice
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
  getInvoicesByVisitor,
  getInvoicesByReservation
};
