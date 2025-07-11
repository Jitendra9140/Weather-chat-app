import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/config.js';
import connectDB from './config/database.js';
import weatherRoutes from './routes/weatherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mastraWeatherRoutes from './routes/mastraWeatherRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/mastra-weather', mastraWeatherRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB and start server
const PORT = serverConfig.port;

// Connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(`Failed to start server: ${err.message}`);
});