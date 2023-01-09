import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DataProvider, { store } from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DataProvider store={store}>
      <GoogleOAuthProvider clientId="382511897552-q0ck9blbmh8dd5eectrmara6s0220774.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </DataProvider>
  </React.StrictMode>
);
