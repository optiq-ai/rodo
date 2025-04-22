import React, { createContext, useState, useContext, useEffect } from 'react';

// Tworzenie kontekstu autoryzacji
export const AuthContext = createContext();

// Hook do używania kontekstu autoryzacji
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Symulacja logowania
  const login = async (email, password) => {
    // W rzeczywistości byłoby to wywołanie do API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const user = {
            id: '1',
            username: email.split('@')[0],
            email: email,
            role: 'admin'
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Nieprawidłowe dane logowania'));
        }
      }, 1000);
    });
  };

  // Symulacja rejestracji
  const register = async (username, email, password) => {
    // W rzeczywistości byłoby to wywołanie do API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && email && password) {
          const user = {
            id: '1',
            username: username,
            email: email,
            role: 'admin'
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Nieprawidłowe dane rejestracji'));
        }
      }, 1000);
    });
  };

  // Symulacja wylogowania
  const logout = async () => {
    // W rzeczywistości byłoby to wywołanie do API
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        resolve();
      }, 500);
    });
  };

  // Sprawdzanie, czy użytkownik jest zalogowany przy ładowaniu strony
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Wartości udostępniane przez kontekst
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
