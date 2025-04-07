import { NavigateButton } from "../util";
import React, { useState } from "react";
import "./navbar.css";
import { url } from "../../utils/url";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { PopUp } from "../";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState(null);

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
      setPopupMessage(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbarContainer">
      <div className="navItems">
        {user && user.role === "validate" && (
          <NavigateButton
            name="Landing"
            url="/landing"
            active={isActive("/landing")}
          />
        )}
        {user && user.role !== "validate" && (
          <>
            <NavigateButton name="Home" url="/" active={isActive("/")} />
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <NavigateButton
              name="Users"
              url="/admin/users"
              active={isActive("/admin/users")}
            />
            <NavigateButton
              name="Folders"
              url="/admin/folders"
              active={isActive("/admin/folders")}
            />
          </>
        )}
      </div>
      <div className="loginButton">
        {!user ? (
          <div>
            <NavigateButton name="Login" url="/login" />
          </div>
        ) : (
          <button onClick={() => logout()}> Logout</button>
        )}
      </div>
      {popupMessage !== null && (
        <PopUp
          message={popupMessage}
          onClose={() => {
            setPopupMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
