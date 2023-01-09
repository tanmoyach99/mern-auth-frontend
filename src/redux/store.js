import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
// import { authReducer } from "./reducers/authReducer";
import rootReducer from "./reducers/indexReducer";
import { composeWithDevTools } from "redux-devtools-extension";
//  import rootReducer from "./reducers/";

export const store = createStore(rootReducer, composeWithDevTools());

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
