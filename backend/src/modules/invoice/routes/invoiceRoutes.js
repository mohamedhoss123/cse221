const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Get invoices by visitor ID
router.get('/visitor/:visitorId', invoiceController.getInvoicesByVisitor);

// Get invoices by reservation ID
router.get('/reservation/:reservationId', invoiceController.getInvoicesByReservation);

module.exports = router;
