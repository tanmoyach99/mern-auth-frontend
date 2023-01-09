import ACTIONS from "../actions";

const initialState = {
  user: [],
  isLoggedIn: false,
  isAdmin: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        isAdmin: false,
      };

    case ACTIONS.GET_USER:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin,
      };
    default:
      return state;
  }
};
