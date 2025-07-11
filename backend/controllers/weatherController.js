import axios from 'axios';
import { weatherApiConfig } from '../config/config.js';
import { createWeatherRequestSchema } from '../schemas/weatherSchema.js';
import { authenticateToken } from '../middleware/auth.js';

/**
 * Controller to handle weather API requests
 */
export const getWeatherInfo = async (req, res) => {
  const { message, threadId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Create request payload using schema
    const payload = createWeatherRequestSchema(message, threadId);
    
    // Set up response as a stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Make request to weather API
    const response = await axios({
      method: 'post',
      url: weatherApiConfig.endpoint,
      headers: weatherApiConfig.headers,
      data: payload,
      responseType: 'stream'
    });
    
    // Pipe the stream directly to our response
    response.data.pipe(res);
    
    // Handle errors in the stream
    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error processing weather data stream' });
      } else {
        res.end();
      }
    });
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to fetch weather data', 
        details: error.message 
      });
    } else {
      res.end();
    }
  }
};