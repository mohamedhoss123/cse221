const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const complaintController = require('./complaint.controller');

// All routes require authentication
router.use(authMiddleware);

// Get all complaints (visitors see their own, admins see all)
router.get('/', complaintController.getAllComplaints);

// Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// Create complaint
router.post('/', complaintController.createComplaint);

// Update complaint (admin only)
router.put('/:id', complaintController.updateComplaint);

// Delete complaint (admin only)
router.delete('/:id', complaintController.deleteComplaint);

// Get statistics (admin only)
router.get('/statistics', complaintController.getStatistics);

module.exports = router;
