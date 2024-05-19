import React, { createContext, useEffect, useState } from "react";
import { Student, getDefaultStudent, validateStudent } from "../utils/student";
import {
  DeleteRequest,
  PostRequest,
  PutRequest,
  Request,
} from "../utils/request";
import { pingApi } from "../utils/api/pingApi";

interface ServerStatusContextInterface {
  serverOnline: boolean;
  activeStudentList: Student[];
  setActiveStudentList: (newStudentList: Student[]) => void;
  makePostRequest: (data: Student) => void;
  makeDeleteRequest: (id: number) => void;
  makePutRequest: (id: number, data: Student) => void;
  getStudent: (id: number) => Student;
}

const defaultContextValue: ServerStatusContextInterface = {
  serverOnline: true,
  activeStudentList: [],
  setActiveStudentList: () => {},
  makePostRequest: () => {},
  makeDeleteRequest: () => {},
  makePutRequest: () => {},
  getStudent: () => {
    return getDefaultStudent();
  },
};

export const ServerStatusContext = createContext(defaultContextValue);

interface ServerStatusProviderProps {
  children: React.ReactNode;
}

export function ServerStatusProvider({ children }: ServerStatusProviderProps) {
  const [serverOnline, setServerOnline] = useState(true);
  const [activeStudentList, setActiveStudentList] = useState<Student[]>([]);
  const [requestQueue, setRequestQueue] = useState<Request[]>([]);

  useEffect(() => {
    const pingServer = () => {
      pingApi
        .get("/api/ping")
        .then((res) => {
          console.log(res.data);
          if (!serverOnline) setServerOnline(true);
        })
        .catch(() => {
          console.log("Server Offline");
          if (serverOnline) setServerOnline(false);
        });
    };

    const sendRequests = async () => {
      for (const req of requestQueue) {
        try {
          const res = await req.send();
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }

      setRequestQueue([]);
    };

    if (serverOnline) {
      sendRequests();
    }

    const intervalId = setInterval(pingServer, 3000);
    return () => clearInterval(intervalId);
  }, [serverOnline]);

  const pushInQueue = (req: Request) => {
    const newRequestQueue = [...requestQueue, req];
    setRequestQueue(newRequestQueue);
  };

  const deleteFromActiveList = (id: number) => {
    const newActiveList = activeStudentList.filter(
      (student) => student.id_student !== id
    );
    setActiveStudentList(newActiveList);
  };

  const updateInActiveList = (id: number, data: Student) => {
    const newActiveList = activeStudentList.slice();
    const index = newActiveList.findIndex(
      (student) => student.id_student === id
    );
    if (index === -1) return;

    newActiveList[index].full_name = data.full_name;
    newActiveList[index].score = data.score;
    newActiveList[index].bio = data.bio;

    setActiveStudentList(newActiveList);
  };

  const makePostRequest = (data: Student) => {
    validateStudent(data);

    const post: Request = new PostRequest("/api/students", data);
    pushInQueue(post);
  };

  const makeDeleteRequest = (id: number) => {
    const del: Request = new DeleteRequest(`/api/students/list/${id}`);
    pushInQueue(del);
    deleteFromActiveList(id);
  };

  const makePutRequest = (id: number, data: Student) => {
    validateStudent(data);

    const put: Request = new PutRequest(`/api/students/list/${id}`, data);
    pushInQueue(put);
    updateInActiveList(id, data);
  };

  const getStudent = (id: number): Student => {
    const student = activeStudentList.find(
      (student) => student.id_student === id
    );
    return student ? student : getDefaultStudent();
  };

  return (
    <ServerStatusContext.Provider
      value={{
        serverOnline,
        activeStudentList,
        setActiveStudentList,
        makePostRequest,
        makeDeleteRequest,
        makePutRequest,
        getStudent,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
}
