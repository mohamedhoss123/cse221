const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const paymentController = require('./payment.controller');

// All routes require authentication
router.use(authMiddleware);

// Create payment for invoice
router.post('/invoices/:id/payments', paymentController.createPayment);

// Get payments for invoice
router.get('/invoices/:id/payments', paymentController.getPaymentsByInvoice);

// Delete payment (admin only)
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
