const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { validate } = require('../../middleware/validation');
const { authMiddleware } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('./room.controller');

const createRoomValidation = [
  body('type').isIn(['standard', 'deluxe', 'suite', 'penthouse']).withMessage('Invalid room type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  validate
];

const updateRoomValidation = [
  param('id').isInt().withMessage('Invalid room ID'),
  body('type').optional().isIn(['standard', 'deluxe', 'suite', 'penthouse']).withMessage('Invalid room type'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  validate
];

const getRoomValidation = [
  param('id').isInt().withMessage('Invalid room ID'),
  validate
];

const filtersValidation = [
  query('type').optional().isIn(['standard', 'deluxe', 'suite', 'penthouse']).withMessage('Invalid room type'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  query('available').optional().isIn(['true', 'false']).withMessage('Available must be true or false'),
  validate
];

const deleteRoomValidation = [
  param('id').isInt().withMessage('Invalid room ID'),
  validate
];

router.get('/', authMiddleware, filtersValidation, getAllRooms);
router.get('/:id', authMiddleware, getRoomValidation, getRoomById);
router.post('/', authMiddleware, upload.array('images', 10), createRoomValidation, createRoom);
router.put('/:id', authMiddleware, upload.array('images', 10), updateRoomValidation, updateRoom);
router.delete('/:id', authMiddleware, deleteRoomValidation, deleteRoom);

module.exports = router;
