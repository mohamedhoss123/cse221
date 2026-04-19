const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../../middleware/auth');
const invoiceController = require('../controllers/invoiceController');
const paymentController = require('../../payment/controllers/paymentController');

// All invoice routes require authentication
router.use(authMiddleware);

// Get all invoices for the authenticated customer
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID (only customer's own invoices)
router.get('/:id', invoiceController.getInvoiceById);

// Create payment for invoice
router.post('/:id/payment', paymentController.createPayment);

// Get payments for invoice
router.get('/:id/payments', paymentController.getPaymentsByInvoice);

// Get invoices by visitor ID
router.get('/visitor/:visitorId', invoiceController.getInvoicesByVisitor);

// Get invoices by reservation ID
router.get('/reservation/:reservationId', invoiceController.getInvoicesByReservation);

module.exports = router;
