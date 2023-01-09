import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import tokenReducer from "./toenReducer";
import userReducer from "./userReducer";

// export default combineReducers({
//   auth: auth,
// });

const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
  users: userReducer,
  // blogs: blogReducer,
});

export default rootReducer;
