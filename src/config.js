// API Configuration
export const API_CONFIG = {
  ENDPOINT: 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream', // Updated to point to our backend
  HEADERS: {
    'Accept': '*/*',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json'
  },
  THREAD_ID:2, // User's college roll number
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_RETRIES: 2,
  MAX_STEPS: 5,
  TEMPERATURE: 0.5,
  TOP_P: 1,
};