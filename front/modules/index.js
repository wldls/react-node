import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { all, fork } from "redux-saga/effects";
import user, { userSaga } from "./user";
import post, { postSaga } from "./post";

// const index = (state = {}, action) => {
//   switch (action.type) {
//     case "HYDRATE":
//       // getServerSideProps 부분이 실행되는 결과를 hydrate로 보내줌
//       console.log("HYDRATE", action);
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// };

// // (이전상태 ,액션) => 다음상태
// const rootReducer = combineReducers({
//   index,
//   user,
//   post,
// });

// 구조를 이렇게 변경해야 hydrate가 적용됨
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

// fork: generator함수를 실행
// all: 함수를 동시에 실행
export function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
  // yield all([postSaga(), userSaga()]);
}

export default rootReducer;
