import { useState } from "react";
import { InputField, PasswordField } from "../util";

const Register = ({ onFormSwitch }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{5,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = [];

    if (!userName) newErrors.push("UserName is required.");
    if (!email) newErrors.push("Email is required.");
    if (!password) newErrors.push("Password is required.");
    if (!confirmPassword) newErrors.push("Confirm Password is required.");

    if (password && !validatePassword(password)) {
      newErrors.push(
        "Password must be at least 5 characters long, contain a capital letter, a special character, and a number.",
      );
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push("Password and Confirm Password do not match.");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors); // Set all errors at once
      return;
    }
    console.log("form submitted");
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
        <button className="loginButton" type="submit">
          Register
        </button>
        {errors.length > 0 && (
          <div className="errorContainer">
            {errors.map((error, index) => (
              <p className="loginError" key={index}>
                {index + 1}. {error}
              </p>
            ))}
          </div>
        )}
      </form>
      <p>
        Already have an account?
        <a className="switch" onClick={() => onFormSwitch("login")}>
          Log in here
        </a>
      </p>
    </div>
  );
};

export default Register;
