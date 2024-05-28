import axios from "axios";
import { serverURL } from "./serverURL";

export const authApi = axios.create({
    baseURL: serverURL,
    withCredentials: true,
});