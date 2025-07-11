import express from 'express';
import { getMastraWeatherInfo } from '../controllers/mastraWeatherController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/mastra-weather
 * @desc    Get weather information from Mastra API
 * @access  Private (requires authentication)
 */
router.post('/', authenticateToken, getMastraWeatherInfo);

export default router;