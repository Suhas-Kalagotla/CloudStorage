import { useState } from "react";
import "./login.css";
import { InputField, PasswordField } from "../util";
import { url } from "../../utils/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onFormSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

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
    try {
      const response = await axios.post(
        `${url}/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      const user = JSON.parse(localStorage.getItem("user"));
      if (response.status === 500) {
        setErrors("Server Error");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrors([err.response.data.error]);
      } else {
        setErrors(["Something went wrong. Please try again later."]);
      }
    }
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
          <div className="errorsContainer">
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
        <button className="switch" onClick={() => onFormSwitch("register")}>
          Register here
        </button>
      </p>
    </div>
  );
};
export default Login;
