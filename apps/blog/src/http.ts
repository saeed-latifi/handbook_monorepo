import axios from "axios";
import { apiURL } from "./statics";

export const http = axios.create({ baseURL: apiURL, headers: { "Content-Type": "application/json" }, withCredentials: true });
