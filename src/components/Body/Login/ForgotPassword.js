import React, { useState } from "react";
import axios from "axios";
import { errNotification, successNotification } from "../../Utils/Notification";
import { isEmail } from "../../Utils/Validaton/Validation";

const initialState = {
  email: "",
  err: "",
  success: "",
};

const ForgotPassword = () => {
  const [data, setData] = useState(initialState);
  const { email, err, success } = data;

  const handleChangeInput = (e) => {
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

  const onEmailVerification = async () => {
    if (!isEmail(email))
      setData((prev) => {
        return {
          ...prev,
          err: "invalid Email",
        };
      });

    try {
      const res = await axios.post(
        "http://localhost:5555/user/forgot__password",
        {
          email,
        }
      );

      console.log(res);
      setData((prevUser) => {
        return {
          ...prevUser,
          success: res.data.msg,
        };
      });
    } catch (err) {
      console.log(err);
      setData((prev) => {
        return {
          ...prev,
          err: err.response.data.msg,
        };
      });
    }
  };

  return (
    <div className="forgot">
      <h2>Forgot your password?</h2>
      <div className="row">
        {err && errNotification(err)}
        {success && successNotification(success)}

        <div>
          <label htmlFor="">Enter your email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <button onClick={onEmailVerification}>verify email address</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
