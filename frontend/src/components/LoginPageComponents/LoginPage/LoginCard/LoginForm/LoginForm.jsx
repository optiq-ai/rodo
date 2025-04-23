import React, { useState } from "react";
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
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Resetujemy błąd przed próbą logowania
    
    try {
      // Używamy funkcji login z kontekstu autentykacji
      const result = await authLogin({
        userName: login, // Używamy userName zamiast login dla spójności z backendem
        password: password // Wysyłamy hasło jako string, nie jako tablicę znaków
      });
      
      console.log("Logowanie dla użytkownika:", login);
      
      if (result.success) {
        // Jeśli logowanie się powiodło, przekieruj do dashboardu
        navigate("/dashboard");
      } else {
        // Jeśli logowanie się nie powiodło, wyświetl błąd
        setError(result.error || "Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Wystąpił nieoczekiwany błąd podczas logowania. Spróbuj ponownie później.");
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
