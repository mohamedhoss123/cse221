const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { validate } = require('../../middleware/validation');
const { authMiddleware } = require('../../middleware/auth');
const {
  register,
  login,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('./user.controller');

const registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const getUserValidation = [
  param('id').isInt().withMessage('Invalid user ID'),
  validate
];

const updateUserValidation = [
  param('id').isInt().withMessage('Invalid user ID'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  validate
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

router.get('/profile', authMiddleware, getProfile);

router.get('/', authMiddleware, paginationValidation, getAllUsers);
router.get('/:id', authMiddleware, getUserValidation, getUserById);
router.put('/:id', authMiddleware, updateUserValidation, updateUser);
router.delete('/:id', authMiddleware, getUserValidation, deleteUser);

module.exports = router;
