import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
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

// (이전상태 ,액션) => 다음상태
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "HYDRATE":
      console.log("HYDRATE", action);
      return { ...state, ...action.payload };
    case "CHANGE_NICKNAME":
      return {
        ...state,
        name: action.data,
      };
    case "LOGIN":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case "LOGOUT":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
