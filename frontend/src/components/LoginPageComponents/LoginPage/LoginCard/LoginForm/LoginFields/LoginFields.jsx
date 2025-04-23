import React from "react";
import "./LoginFields.css";
import UsernameField from "./UsernameField/UsernameField";
import PasswordField from "./PasswordField/PasswordField";

const LoginFields = ({ login, setLogin, password, setPassword }) => {
  return (
    <div className="login-fields">
      <UsernameField login={login} setLogin={setLogin} />
      <PasswordField password={password} setPassword={setPassword} />
    </div>
  );
};

export default LoginFields;
