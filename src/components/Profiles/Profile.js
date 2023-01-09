import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  dispatchGetAllUser,
  fetchAllUser,
} from "../../redux/actions/allUsersAction";
import { errNotification, successNotification } from "../Utils/Notification";
import { isMatch, lengthCount } from "../Utils/Validaton/Validation";
import "./Profile.css";

const initialState = {
  name: "",
  email: "",
  avatar: "",
  password: "",
  confirm_password: "",
  err: "",
  success: "",
};

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);
  const { user, isAdmin } = auth;
  const [data, setData] = useState(initialState);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callBack, setCallback] = useState(false);
  const { name, password, confirm_password, err, success } = data;
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
        err: "",
        success: "",
      };
    });
  };

  const updateInfo = async () => {
    try {
      await axios.patch(
        "http://localhost:5555/user/update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData((prevUser) => {
        return {
          ...prevUser,

          err: "",
          success: "your profile updated successfully",
        };
      });
    } catch (err) {
      console.log(err);
      //   setData({ ...data, err: err.resp, success: "" });
    }
  };
  const updatePassword = async () => {
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
        {
          password,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData((prevUser) => {
        return {
          ...prevUser,

          err: "",
          success: res.data.msg,
        };
      });
    } catch (err) {
      console.log(err);
      setData({ ...data, err: err.response.data.message, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfo();
    if (password) updatePassword();
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file)
        return setData({ ...data, err: "No files were uploaded", success: "" });
      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "size too large", success: "" });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({
          ...data,
          err: "fie format not supported",
          success: "",
        });

      let formData = new FormData();
      formData.append("file", file);
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5555/api/upload_avatar",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.message, success: "" });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllUser(token).then((res) => {
        dispatch(dispatchGetAllUser(res));
      });
    }
  }, [token, isAdmin, dispatch, callBack]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5555/user/delete/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, success: res.data.msg });
      setLoading(false);
      setCallback(!callBack);
      console.log(res);
    } catch (err) {
      console.log(err);
      setData({ ...data, err: err.response.data.msg });
    }
  };

  return (
    <div className="profile_page">
      <div>
        {err && errNotification(err)}
        {success && successNotification(success)}
        {loading && <h3>LOading............................</h3>}
      </div>
      <div className="col-left">
        <h2>{isAdmin ? "Admin Profile" : "user profile"}</h2>
        <div className="avatar">
          <img src={avatar ? avatar : user.avatar} alt="" />
          <span>
            <p>Change</p>
            <input
              type="file"
              name="file_upload"
              id="file_upload"
              onChange={changeAvatar}
            />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="your name"
            defaultValue={user.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Name">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="your email"
            value={user?.email}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="password"> new password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="your password"
            value={data.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">confirm password</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            placeholder="your confirm password"
            value={data.confirm_password}
            onChange={handleChange}
          />
        </div>

        <p>
          *if you update your password here, you will not be able to quick login
          using facebook and google
        </p>
        <button disabled={loading} onClick={handleUpdate}>
          Update
        </button>
      </div>
      <div className="col-right">
        <h2>{isAdmin ? "Users" : "MyOrders"}</h2>

        <div style={{ overFlowX: "auto" }}>
          <table className="customers">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role === 1 ? "yes" : "no"}</td>
                    <td>
                      {user.role === 1 ? (
                        <div>
                          <Link to={`/edit_user/${user._id}`}>update</Link>
                        </div>
                      ) : (
                        <div>
                          <Link to={`/edit_user/${user._id}`}>update</Link>
                          <button onClick={() => handleDelete(user._id)}>
                            delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
