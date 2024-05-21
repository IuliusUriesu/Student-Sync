import React, { createContext, useEffect, useState } from "react";
import { dataApi } from "../utils/api/dataApi";
import { authApi } from "../utils/api/authApi";
import { AxiosError } from "axios";
import { ExtendedInternalAxiosRequestConfig } from "../utils/ExtendedInternalAxiosRequestConfig";

interface User {
  id_user: number;
  username: string;
}

interface AuthenticationContextInterface {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  mustSignOut: boolean;
}

const defaultContextValue: AuthenticationContextInterface = {
  user: null,
  signIn: async () => {},
  register: async () => {},
  signOut: async () => {},
  mustSignOut: false,
};

export const AuthenticationContext = createContext(defaultContextValue);

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mustSignOut, setMustSignOut] = useState(false);

  const refresh = async () => {
    const res = await authApi.post("/api/users/token");
    const token: string = res.data.accessToken;
    setAccessToken(token);
    console.log("New access token received!");
    return token;
  };

  useEffect(() => {
    const requestInterceptor = dataApi.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      dataApi.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = dataApi.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (!error.config) {
          return;
        }
        const originalRequest: ExtendedInternalAxiosRequestConfig =
          error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          //console.log("Attempting to refresh token due to 403 error");
          originalRequest._retry = true;

          try {
            const newToken = await refresh();
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            console.log("Retrying request");
            return dataApi(originalRequest);
          } catch (error) {
            console.log("Failed to receive new access token");
            setMustSignOut(true);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      dataApi.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const res = await authApi.post("/api/users/login", {
        username: username,
        password: password,
      });

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setMustSignOut(false);
    } catch (error) {
      let message = "An unexpected error occurred!";
      const err: AxiosError = error as AxiosError;
      if (err.response?.data) {
        message = err.response.data.toString();
      }
      throw new Error(message);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await authApi.post("/api/users", {
        username: username,
        password: password,
      });

      console.log("User registered successfully!", res.data);
    } catch (error) {
      let message = "An unexpected error occurred!";
      const err: AxiosError = error as AxiosError;
      if (err.response?.data) {
        message = err.response.data.toString();
      }
      throw new Error(message);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...", user);
      if (!user) return;
      const res = await authApi.delete(`/api/users/logout/${user.id_user}`);
      console.log(res.data);

      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{ user, signIn, register, signOut, mustSignOut }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
