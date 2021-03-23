import { all, fork, takeLatest, put, delay } from "redux-saga/effects";
import axios from "axios";

function loginAPI(data) {
  return axios.post("/api/login", data);
}

function logoutAPI() {
  return axios.post("/api/logout");
}

// fork: 비동기 함수호출 -> 결과를 기다리지 않고 다음 코드를 실행
// call: 동기 함수호출 -> 결과를 기다렸다가 실행
function* login(action) {
  try {
    // const result = yield call(loginAPI, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    yield put({
      type: "LOGIN_SUCCESS",
      data: { ...action.data, nickname: "jiin" },
    });
  } catch (error) {
    yield put({
      type: "LOGIN_FAILURE",
      data: error.response.data,
    });
  }
}

function* logout() {
  try {
    // const result = yield call(logoutAPI); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    yield put({
      type: "LOGOUT_SUCCESS",
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: "LOGOUT_FAILURE",
      data: error.response.data,
    });
  }
}

// take는 한 번만 실행되므로 이벤트 리스너의 역할을 계속해서 지속하려면 takeEvery를 사용한다.
// takeLatest는 여러번 클릭했을 때 마지막 클릭만 인정하도록 해준다.(백엔드 서버에서 두 번 오는 응답을 취소하는 것이므로 요청은 두 번이 그대로 간다. 이 부분은 서버측에서 해결해줘야함)

function* watchLogin() {
  yield takeLatest("LOGIN_REQUEST", login);
}

function* watchLogout() {
  yield takeLatest("LOGOUT_REQUEST", logout);
}

// fork: generator함수를 실행
// all: 함수를 동시에 실행
export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogout)]);
}
