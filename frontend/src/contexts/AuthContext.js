import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

// Create authentication context
const AuthContext = createContext(null);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token validity
  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authAPI.verifyToken();
      if (response.valid) {
        setCurrentUser({
          username: response.username,
          email: response.email,
          role: response.role
        });
      } else {
        // If token is invalid, log out
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Set current user
      setCurrentUser({
        username: response.username || credentials.userName,
        email: response.email,
        role: response.role || 'USER'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      return { success: false, error: error.response?.data?.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Set current user
      setCurrentUser({
        username: response.username || userData.userName,
        email: response.email,
        role: response.role || 'USER'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: error.response?.data?.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
