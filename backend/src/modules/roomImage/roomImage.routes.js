const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const roomImageController = require('./roomImage.controller');

// All routes require authentication
router.use(authMiddleware);

// Get all images for a room
router.get('/room/:roomId', roomImageController.getRoomImages);

// Add image to room (admin only)
router.post('/room/:roomId', upload.single('image'), roomImageController.addImage);

// Delete image (admin only)
router.delete('/image/:imageId', roomImageController.deleteImage);

// Set image as primary (admin only)
router.patch('/image/:imageId/set-primary', roomImageController.setAsPrimary);

module.exports = router;
