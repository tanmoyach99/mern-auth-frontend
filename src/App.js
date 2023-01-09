import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Body from "./components/Body/Body";
import Header from "./components/Header/Header";
import Login from "./components/Body/Login/Login";
import Register from "./components/Body/Register/Register";
import ActivateEmail from "./components/Body/Register/ActivateEmail";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  dispatchGetUser,
  dispatchLogin,
  fetchUser,
} from "./redux/actions/authAction";
import ForgotPassword from "./components/Body/Login/ForgotPassword";
import Reset from "./components/Body/Login/Reset";
import Profile from "./components/Profiles/Profile";
import EditUser from "./components/Profiles/EditUser";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  const getToken = async () => {
    console.log("hello token");
    await fetch("http://localhost:5555/user/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: null,

      withCredentials: true, // should be there
      credentials: "include", // should be there
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        dispatch({ type: "GET_TOKEN", payload: data.token });
      });
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getToken();
    }
  }, [auth.isLoggedIn, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token]);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/body" element={<Body />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route
            path="/user/activate/:activation_token"
            element={<ActivateEmail />}
          />
          <Route path="/user/reset/:token" element={<Reset />} />
          <Route path="/edit_user/:id" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
