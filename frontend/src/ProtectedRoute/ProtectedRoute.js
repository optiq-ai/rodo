import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Jeśli token nie istnieje, użytkownik nie jest zalogowany
        if (!token) {
          console.log("Token nie istnieje, przekierowanie do logowania");
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }
        
        // Sprawdź, czy token jest ważny poprzez wywołanie endpointu weryfikacji
        const response = await fetch('http://localhost:8080/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log("Token zweryfikowany pomyślnie");
          setIsAuthenticated(true);
        } else {
          console.log("Token nieprawidłowy lub wygasł, przekierowanie do logowania");
          // Opcjonalnie: Wyczyść token, jeśli jest nieprawidłowy
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Błąd podczas weryfikacji tokenu:", error);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateToken();
  }, []);
  
  // Podczas walidacji tokenu pokazujemy loader lub nic
  if (isValidating) {
    return null; // Można tu dodać komponent ładowania
  }
  
  // Po walidacji, jeśli użytkownik nie jest zalogowany, przekieruj do logowania
  if (!isAuthenticated) {
    console.log("Użytkownik niezalogowany, przekierowanie do logowania");
    return <Navigate to="/login" replace />;
  }
  
  // Jeśli użytkownik jest zalogowany, renderuj chroniony komponent
  console.log("Użytkownik zalogowany, renderowanie chronionego komponentu");
  return element;
};

export default ProtectedRoute;
