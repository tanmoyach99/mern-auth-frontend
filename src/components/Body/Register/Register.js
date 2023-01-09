import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import axios from "axios";
import { errNotification, successNotification } from "../../Utils/Notification";
import { useDispatch } from "react-redux";
import { dispatchLogin } from "../../../redux/actions/authAction";
import {
  isEmail,
  isEmpty,
  isMatch,
  lengthCount,
} from "../../Utils/Validaton/Validation";

const initialState = {
  email: "",
  password: "",
  name: "",
  err: "",
  cf_password: "",
  success: "",
};

const Register = () => {
  const [user, setUser] = useState(initialState);
  const { name, email, password, cf_password, err, success } = user;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const userMsg = (msg) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        err: msg,
        success: "",
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
        err: "",
        success: "",
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isEmpty(name) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(cf_password)
    )
      return userMsg("please fill the all fields");
    // return setUser((prevUser) => {
    //   return {
    //     ...prevUser,
    //     err: "please fill the all fields",
    //     success: "",
    //   };
    // });

    if (!isEmail(email)) return userMsg("invalid Emails");
    if (lengthCount(password))
      return userMsg("password must be at least 6 characters");
    if (!isMatch(password, cf_password))
      return userMsg("password does not match");

    // const res=
    //   const res = await axios.post("http://localhost:5555/user/login", {
    //     email,
    //     password,
    //   });

    //   console.log(res);

    //   setUser((prevUser) => {
    //     return {
    //       ...prevUser,
    //       email: res.data.user.email,
    //       name: res.data.user.name,
    //       avatar: res.data.user.avatar,
    //       err: "",
    //       success: res.data.msg,
    //     };
    //   });
    //   localStorage.setItem("firstLogin", true);
    //   dispatch(dispatchLogin());
    // navigate("/");
    try {
      const res = await axios.post("http://localhost:5555/user/register", {
        name,
        email,
        password,
      });
      setUser((prevUser) => {
        return {
          ...prevUser,

          err: "",
          success: res.data.msg,
        };
      });
    } catch (err) {
      err.response?.data.msg &&
        setUser((prevUser) => {
          return {
            ...prevUser,

            err: err.response.data.msg,
            success: "",
          };
        });
    }
  };

  return (
    <div className="login-page">
      <h2>Register</h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={name}
            id="name"
            name="name"
            placeholder="enter your name"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            id="email"
            name="email"
            placeholder="enter your email"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">password</label>
          <input
            type="password"
            value={password}
            id="password"
            name="password"
            placeholder="enter your password"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="cf_password"> confirm password</label>
          <input
            type="password"
            value={cf_password}
            id="cf_password"
            name="cf_password"
            placeholder="confirm password"
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <button type="submit">Register</button>
          <Link className="forgot-password" to="/login">
            {" "}
            Already logged In? Login
          </Link>
        </div>
      </form>

      <div>
        {err && errNotification(err)}
        {success && successNotification(`congrats ${user.name}. ${success}`)}
      </div>
    </div>
  );
};

export default Register;
