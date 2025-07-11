import Chat from '../schemas/chatSchema.js';

/**
 * Save chat message to MongoDB
 */
export const saveMessage = async (req, res) => {
  try {
    const { threadId, message, weatherData } = req.body;
    const userId = req.user._id;

    if (!threadId || !message) {
      return res.status(400).json({ error: 'ThreadId and message are required' });
    }

    // Find existing chat or create a new one
    let chat = await Chat.findOne({ threadId, userId });

    if (!chat) {
      chat = new Chat({
        threadId,
        userId,
        messages: []
      });
    }

    // Add new message to chat
    chat.messages.push({
      messageId: `msg-${Date.now()}`,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || new Date(),
      weatherData: weatherData || null
    });

    // Save chat
    await chat.save();

    res.status(201).json({ success: true, chatId: chat._id });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

/**
 * Get chat history for a user
 */
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { threadId } = req.params;

    // Find chat by threadId and userId
    const chat = threadId
      ? await Chat.findOne({ threadId, userId })
      : await Chat.find({ userId }).sort({ updatedAt: -1 });

    if (!chat && threadId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

/**
 * Delete chat history
 */
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { threadId } = req.params;

    if (!threadId) {
      return res.status(400).json({ error: 'ThreadId is required' });
    }

    // Delete chat by threadId and userId
    const result = await Chat.findOneAndDelete({ threadId, userId });

    if (!result) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};