import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./header.css";
import axios from "axios";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const { user, isLoggedIn } = auth;

  const handleLogOut = async () => {
    console.log("logged out");
    try {
      await axios.get("http://localhost:5555/user/log_out");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      window.location.href = "/";
    }
  };

  const userLink = () => {
    return (
      <li className="drop-nav">
        <Link to="#" className="avatar">
          <img src={user?.avatar} alt="" />

          {user?.name}
        </Link>
        <ul className="drop-down">
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogOut}>
              Logout
            </Link>
          </li>
        </ul>
      </li>
    );
  };

  const transform = { transform: isLoggedIn ? "translateY(-5px)" : 0 };
  return (
    <div className="header">
      <Link to="/">Home</Link>
      <ul style={transform}>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        {isLoggedIn ? (
          userLink()
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
