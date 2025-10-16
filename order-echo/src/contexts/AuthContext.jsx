import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making network request
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp > now) {
          // Token is not expired, set user from token payload
          setUser({
            user_id: payload.sub,
            id: payload.sub,
            email: payload.email,
            firstName: payload.name ? payload.name.split(' ')[0] : '',
            lastName: payload.name ? payload.name.split(' ')[1] : '',
            role: payload.role || 'user'
          });
          setIsAuthenticated(true);
          setLoading(false);
          
      // Verify token in background (non-blocking)
      verifyToken(token);
      
      // Schedule token refresh check (every 30 minutes)
      const refreshInterval = setInterval(() => {
        refreshTokenIfNeeded();
      }, 30 * 60 * 1000); // 30 minutes
      
      return () => clearInterval(refreshInterval);
    } else {
      // Token is expired, remove it
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
      } catch (error) {
        // Invalid token format, remove it
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = payload.exp - now;
      
      // If token expires in less than 1 hour (3600 seconds), refresh it
      if (timeLeft < 3600 && timeLeft > 0) {
        const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Token verified successfully - session remains active');
        } else {
          // Token is invalid, logout
          logout();
        }
      }
    } catch (error) {
      console.error('Token refresh check failed:', error);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Update user data if it's different from token payload
        if (userData && userData.user) {
          console.log('Token verified, updating user data:', userData.user);
          setUser({
            id: userData.user.user_id || userData.user.id,
            user_id: userData.user.user_id || userData.user.id,
            email: userData.user.email,
            firstName: userData.user.firstName,
            lastName: userData.user.lastName,
            role: userData.user.role || 'user',
            is_active: userData.user.is_active !== undefined ? userData.user.is_active : true
          });
          setIsAuthenticated(true);
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Only remove token on network error if it's a critical error
      // For now, keep the user logged in based on token validity
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token || data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Please log in.');
        return { success: true };
      } else {
        toast.error(data.message || 'Signup failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    // Redirect to home page after logout
    window.location.href = '/';
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset email sent!');
        return { success: true };
      } else {
        toast.error(data.message || 'Failed to send reset email');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully!');
        return { success: true };
      } else {
        toast.error(data.message || 'Password reset failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
