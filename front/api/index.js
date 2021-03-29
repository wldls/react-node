import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3065",
});

export default client;
