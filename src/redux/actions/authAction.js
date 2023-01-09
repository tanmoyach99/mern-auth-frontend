import ACTIONS from "./index";
import axios from "axios";

export const dispatchLogin = () => {
  return {
    type: ACTIONS.LOGIN,
  };
};

export const fetchUser = async (token) => {
  console.log(token);
  try {
    const res = await axios.get("http://localhost:5555/user/info", {
      headers: { Authorization: token },
    });
    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};

export const dispatchGetUser = (res) => {
  return {
    type: ACTIONS.GET_USER,
    payload: {
      user: res.data,
      isAdmin: res.data.role === 1 ? true : false,
    },
  };
};
