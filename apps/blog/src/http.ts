import axios from "axios";
import { restURL } from "./statics";

export const http = axios.create({ baseURL: restURL, headers: { "Content-Type": "application/json" }, withCredentials: true });
