import axios from "axios";
// import client from "./index";

export const login = (data) => axios.post("/api/login", data);
export const logout = () => axios.post("/api/logout");
export const signup = (payload) => axios.post("/user", payload);
