// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (deployed on AWS)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Production environment - using your AWS server
    return 'http://3.99.0.53:8000'; // Your AWS server IP with Python backend port
  }
  
  // Development environment
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`
  },
  FRONTEND: {
    ORDERS: (accountId) => `${API_BASE_URL}/api/orders/${accountId}`,
    CALL_HISTORY: (accountId) => `${API_BASE_URL}/api/call-history/${accountId}`,
    DASHBOARD: (accountId) => `${API_BASE_URL}/api/dashboard/${accountId}`
  },
  HEALTH: `${API_BASE_URL}/api/health`
};

// Log the API configuration for debugging
console.log('API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
  endpoints: API_ENDPOINTS
});
