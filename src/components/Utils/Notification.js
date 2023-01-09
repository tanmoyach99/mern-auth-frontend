import React from "react";
import "./Notification.css";

export const errNotification = (message) => {
  return <div className="errMessage">{message}</div>;
};
export const successNotification = (message) => {
  return <div className="successMessage">{message}</div>;
};
