import { NavigateButton } from "../util";
import "./navbar.css";
import { url } from "../../utils/url";
import axios from "axios";

const Navbar = () => {
  const logout = async () => {
    try {
      await axios.post(
        `${url}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="navbarContainer">
      <div className="navbar">
        <NavigateButton name="Home" url="/" />
        <NavigateButton name="Upload" url="/upload" />
        <NavigateButton name="Login" url="/login" />
        <button onClick={() => logout()}> Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
