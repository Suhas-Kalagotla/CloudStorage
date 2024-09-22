import { NavigateButton } from "../util";
import "./navbar.css";
import { url } from "../../utils/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
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
  return (
    <div className="navbarContainer">
      <div className="navbar">
        <NavigateButton name="Home" url="/" />
        <NavigateButton name="Upload" url="/upload" />
        {!user ? (
          <NavigateButton name="Login" url="/login" />
        ) : (
          <button onClick={() => logout()}> Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
