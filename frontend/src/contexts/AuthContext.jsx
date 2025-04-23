import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (from JWT token)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Set axios default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // In a real implementation, you might want to validate the token
        // or fetch user details from the backend
        setCurrentUser({ token });
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post("http://localhost:8080/login", {
        login: username,
        password: password.split(''),
      });
      
      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set axios default headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser({ token });
      
      return { token };
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call the registration endpoint
      // For now, we'll just redirect to login
      return { success: true };
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.roles && currentUser.roles.includes(role);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
