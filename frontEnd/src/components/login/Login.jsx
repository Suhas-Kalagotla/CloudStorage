import { useState } from "react";
import "./login.css";
import { InputField, PasswordField } from "../util";

const Login = ({ onFormSwitch }) => {
  const handleSubmit = async (e) => {
    console.log("submit made");
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState();
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

        <p className="loginError">{errors && errors}</p>
        <button className="loginButton" type="submit">
          Log In
        </button>
      </form>
      <p>
        Don't have an acccount?{" "}
        <a className="switch" onClick={() => onFormSwitch("register")}>
          Register here
        </a>
      </p>
    </div>
  );
};
export default Login;
