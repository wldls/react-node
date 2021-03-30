import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3065",
  withCredentials: true,
});

export default client;
