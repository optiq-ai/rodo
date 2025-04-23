import "./PasswordField.css";

const PasswordField = ({ password, setPassword }) => {
  return (
    <div className="password-login-field">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
    </div>
  );
};

export default PasswordField;
