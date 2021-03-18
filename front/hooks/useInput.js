import { useState, useCallback } from "react";

export default (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  // 컴포넌트에 props로 넘겨주는 함수는 useCallback를 써야 최적화가 된다.
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler];
};
