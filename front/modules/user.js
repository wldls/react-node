import { takeLatest, put, delay } from "redux-saga/effects";
import {
  createPromiseSaga,
  reducerUtils,
  handleAsyncActions,
} from "../lib/asyncUtils";
import * as user from "../api/user";

export const initialState = {
  login: reducerUtils.initial(),
  logout: reducerUtils.initial(),
  signup: reducerUtils.initial(),
  changeNickname: reducerUtils.initial(),
  // me: null,
  me: {
    nickname: "jiin",
    id: 1,
    Posts: [],
    Followings: [],
    Followers: [],
  },
  signUpData: {},
  loginData: {},
};

const dummyUser = (data) => ({
  ...data,
  nickname: "jiin",
  id: 1,
  Posts: [{id: 1}],
  Followings: [{nickname: '민지'}, {nickname: '정몬'}, {nickname: '욘지'}],
  Followers: [{nickname: '민지'}, {nickname: '정몬'}, {nickname: '욘지'}],
});

// 로그인
const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";

// 로그아웃
const LOGOUT = "LOGOUT";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
const LOGOUT_ERROR = "LOGOUT_ERROR";

// 회원가입
const SIGNUP = "SIGNUP";
const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
const SIGNUP_ERROR = "SIGNUP_ERROR";

// 팔로우
const FOLLOW_REQUEST = "FOLLOW_REQUEST";
const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
const FOLLOW_ERROR = "FOLLOW_ERROR";

// 언팔로우
const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
const UNFOLLOW_ERROR = "UNFOLLOW_ERROR";

const CHANGE_NICKNAME = "CHANGE_NICKNAME";
const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
const CHANGE_NICKNAME_ERROR = "CHANGE_NICKNAME_ERROR";

const ADD_POST_MINE = 'ADD_POST_MINE';
const REMOVE_POST_MINE = 'REMOVE_POST_MINE';

// action creator
export const changeNickname = (data) => ({
  type: CHANGE_NICKNAME,
  payload: data,
});

export const loginRequestAction = (data) => ({
  type: LOGIN,
  payload: data,
});

export const logoutRequestAction = () => ({
  type: LOGOUT,
});

export const signupRequestAction = () => ({
  type: SIGNUP,
  payload: data,
});

export const addPostMine = (data) => ({
  type: ADD_POST_MINE,
  payload: data
});

export const removePostMine = (data) => ({
  type: REMOVE_POST_MINE,
  payload: data
})

// fork: 비동기 함수호출 -> 결과를 기다리지 않고 다음 코드를 실행
// call: 동기 함수호출 -> 결과를 기다렸다가 실행
function* loginSaga(action) {
  try {
    // const result = yield call(loginAPI, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    yield put({
      type: LOGIN_SUCCESS,
      payload: { ...action.payload, nickname: "jiin" },
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOGIN_ERROR,
      payload: error,
    });
  }
}

const logoutSaga = createPromiseSaga(LOGOUT, user.logoutAPI);

export function* userSaga() {
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return handleAsyncActions(LOGIN, "login")(state, action);
    case LOGIN_SUCCESS:
      return {
        // ...state,
        // login: {
        //   ...state.login,
        //   data: dummyUser(action.payload),
        // },
        ...state,
        login: reducerUtils.success(action.payload),
        me: dummyUser(action.payload)
      };
    case LOGIN_ERROR:
      return handleAsyncActions(LOGIN, "login")(state, action);
    case LOGOUT:
    case LOGOUT_SUCCESS:
    case LOGOUT_ERROR:
      return handleAsyncActions(LOGOUT, "logout")(state, action);
    case SIGNUP:
    case SIGNUP_SUCCESS:
    case SIGNUP_ERROR:
      return handleAsyncActions(SIGNUP, "signup")(state, action);
    case CHANGE_NICKNAME:
    case CHANGE_NICKNAME_SUCCESS:
    case CHANGE_NICKNAME_ERROR:
      return handleAsyncActions(CHANGE_NICKNAME, "changeNickname")(
        state,
        action
      );
    case ADD_POST_MINE:
      return {
        ...state,
        me: {
          ...state.me,
          Posts: [{id: action.payload}, ...state.me.Posts]
        }
      }
    case REMOVE_POST_MINE:
      console.log(state.me.Posts, action);
      const newPost = state.me.Posts.filter(v => v.id !== action.payload);
      return {
        ...state,
        me: {
          ...state.me,
          Posts: newPost
        }
      }
    default:
      return state;
  }
};

export default reducer;
