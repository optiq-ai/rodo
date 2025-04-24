import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route component that redirects to login if user is not authenticated
const ProtectedRoute = ({ element, children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render element if provided (for Route element={<ProtectedRoute element={<Component />} />} syntax)
  if (element) {
    return element;
  }
  
  // Render children if provided (for older <ProtectedRoute>children</ProtectedRoute> syntax)
  return children;
};

export default ProtectedRoute;
