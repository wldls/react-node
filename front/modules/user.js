import { takeLatest, put, call, delay } from "redux-saga/effects";
import {
  createPromiseSaga,
  reducerUtils,
  handleAsyncActions,
} from "../lib/asyncUtils";
import * as userAPI from "../api/user";
import produce from "immer";

export const initialState = {
  login: reducerUtils.initial(),
  logout: reducerUtils.initial(),
  signup: reducerUtils.initial(),
  follow: reducerUtils.initial(),
  unFollow: reducerUtils.initial(),
  changeNickname: reducerUtils.initial(),
  me: null,
  // me: {
  //   nickname: "jiin",
  //   id: 1,
  //   Posts: [],
  //   Followings: [],
  //   Followers: [],
  // },
  signUpData: {},
  loginData: {},
};

const dummyUser = (data) => ({
  ...data,
  nickname: "jiin",
  id: 1,
  Posts: [{ id: 1 }],
  Followings: [
    { nickname: "민지" },
    { nickname: "정몬" },
    { nickname: "욘지" },
  ],
  Followers: [{ nickname: "민지" }, { nickname: "정몬" }, { nickname: "욘지" }],
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
const SIGNUP_RESET = "SIGNUP_RESET";

// 팔로우
const FOLLOW = "FOLLOW";
const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
const FOLLOW_ERROR = "FOLLOW_ERROR";

// 언팔로우
const UNFOLLOW = "UNFOLLOW";
const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
const UNFOLLOW_ERROR = "UNFOLLOW_ERROR";

const CHANGE_NICKNAME = "CHANGE_NICKNAME";
const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
const CHANGE_NICKNAME_ERROR = "CHANGE_NICKNAME_ERROR";

const ADD_POST_MINE = "ADD_POST_MINE";
const REMOVE_POST_MINE = "REMOVE_POST_MINE";

// action creator
export const changeNickname = (payload) => ({
  type: CHANGE_NICKNAME,
  payload,
});

export const loginRequestAction = (payload) => ({
  type: LOGIN,
  payload,
});

export const logoutRequestAction = () => ({
  type: LOGOUT,
});

export const signupAction = (payload) => ({
  type: SIGNUP,
  payload,
});

export const signupReset = () => ({
  type: SIGNUP_RESET,
});

export const addPostMine = (payload) => ({
  type: ADD_POST_MINE,
  payload,
});

export const removePostMine = (payload) => ({
  type: REMOVE_POST_MINE,
  payload,
});

export const followAction = (payload) => ({
  type: FOLLOW,
  payload,
});

export const unFollowAction = (payload) => ({
  type: UNFOLLOW,
  payload,
});

function* signupSaga(action) {
  try {
    const result = yield call(userAPI.signup, action.payload);
    yield put({
      type: SIGNUP_SUCCESS,
      payload: result,
    });
  } catch (error) {
    yield put({
      type: SIGNUP_ERROR,
      error: error.response.data,
    });
  }
}

// fork: 비동기 함수호출 -> 결과를 기다리지 않고 다음 코드를 실행
// call: 동기 함수호출 -> 결과를 기다렸다가 실행
function* loginSaga(action) {
  try {
    const result = yield call(userAPI.login, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield put({
      type: LOGIN_SUCCESS,
      // payload: { ...action.payload, nickname: "jiin" },
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: LOGIN_ERROR,
      payload: error.response.data,
    });
  }
}

function* followingSaga(action) {
  try {
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      payload: action.payload,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: FOLLOW_ERROR,
      payload: e,
    });
  }
}

function* unFollowingSaga(action) {
  try {
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      payload: action.payload,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: UNFOLLOW_ERROR,
      payload: e,
    });
  }
}

const logoutSaga = createPromiseSaga(LOGOUT, userAPI.logout);

export function* userSaga() {
  yield takeLatest(SIGNUP, signupSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(FOLLOW, followingSaga);
  yield takeLatest(UNFOLLOW, unFollowingSaga);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return handleAsyncActions(LOGIN, "login")(state, action);
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: reducerUtils.success(action.payload),
        me: dummyUser(action.payload),
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
    case SIGNUP_RESET:
      return {
        ...state,
        signup: reducerUtils.initial(),
      };
    case CHANGE_NICKNAME:
    case CHANGE_NICKNAME_SUCCESS:
    case CHANGE_NICKNAME_ERROR:
      return handleAsyncActions(CHANGE_NICKNAME, "changeNickname")(
        state,
        action
      );
    case ADD_POST_MINE:
      return produce(state, (draft) => {
        draft.me.Posts.unshift({ id: action.payload });
      });
    case REMOVE_POST_MINE:
      const newPost = state.me.Posts.filter((v) => v.id !== action.payload);
      return produce(state, (draft) => {
        draft.me.Posts = newPost;
      });
    case FOLLOW_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followings.push({ id: action.payload });
        draft.follow = reducerUtils.success(null);
      });
    case FOLLOW:
    case FOLLOW_ERROR:
      return handleAsyncActions(FOLLOW, "follow")(state, action);
    case UNFOLLOW_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.payload
        );
        draft.unFollow = reducerUtils.success(null);
      });
    case UNFOLLOW:
    case UNFOLLOW_ERROR:
      return handleAsyncActions(UNFOLLOW, "unFollow")(state, action);
    default:
      return state;
  }
};

export default reducer;
