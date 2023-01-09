import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { errNotification, successNotification } from "../../Utils/Notification";
import { useDispatch } from "react-redux";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

const initialState = {
  email: "",
  password: "",
  name: "",
  err: "",
  avatar: "",
  success: "",
};

const Login = () => {
  const [user, setUser] = useState(initialState);
  const { email, password, err, success } = user;
  const dispatch = useDispatch();
  let navigate = useNavigate();

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
    try {
      const res = await axios.post(
        "http://localhost:5555/user/login",
        {
          email,
          password,
        },
        { withCredentials: true, credentials: "include" }
      );
      console.log(res);

      setUser((prevUser) => {
        return {
          ...prevUser,
          // email: res.data.user.email,
          // name: res.data.user.name,
          // avatar: res.data.user.avatar,
          err: "",
          success: res.data.msg,
        };
      });
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      navigate("/");
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
  const responseGoogle = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:5555/user/google_login",
        {
          tokenId: response.credential,
        },
        { withCredentials: true, credentials: "include" }
      );
      console.log(res);

      setUser({ ...user, success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      navigate("/");
    } catch (err) {
      err.response.data.msg && setUser({ ...user, err: err.response.data.msg });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await axios.post(
        "http://localhost:5555/user/facebook_login",
        {
          accessToken,
          userID,
        },
        { withCredentials: true, credentials: "include" }
      );
      console.log(res);

      setUser({ ...user, success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      navigate("/");
    } catch (err) {
      err.response.data.msg && setUser({ ...user, err: err.response.data.msg });
    }
    console.log(response);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form action="" onSubmit={handleSubmit}>
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
        <div className="row">
          <button type="submit">submit</button>
          <Link to="/forgot_password" className="forgot-password">
            {" "}
            Forgot Your Password?
          </Link>
        </div>
      </form>
      <Link className="forgot-password" to="/register">
        {" "}
        New To Here?
      </Link>

      <div className="hr">Or login with</div>
      <div className="social">
        <GoogleLogin
          className="google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
        <FacebookLogin
          appId="868618431148454"
          fields="name,email,picture"
          // onClick={componentClicked}
          callback={responseFacebook}
        />
        ,
      </div>

      <div>
        {err && errNotification(err)}
        {success && successNotification(`congrats ${user.name}. ${success}`)}
      </div>
    </div>
  );
};

export default Login;
