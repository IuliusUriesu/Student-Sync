import axios from "axios";
import { serverURL } from "./serverURL";

export const pingApi = axios.create({
    baseURL: serverURL,
});