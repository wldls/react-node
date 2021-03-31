import client from "./index";

export const login = (payload) => client.post("/user/login", payload);
export const logout = () => client.post("/user/logout");

export const signup = (payload) => client.post("/user", payload);
export const myinfo = () => client.get("/user");

export const follow = (payload) => client.patch(`/user/${payload}/follow`);
export const unFollow = (payload) => client.delete(`/user/${payload}/follow`);

export const changeNickname = (payload) =>
  client.patch("/user/nickname", { nickname: payload });
