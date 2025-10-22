import express from 'express';
import { body } from 'express-validator';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStatistics
} from '../controllers/userController.js';

const router = express.Router();

const userValidation = [
  body('username')
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'edit', 'read'])
    .withMessage('Invalid role')
];

router.post('/', userValidation, createUser);
router.get('/', getAllUsers);
router.get('/statistics', getUserStatistics);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;