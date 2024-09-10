import { useState } from "react";
import "./login.css";
import { InputField, PasswordField } from "../util";

const Login = ({ onFormSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = [];
    if (!email) newErrors.push("Email is required.");
    if (!password) newErrors.push("Password is required.");
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
        setErrors(validationErrors); 
      return;

  }
    console.log("submit made");
  };
  return (
    <div className="loginContainer">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="loginDiv">
          <InputField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            name="email"
          />
          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visible={passwordVisible}
            toggleVisibility={togglePasswordVisibility}
            name="password"
          />
        </div>

        <button className="loginButton" type="submit">
          Log In
        </button>
        {errors.length > 0 && (
          <div className="errorContainer">
            {errors.map((error, index) => (
              <p className="loginError">
                {index + 1}. {error}
              </p>
            ))}
          </div>
        )}
      </form>
      <p>
        Don't have an acccount?
        <a className="switch" onClick={() => onFormSwitch("register")}>
          Register here
        </a>
      </p>
    </div>
  );
};
export default Login;
