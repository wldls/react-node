import { createWrapper } from "next-redux-wrapper";
import { createStore } from "redux";
import reducer from "../reducers/index";

const configureStore = () => {
  const store = createStore(reducer);
  return store;
};

// 개발모드에서 debug를 true로 설정
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
