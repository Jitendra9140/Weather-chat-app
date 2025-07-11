import axios from 'axios';
import { CHAT_CONFIG } from '../config/config.js';
import Chat from '../schemas/chatSchema.js';

/**
 * Parse weather data from API response
 */
const parseWeatherData = (responseText) => {
  try {
    // Look for the tool call result containing weather data
    const toolCallMatch = responseText.match(/a:\{"toolCallId":"[^"]+","result":(\{[^}]+\})\}/i);
    
    if (toolCallMatch && toolCallMatch[1]) {
      return JSON.parse(toolCallMatch[1]);
    }
    return null;
  } catch (error) {
    console.error('Error parsing weather data:', error);
    return null;
  }
};

/**
 * Controller to handle Mastra Weather API requests
 */
export const getMastraWeatherInfo = async (req, res) => {
  const { message, threadId } = req.body;
  const userId = req.user._id;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Create request payload exactly matching the required format
    const payload = {
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      runId: 'weatherAgent',
      maxRetries: CHAT_CONFIG.MAX_RETRIES,
      maxSteps: CHAT_CONFIG.MAX_STEPS,
      temperature: CHAT_CONFIG.TEMPERATURE,
      topP: CHAT_CONFIG.TOP_P,
      runtimeContext: {},
      threadId: 2,
      resourceId: 'weatherAgent'
    };
    
    // Set up response as a stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Make request to Mastra Weather API with exact headers as specified in curl command
    const response = await axios({
      method: 'post',
      url: 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream',
      headers: {
        'Content-Type': 'application/json',
        'x-mastra-dev-playground': 'true'
      },
      data: payload,
      responseType: 'stream'
    });
    
    // Collect the full response to parse weather data
    let fullResponse = '';
    
    // Pipe the stream directly to our response
    response.data.pipe(res);
    
    // Collect data for processing
    response.data.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      fullResponse += chunkStr;
    });
    
    // When the stream ends, save the data to MongoDB
    response.data.on('end', async () => {
      try {
        // Parse weather data from the response
        const weatherData = parseWeatherData(fullResponse);
        
        // Find or create chat thread
        let chat = await Chat.findOne({ threadId: threadId || '2', userId });
        
        if (!chat) {
          chat = new Chat({
            threadId: threadId || '2',
            userId,
            messages: []
          });
        }
        
        // Add user message
        chat.messages.push({
          messageId: `msg-user-${Date.now()}`,
          role: 'user',
          content: message,
          timestamp: new Date()
        });
        
        // Extract agent response from the stream
        const agentResponseMatch = fullResponse.match(/0:"([^"]+)"/g);
        let agentContent = '';
        
        if (agentResponseMatch) {
          agentContent = agentResponseMatch
            .map(match => match.substring(3, match.length - 1))
            .join('');
        }
        
        // Add agent message with weather data
        chat.messages.push({
          messageId: `msg-agent-${Date.now()}`,
          role: 'agent',
          content: agentContent,
          timestamp: new Date(),
          weatherData: weatherData
        });
        
        // Save chat
        await chat.save();
      } catch (error) {
        console.error('Error saving chat data:', error);
      }
    });
    
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
    console.error('Error fetching Mastra weather data:', error);
    
    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to fetch Mastra weather data', 
        details: error.message 
      });
    } else {
      res.end();
    }
  }
};