import express from 'express';
import { getWeatherInfo } from '../controllers/weatherController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/weather
 * @desc    Get weather information
 * @access  Public
 */
router.post('/', authenticateToken, getWeatherInfo);

export default router;