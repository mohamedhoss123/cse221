const express = require('express');
const router = express.Router();
const analyticsService = require('./analytics.service');
const { authMiddleware } = require('../../middleware/auth');
const { adminMiddleware } = require('../../middleware/admin');

// All analytics routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Get complete analytics (recommended - single call)
router.get('/complete', async (req, res, next) => {
  try {
    const data = await analyticsService.getCompleteAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get overall statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await analyticsService.getOverallStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Get monthly trends
router.get('/trends', async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const trends = await analyticsService.getMonthlyTrends(months);
    res.json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
});

// Get booking status distribution
router.get('/booking-status', async (req, res, next) => {
  try {
    const distribution = await analyticsService.getBookingStatusDistribution();
    res.json({ success: true, data: distribution });
  } catch (error) {
    next(error);
  }
});

// Get most booked rooms
router.get('/top-rooms', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const rooms = await analyticsService.getMostBookedRooms(limit);
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
});

// Get room type distribution
router.get('/room-types', async (req, res, next) => {
  try {
    const types = await analyticsService.getRoomTypeDistribution();
    res.json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
