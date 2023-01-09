import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { errNotification, successNotification } from "../../Utils/Notification";
import { isMatch, lengthCount } from "../../Utils/Validaton/Validation";

const initialState = {
  password: "",
  confirm_password: "",
  err: "",
  success: "",
};

const Reset = () => {
  const { token } = useParams();

  const [data, setData] = useState(initialState);

  const { password, confirm_password, err, success } = data;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
        err: "",
        success: "",
      };
    });
  };

  const onHandlePasswordChange = async () => {
    if (lengthCount(password))
      return setData((prev) => {
        return {
          ...prev,

          err: "password should be atleast 6 characters",
          success: "",
        };
      });
    if (!isMatch(password, confirm_password))
      return setData((prev) => {
        return {
          ...prev,

          err: "password does not match",
          success: "",
        };
      });

    try {
      const res = await axios.post(
        "http://localhost:5555/user/reset__password",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      setData((prev) => {
        return {
          ...prev,

          err: "",
          success: res.data.msg,
        };
      });
    } catch (err) {
      console.log(err);
      setData((prev) => {
        return {
          ...prev,

          err: err.response.data.msg,
          success: "",
        };
      });
    }
  };

  return (
    <div className="forgot">
      <h2>Reset your password?</h2>
      <div className="row">
        {err && errNotification(err)}
        {success && successNotification(success)}

        <div>
          <label htmlFor="">Enter your new Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="">Confirm Your Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={confirm_password}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={onHandlePasswordChange}>Reset your password</button>
      </div>
    </div>
  );
};

export default Reset;
