export const initialState = {
  isLoginPending: false,
  isLogoutPending: false,
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

export const loginRequestAction = (data) => ({
  type: "LOGIN_REQUEST",
  data,
});

export const logoutRequestAction = () => ({
  type: "LOGOUT_REQUEST",
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        isLoginPending: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoginPending: false,
        isLoggedIn: true,
        me: action.data,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoginPending: false,
        isLoggedIn: false,
      };
    case "LOGOUT_REQUEST":
      return {
        ...state,
        isLogoutPending: true,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        isLogoutPending: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOGOUT_FAILURE":
      return {
        ...state,
        isLogoutPending: false,
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
