import React from "react";
import LoginForm from "./LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Auth React JWT</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
