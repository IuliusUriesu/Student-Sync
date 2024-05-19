import axios from "axios";

export const pingApi = axios.create({
    baseURL: "http://localhost:8080",
});