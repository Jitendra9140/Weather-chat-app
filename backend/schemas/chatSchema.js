import mongoose from 'mongoose';

/**
 * Weather Data Schema for MongoDB
 */
const weatherDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  feelsLike: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  windSpeed: {
    type: Number,
    required: true
  },
  windGust: {
    type: Number,
    required: true
  },
  conditions: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

/**
 * Message Schema for MongoDB
 */
const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'system', 'error'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  weatherData: weatherDataSchema
});

/**
 * Chat Schema for MongoDB
 */
const chatSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;