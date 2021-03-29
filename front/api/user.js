import client from "./index";

export const login = (data) => client.post("/user/login", data);
export const logout = () => client.post("/user/logout");
export const signup = (payload) => client.post("/user", payload);
