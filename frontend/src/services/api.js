import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Chat API functions
export const sendMessage = async (message, sessionId = null) => {
  try {
    const response = await api.post('/chat/message', {
      message,
      sessionId,
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to send message');
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to get chat history');
  }
};

export const clearChatHistory = async (sessionId) => {
  try {
    const response = await api.delete(`/chat/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to clear chat history');
  }
};

export const getSuggestions = async () => {
  try {
    const response = await api.get('/chat/suggestions');
    return response.data.suggestions || [];
  } catch (error) {
    console.warn('Failed to load suggestions:', error.message);
    // Return default suggestions if API fails
    return [
      "What is the Aven Card?",
      "How do I apply for an Aven Card?",
      "What are the fees?",
      "How does the interest rate work?",
      "Can I get cashback rewards?"
    ];
  }
};

// Admin API functions
export const getStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to get stats');
  }
};

export const reindexKnowledgeBase = async () => {
  try {
    const response = await api.post('/admin/reindex');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to reindex knowledge base');
  }
};

export const testRetrieval = async (query, topK = 5) => {
  try {
    const response = await api.post('/admin/test-retrieval', {
      query,
      topK,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to test retrieval');
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api; 