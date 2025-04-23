import React from "react";
import "./LoginPageLayout.css";
import LoginPageNavbar from "../Navbar/Navbar";
import LoginContentContainer from "../LoginContentContainer/LoginContentContainer";

const LoginPageLayout = () => {
  return (
    <>
      <div className="login-page-grid">
        <LoginPageNavbar />
        <LoginContentContainer />
      </div>
    </>
  );
};

export default LoginPageLayout;
