import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Komponent sprawdzający, czy użytkownik jest zalogowany i przekierowujący
 * do dashboardu, jeśli token JWT jest ważny, lub do strony logowania w przeciwnym przypadku.
 */
const HomeRedirect = () => {
  const { currentUser, loading } = useAuth();

  // Jeśli trwa ładowanie, nie renderuj nic
  if (loading) {
    return null;
  }

  // Jeśli użytkownik jest zalogowany, przekieruj do dashboardu
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // W przeciwnym razie przekieruj do strony logowania
  return <Navigate to="/login" replace />;
};

export default HomeRedirect;
