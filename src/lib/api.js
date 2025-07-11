import axios from 'axios';
import { API_CONFIG } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Weather API calls
export const weatherAPI = {
  sendMessage: async (message, threadId = API_CONFIG.THREAD_ID) => {
    try {
      const response = await api.post('/weather', { message, threadId }, {
        responseType: 'stream'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Mastra Weather API calls
export const mastraWeatherAPI = {
  sendMessage: async (message, threadId = API_CONFIG.THREAD_ID) => {
    try {
      // Use fetch instead of axios for better stream handling
      const response = await fetch(`${api.defaults.baseURL}/mastra-weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({ message, threadId }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Chat history API calls
export const chatAPI = {
  // Get chat history for a specific thread or all chats
  getChatHistory: async (threadId = null) => {
    try {
      const url = threadId 
        ? `${api.defaults.baseURL}/chat/${threadId}` 
        : `${api.defaults.baseURL}/chat`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Delete a chat thread
  deleteChat: async (threadId) => {
    try {
      const response = await api.delete(`${api.defaults.baseURL}/chat/${threadId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default api;