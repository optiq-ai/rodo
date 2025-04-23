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
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Używamy userName zamiast login dla spójności z backendem
      // Zachowujemy kompatybilność z istniejącym interfejsem użytkownika
      const response = await axios.post("http://localhost:8080/login", {
        userName: login, // Zmiana nazwy pola na userName
        password: password ? password.split('') : [], // Zachowujemy konwersję hasła na tablicę znaków
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
      alert("Invalid username or password");
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
