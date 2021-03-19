export const initialState = {
  isLoggedIn: false,
  user: null,
  signUpData: {},
  loginData: {},
};

// action creator
export const changeNickname = (data) => ({
  type: "CHANGE_NICKNAME",
  data,
});

export const loginAction = (data) => ({
  type: "LOGIN",
  data,
});

export const logoutAction = () => ({
  type: "LOGOUT",
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case "CHANGE_NICKNAME":
      return {
        ...state,
        user: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
