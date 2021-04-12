// immer ie11 지원 코드
import { produce, enableES5 } from "immer";

const utilProduce = (...args) => {
  enableES5();
  return produce(...args);
};

export default utilProduce;
