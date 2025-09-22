import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - requireAuth:', requireAuth, 'isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    console.log('ProtectedRoute - showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute - redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    console.log('ProtectedRoute - redirecting to dashboard');
    // Redirect authenticated users away from auth pages
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute - rendering children');
  return children;
};

export default ProtectedRoute;
