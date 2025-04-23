import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in based on token
    const token = localStorage.getItem('token');
    if (token) {
      // Create a more complete user object with username
      setCurrentUser({ 
        token,
        username: 'User' // Default username or extract from token if possible
      });
    }
    setLoading(false);
  }, []);

  // Simple login function that matches Auth-React-JWT implementation
  const login = async (username, password) => {
    try {
      // This function is not actually used since the LoginForm component
      // from Auth-React-JWT handles login directly with axios
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Check if user has a specific role
  const hasRole = () => {
    // Simplified implementation since Auth-React-JWT doesn't use roles
    return !!currentUser;
  };

  const value = {
    currentUser,
    setCurrentUser, // Export setCurrentUser to allow direct updates
    loading,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
