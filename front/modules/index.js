import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { all, fork } from "redux-saga/effects";
import user, { userSaga } from "./user";
import post, { postSaga } from "./post";

const index = (state = {}, action) => {
  switch (action.type) {
    case "HYDRATE":
      console.log("HYDRATE", action);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// (이전상태 ,액션) => 다음상태
const rootReducer = combineReducers({
  index,
  user,
  post,
});

// fork: generator함수를 실행
// all: 함수를 동시에 실행
export function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
  // yield all([postSaga(), userSaga()]);
}

export default rootReducer;
