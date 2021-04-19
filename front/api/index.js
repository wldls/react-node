import axios from "axios";
import { backUrl } from "../config/config";

const client = axios.create();

client.defaults.baseURL = backUrl;
client.defaults.withCredentials = true;

export default client;
