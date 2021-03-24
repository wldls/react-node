import axios from "axios";
// import client from "./index";

export const loginAPI = (data) => axios.post("/api/login", data);
export const logoutAPI = () => axios.post("/api/logout");
