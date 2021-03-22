export const initialState = {
  isLoggedIn: false,
  me: null,
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
        me: action.data,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    case "CHANGE_NICKNAME":
      return {
        ...state,
        me: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
