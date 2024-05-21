import { InternalAxiosRequestConfig } from "axios";

export interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}