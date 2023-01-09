import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { errNotification, successNotification } from "../Utils/Notification";

const EditUser = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [editUser, setEditUser] = useState({});
  const users = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [num, setNum] = useState(0);

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      navigate("/profile");
    }
  }, [users, id, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
        err: "",
        success: "",
      };
    });
  };
  const handleCheck = () => {
    setSuccess("");
    setErr("");
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  console.log(editUser);

  const handleUpdate = async () => {
    try {
      if (num % 2 !== 0) {
        const res = await axios.patch(
          `http://localhost:5555/user/update_role/${editUser._id}`,
          {
            role: checkAdmin ? 1 : 0,
          },
          {
            headers: { Authorization: token },
          }
        );
        console.log(res);
        setSuccess(res.data.msg);
        setNum(0);
      }
    } catch (err) {
      console.log(err);
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };

  return (
    <div className="profile_page edit_user">
      <div className="row">
        <button>Go Back</button>
      </div>

      <div className="col-left">
        <h2>Edit User</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={editUser.name}
            // onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={editUser?.email}
            disabled
          />
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            name="isAdmin"
            onChange={handleCheck}
          />
          <label htmlFor="isAdmin">isAdmin</label>
        </div>

        <p>
          *if you update your password here, you will not be able to quick login
          using facebook and google
        </p>
        <button onClick={handleUpdate}>Update</button>

        <div>
          {err && errNotification(err)}
          {success && successNotification(success)}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
