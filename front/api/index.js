import axios from "axios";

const client = axios.create();

client.defaults.baseURL = "http://localhost:3065";
client.defaults.withCredentials = true;

export default client;
