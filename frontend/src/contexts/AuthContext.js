import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        // Weryfikacja tokenu
        const response = await fetch('http://localhost:8080/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setError('');
        } else if (response.status === 401) {
          // Token wygasł lub jest nieprawidłowy
          localStorage.removeItem('token');
          setCurrentUser(null);
          setError('Sesja wygasła. Zaloguj się ponownie.');
        } else {
          setCurrentUser(null);
          setError('Wystąpił błąd podczas weryfikacji sesji.');
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania statusu autoryzacji:', error);
        setCurrentUser(null);
        setError('Wystąpił błąd podczas weryfikacji sesji.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return { success: true };
      } else if (response.status === 401) {
        setError('Nieprawidłowa nazwa użytkownika lub hasło.');
        return { success: false, error: 'Nieprawidłowa nazwa użytkownika lub hasło.' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Wystąpił błąd podczas logowania.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      setError('Wystąpił błąd podczas komunikacji z serwerem.');
      return { success: false, error: 'Wystąpił błąd podczas komunikacji z serwerem.' };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Wystąpił błąd podczas rejestracji.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      setError('Wystąpił błąd podczas komunikacji z serwerem.');
      return { success: false, error: 'Wystąpił błąd podczas komunikacji z serwerem.' };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
