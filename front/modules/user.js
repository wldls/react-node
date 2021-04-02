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
  removeFollower: reducerUtils.initial(),
  followers: reducerUtils.initial(),
  followings: reducerUtils.initial(),
  changeNickname: reducerUtils.initial(),
  myinfo: reducerUtils.initial(),
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

// const dummyUser = (data) => ({
//   ...data,
//   nickname: "jiin",
//   id: 1,
//   Posts: [{ id: 1 }],
//   Followings: [
//     { nickname: "민지" },
//     { nickname: "정몬" },
//     { nickname: "욘지" },
//   ],
//   Followers: [{ nickname: "민지" }, { nickname: "정몬" }, { nickname: "욘지" }],
// });

// 로그인 유지
const LOAD_MYINFO = "LOAD_MYINFO";
const LOAD_MYINFO_SUCCESS = "LOAD_MYINFO_SUCCESS";
const LOAD_MYINFO_ERROR = "LOAD_MYINFO_ERROR";

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

const REMOVE_FOLLOWER = "REMOVE_FOLLOWER";
const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
const REMOVE_FOLLOWER_ERROR = "REMOVE_FOLLOWER_ERROR";

const CHANGE_NICKNAME = "CHANGE_NICKNAME";
const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
const CHANGE_NICKNAME_ERROR = "CHANGE_NICKNAME_ERROR";

const LOAD_FOLLOWERS = "LOAD_FOLLOWERS";
const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
const LOAD_FOLLOWERS_ERROR = "LOAD_FOLLOWERS_ERROR";

const LOAD_FOLLOWINGS = "LOAD_FOLLOWINGS";
const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
const LOAD_FOLLOWINGS_ERROR = "LOAD_FOLLOWINGS_ERROR";

const ADD_POST_MINE = "ADD_POST_MINE";
const REMOVE_POST_MINE = "REMOVE_POST_MINE";

// action creator
export const loadMyinfo = () => ({
  type: LOAD_MYINFO,
});

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

export const removeFollowerAction = (payload) => ({
  type: REMOVE_FOLLOWER,
  payload,
});

export const loadFollowersAction = () => ({
  type: LOAD_FOLLOWERS,
});

export const loadFollowingsAction = () => ({
  type: LOAD_FOLLOWINGS,
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

function* loadMyinfoSaga() {
  try {
    const result = yield call(userAPI.myinfo);
    yield put({
      type: LOAD_MYINFO_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_MYINFO_ERROR,
      error: error.response.data,
    });
  }
}

// fork: 비동기 함수호출 -> 결과를 기다리지 않고 다음 코드를 실행
// call: 동기 함수호출 -> 결과를 기다렸다가 실행
function* loginSaga(action) {
  try {
    const result = yield call(userAPI.login, action.payload); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error.response);
    yield put({
      type: LOGIN_ERROR,
      error: error.response.data,
    });
  }
}

function* logoutSaga() {
  try {
    yield call(userAPI.logout);
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOGOUT_ERROR,
      error: error.response.data,
    });
  }
}

function* followingSaga(action) {
  try {
    const result = yield call(userAPI.follow, action.payload);
    yield put({
      type: FOLLOW_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: FOLLOW_ERROR,
      payload: error.response.data,
    });
  }
}

function* unFollowingSaga(action) {
  try {
    const result = yield call(userAPI.unFollow, action.payload);
    yield put({
      type: UNFOLLOW_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: UNFOLLOW_ERROR,
      payload: error.response.data,
    });
  }
}

function* removeFollowerSaga(action) {
  try {
    const result = yield call(userAPI.removeFollower, action.payload);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: REMOVE_FOLLOWER_ERROR,
      payload: error.response.data,
    });
  }
}

function* loadFollowersSaga() {
  try {
    const result = yield call(userAPI.loadFollowers);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_FOLLOWERS_ERROR,
      payload: error.response.data,
    });
  }
}

function* loadFollowingsSaga() {
  try {
    const result = yield call(userAPI.loadFollowings);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_FOLLOWINGS_ERROR,
      payload: error.response.data,
    });
  }
}

function* changeNicknameSaga(action) {
  try {
    const result = yield call(userAPI.changeNickname, action.payload);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error.response.data);
    yield put({
      type: CHANGE_NICKNAME_ERROR,
      error: error.response.data,
    });
  }
}

export function* userSaga() {
  yield takeLatest(LOAD_MYINFO, loadMyinfoSaga);
  yield takeLatest(SIGNUP, signupSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(FOLLOW, followingSaga);
  yield takeLatest(UNFOLLOW, unFollowingSaga);
  yield takeLatest(REMOVE_FOLLOWER, removeFollowerSaga);
  yield takeLatest(LOAD_FOLLOWERS, loadFollowersSaga);
  yield takeLatest(LOAD_FOLLOWINGS, loadFollowingsSaga);
  yield takeLatest(CHANGE_NICKNAME, changeNicknameSaga);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MYINFO_SUCCESS:
      return {
        ...state,
        myinfo: reducerUtils.success(action.payload),
        me: action.payload,
      };
    case LOAD_MYINFO:
    case LOAD_MYINFO_ERROR:
      return handleAsyncActions(LOAD_MYINFO, "myinfo")(state, action);
    case LOGIN:
      return handleAsyncActions(LOGIN, "login")(state, action);
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: reducerUtils.success(action.payload),
        me: action.payload,
      };
    case LOGIN_ERROR:
      return handleAsyncActions(LOGIN, "login")(state, action);
    case LOGOUT_SUCCESS:
      return {
        ...state,
        logout: reducerUtils.success(action.payload),
        login: reducerUtils.initial(),
        me: null,
      };
    case LOGOUT:
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
    case CHANGE_NICKNAME_SUCCESS:
      return produce(state, (draft) => {
        draft.me.nickname = action.payload.nickname;
      });
    case CHANGE_NICKNAME:
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
        draft.me.Followings.push({ id: action.payload.UserId });
        draft.follow = reducerUtils.success({ id: action.payload.UserId });
      });
    case FOLLOW:
    case FOLLOW_ERROR:
      return handleAsyncActions(FOLLOW, "follow")(state, action);
    case UNFOLLOW_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.payload.UserId
        );
        draft.unFollow = reducerUtils.success(action.payload);
      });
    case UNFOLLOW:
    case UNFOLLOW_ERROR:
      return handleAsyncActions(UNFOLLOW, "unFollow")(state, action);
    case REMOVE_FOLLOWER_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followers = draft.me.Followers.filter(
          (v) => v.id !== action.payload.UserId
        );
        draft.removeFollower = reducerUtils.success(action.payload);
      });
    case REMOVE_FOLLOWER:
    case REMOVE_FOLLOWER_ERROR:
      return handleAsyncActions(REMOVE_FOLLOWER, "removeFollower")(
        state,
        action
      );
    case LOAD_FOLLOWERS_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followers = action.payload;
      });
    case LOAD_FOLLOWERS:
    case LOAD_FOLLOWERS_ERROR:
      return handleAsyncActions(LOAD_FOLLOWERS, "followers")(state, action);
    case LOAD_FOLLOWINGS_SUCCESS:
      return produce(state, (draft) => {
        draft.me.Followings = action.payload;
      });
    case LOAD_FOLLOWINGS:
    case LOAD_FOLLOWINGS_ERROR:
      return handleAsyncActions(LOAD_FOLLOWINGS, "followings")(state, action);
    default:
      return state;
  }
};

export default reducer;
