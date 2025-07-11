import express from 'express';
import { signup, login, validateToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/validate
 * @desc    Validate user token
 * @access  Private
 */
router.get('/validate', authenticateToken, validateToken);

export default router;