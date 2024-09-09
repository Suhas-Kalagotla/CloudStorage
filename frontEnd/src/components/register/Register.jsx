import { useState } from "react";
import { InputField,PasswordField } from "../util";

const Register = ({ onFormSwitch }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState(null);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="loginContainer">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <InputField
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Enter your Name"
          name="username"
        />

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

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          visible={confirmPasswordVisible}
          toggleVisibility={toggleConfirmPasswordVisibility}
          name="confirmPassword"
        />

        {errors && <p className="loginError">{errors}</p>}

        <button className="loginButton" type="submit">
          Register
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <a className="switch" onClick={() => onFormSwitch("login")}>
          Log in here
        </a>
      </p>
    </div>
  );
};

export default Register;
