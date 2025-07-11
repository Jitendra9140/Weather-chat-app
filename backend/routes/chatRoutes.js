import express from 'express';
import { saveMessage, getChatHistory, deleteChat } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Save a chat message
 * @access  Private (requires authentication)
 */
router.post('/', authenticateToken, saveMessage);

/**
 * @route   GET /api/chat/:threadId?
 * @desc    Get chat history for a user (all chats or specific thread)
 * @access  Private (requires authentication)
 */
router.get('/:threadId?', authenticateToken, getChatHistory);

/**
 * @route   DELETE /api/chat/:threadId
 * @desc    Delete a chat thread
 * @access  Private (requires authentication)
 */
router.delete('/:threadId', authenticateToken, deleteChat);

export default router;