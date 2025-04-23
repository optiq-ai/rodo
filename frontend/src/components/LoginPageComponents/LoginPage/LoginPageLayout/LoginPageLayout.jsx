import React from "react";
import "./LoginPageLayout.css";
import LoginContentContainer from "../LoginContentContainer/LoginContentContainer";

const LoginPageLayout = () => {
  return (
    <>
      <div className="login-page-grid">
        <LoginContentContainer />
      </div>
    </>
  );
};

export default LoginPageLayout;
