import React, { createContext, useEffect, useState } from "react";
import { dataApi } from "../utils/api/dataApi";

interface AuthenticationContextInterface {
  accessToken: string | null;
  setAccessToken: (newAccessToken: string | null) => void;
}

const defaultContextValue: AuthenticationContextInterface = {
  accessToken: null,
  setAccessToken: () => {},
};

export const AuthenticationContext = createContext(defaultContextValue);

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const requestInterceptor = dataApi.interceptors.request.use(
      (config) => {
        if (accessToken) {
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

  return (
    <AuthenticationContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
