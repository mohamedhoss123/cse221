const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All payment routes require authentication
router.use(authMiddleware);

// Create payment for invoice
router.post('/invoices/:invoiceId/payment', paymentController.createPayment);

// Get payments for invoice
router.get('/invoices/:invoiceId/payments', paymentController.getPaymentsByInvoice);

module.exports = router;
