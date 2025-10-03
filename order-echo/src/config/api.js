// API Configuration for different environments
const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Development environment (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // 3. Production environment - Use same origin with port 8000
  // This allows the frontend to work on any domain without hardcoding IPs
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname;  // orderecho.io or 3.99.0.53
  
  // If using the production domain (orderecho.io), use the backend API subdomain or port
  if (hostname === 'orderecho.io' || hostname === 'www.orderecho.io') {
    // Option A: Use subdomain (requires DNS A record for api.orderecho.io)
    // return `${protocol}//api.orderecho.io`;
    
    // Option B: Use same host with port 8000 (current setup)
    return `${protocol}//${hostname}:8000`;
  }
  
  // 4. Fallback for AWS IP or other hostnames - use same origin with port 8000
  return `${protocol}//${hostname}:8000`;
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
