import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { errNotification, successNotification } from "../../Utils/Notification";

const ActivateEmail = () => {
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { activation_token } = useParams();
  console.log(activation_token);

  useEffect(() => {
    const activateEmail = async () => {
      try {
        const res = await axios.post("http://localhost:5555/user/activation", {
          activation_token,
        });
        console.log(res);

        setSuccess(res.data.msg);
      } catch (err) {
        console.log(err);
        err.response.data.msg && setError(err.response.data.msg);
      }
    };
    activateEmail();
  }, []);

  return (
    <div className="active_page">
      {err && errNotification(err)}
      {success && successNotification(success)}
    </div>
  );
};

export default ActivateEmail;
