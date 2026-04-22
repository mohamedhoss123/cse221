const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const invoiceController = require('./invoice.controller');
const paymentController = require('../payment/payment.controller');

// All routes require authentication
router.use(authMiddleware);

// Get all invoices (visitors see own, admins see all)
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Get invoices by reservation ID
router.get('/reservation/:reservationId', invoiceController.getInvoicesByReservation);

// Create payment for invoice
router.post('/:id/payment', paymentController.createPayment);

// Get payments for invoice
router.get('/:id/payments', paymentController.getPaymentsByInvoice);

module.exports = router;
