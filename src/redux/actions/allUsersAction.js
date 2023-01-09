import ACTIONS from "./index";
import axios from "axios";

export const fetchAllUser = async (token) => {
  try {
    const res = await axios.get("http://localhost:5555/user/all_info", {
      headers: { Authorization: token },
    });

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};

export const dispatchGetAllUser = (res) => {
  console.log(res);
  return {
    type: ACTIONS.GET_ALL_USER,
    payload: res.data,
  };
};
