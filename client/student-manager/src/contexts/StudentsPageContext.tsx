import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext";

interface PagePropertiesInterface {
  currentPage: number;
  pageSize: number;
  sortBy: string;
  order: string;
}

const defaultPageProperties: PagePropertiesInterface = {
  currentPage: 1,
  pageSize: 3,
  sortBy: "ID",
  order: "Ascending",
};

interface StudentsPageContextInterface {
  pageProperties: PagePropertiesInterface;
  setCurrentPage: (newCurrentPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  setSortBy: (newSortBy: string) => void;
  setOrder: (newOrder: string) => void;
}

const defaultContextValue: StudentsPageContextInterface = {
  pageProperties: defaultPageProperties,
  setCurrentPage: () => {},
  setPageSize: () => {},
  setSortBy: () => {},
  setOrder: () => {},
};

export const StudentsPageContext = createContext(defaultContextValue);

interface StudentsPageProviderProps {
  children: React.ReactNode;
}

export function StudentsPageProvider({ children }: StudentsPageProviderProps) {
  const [pageProperties, setPageProperties] = useState(defaultPageProperties);

  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    if (user) setPageProperties(defaultPageProperties);
  }, [user]);

  const setCurrentPage = (newCurrentPage: number) => {
    setPageProperties((prevState) => ({
      ...prevState,
      currentPage: newCurrentPage,
    }));
  };

  const setPageSize = (newPageSize: number) => {
    setPageProperties((prevState) => ({
      ...prevState,
      pageSize: newPageSize,
    }));
  };

  const setSortBy = (newSortBy: string) => {
    setPageProperties((prevState) => ({
      ...prevState,
      sortBy: newSortBy,
    }));
  };

  const setOrder = (newOrder: string) => {
    setPageProperties((prevState) => ({
      ...prevState,
      order: newOrder,
    }));
  };

  return (
    <StudentsPageContext.Provider
      value={{
        pageProperties,
        setCurrentPage,
        setPageSize,
        setSortBy,
        setOrder,
      }}
    >
      {children}
    </StudentsPageContext.Provider>
  );
}
