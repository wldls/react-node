import client from "./index";

export const login = (payload) => client.post("/user/login", payload);
export const logout = () => client.post("/user/logout");

export const signup = (payload) => client.post("/user", payload);
export const myinfo = () => client.get("/user");
// export const userInfo = (payload) => client.get(`/user/${payload}`);
export const userInfo = (payload) => {
  console.log(payload);
  return client.get(`/user/${payload}`);
};

export const follow = (payload) => client.patch(`/user/${payload}/follow`);
export const unFollow = (payload) => client.delete(`/user/${payload}/follow`);
export const removeFollower = (payload) =>
  client.delete(`/user/follower/${payload}`);

export const loadFollowers = () => client.get(`/user/followers`);
export const loadFollowings = () => client.get(`/user/followings`);

export const changeNickname = (payload) =>
  client.patch("/user/nickname", { nickname: payload });
