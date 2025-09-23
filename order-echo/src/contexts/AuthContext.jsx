import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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
            id: payload.userId,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName
          });
          setIsAuthenticated(true);
          setLoading(false);
          
          // Verify token in background (non-blocking)
          verifyToken(token);
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

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5174/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Update user data if it's different from token payload
        setUser(userData.user);
        setIsAuthenticated(true);
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
      const response = await fetch('http://localhost:5174/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
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
      const response = await fetch('http://localhost:5174/api/auth/signup', {
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
      const response = await fetch('http://localhost:5174/api/auth/forgot-password', {
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
      const response = await fetch('http://localhost:5174/api/auth/reset-password', {
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
