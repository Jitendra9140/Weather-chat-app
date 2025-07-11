import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const serverConfig = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'weatherchat-secret-key'
};

export const weatherApiConfig = {
  endpoint: process.env.WEATHER_API_ENDPOINT,
  headers: {
    'Accept': '*/*',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'x-mastra-dev-playground': 'true'
  }
};

export const CHAT_CONFIG = {
  MAX_RETRIES: 2,
  MAX_STEPS: 5,
  TEMPERATURE: 0.5,
  TOP_P: 1,
};