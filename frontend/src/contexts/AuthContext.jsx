import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik jest zalogowany (z localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Błąd parsowania danych użytkownika:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Funkcja logowania
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Symulacja wywołania API - w rzeczywistości będzie to wywołanie do backendu
      // const response = await authService.login(username, password);
      
      // Tymczasowa implementacja dla szkieletu
      const mockUser = {
        id: 1,
        username: username,
        email: `${username}@example.com`,
        roles: ['ROLE_USER']
      };
      
      // Zapisanie danych użytkownika w localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      
      return mockUser;
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas logowania');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funkcja rejestracji
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Symulacja wywołania API - w rzeczywistości będzie to wywołanie do backendu
      // const response = await authService.register(username, email, password);
      
      // Tymczasowa implementacja dla szkieletu
      const mockUser = {
        id: 1,
        username: username,
        email: email,
        roles: ['ROLE_USER']
      };
      
      return mockUser;
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas rejestracji');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funkcja wylogowania
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  // Sprawdzenie, czy użytkownik ma określoną rolę
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
