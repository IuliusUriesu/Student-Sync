import axios from "axios";

export const dataApi = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});