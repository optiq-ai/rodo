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
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Używamy funkcji login z kontekstu uwierzytelniania

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Logowanie dla użytkownika:", login);
      
      // Używamy funkcji login z kontekstu uwierzytelniania zamiast bezpośredniego wywołania axios
      const result = await authLogin({
        userName: login,
        password: password
      });
      
      if (result && result.success) {
        // Przekierowanie do dashboardu po udanym logowaniu
        navigate("/dashboard");
      } else {
        // Wyświetlenie błędu, jeśli logowanie nie powiodło się
        alert(result?.error || "Nieprawidłowa nazwa użytkownika lub hasło");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
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
      <LoginButton />
    </form>
  );
};

export default LoginForm;
