import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../hooks/useAuth";
import "./LoginForm.css";
import LoginButton from "./LoginButton/LoginButton";
import LoginCardHeader from "../LoginCardHeader/LoginCardHeader";
import LoginFields from "./LoginFields/LoginFields";

const LoginForm = () => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Resetujemy błąd przed próbą logowania
    
    try {
      // Używamy userName zamiast login dla spójności z backendem
      // Zachowujemy kompatybilność z istniejącym interfejsem użytkownika
      const response = await axios.post("http://localhost:8080/login", {
        userName: login, // Zmiana nazwy pola na userName
        password: password, // Wysyłamy hasło jako string, nie jako tablicę znaków
      });
      
      console.log("Logowanie dla użytkownika:", login);
      
      const { token } = response.data;
      localStorage.setItem("token", token);
      
      // Update the auth context directly after successful login with actual username
      setCurrentUser({ 
        token,
        username: login
      });
      
      // Store username in localStorage for persistence
      localStorage.setItem("username", login);
      
      // Navigate to dashboard after updating auth state
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      
      // Lepsza obsługa błędów
      if (error.response) {
        // Serwer zwrócił odpowiedź z kodem błędu
        const errorMessage = error.response.data.message || "Nieprawidłowa nazwa użytkownika lub hasło";
        setError(errorMessage);
      } else if (error.request) {
        // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi
        setError("Brak odpowiedzi z serwera. Sprawdź połączenie internetowe.");
      } else {
        // Wystąpił błąd podczas konfigurowania żądania
        setError("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form-grid">
      <LoginCardHeader />
      <LoginFields
        login={login}
        setLogin={setLogin}
        password={password}
        setPassword={setPassword}
      />
      {error && <div className="login-error-message">{error}</div>}
      <LoginButton />
    </form>
  );
};

export default LoginForm;
