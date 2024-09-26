import { NavigateButton } from "../util";
import "./navbar.css";
import { url } from "../../utils/url";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(
        `${url}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbarContainer">
      <div className="navItems">
        <NavigateButton name="Home" url="/" active={isActive("/")} />
        <NavigateButton
          name="Upload"
          url="/upload"
          active={isActive("/upload")}
        />
        {user && user.role === "admin" && (
          <NavigateButton
            name="Users"
            url="/users"
            active={isActive("/users")}
          />
        )}
      </div>
      <div className="loginButton">
        {!user ? (
          <button>
            <NavigateButton name="Login" url="/login" />
          </button>
        ) : (
          <button onClick={() => logout()}> Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
