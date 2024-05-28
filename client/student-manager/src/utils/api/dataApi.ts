import axios from "axios";
import { serverURL } from "./serverURL";

export const dataApi = axios.create({
    baseURL: serverURL,
    withCredentials: true,
});