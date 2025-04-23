import "./UsernameField.css";

const UsernameField = ({ login, setLogin }) => {
  return (
    <div className="username-login-field">
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Username"
      />
    </div>
  );
};

export default UsernameField;
