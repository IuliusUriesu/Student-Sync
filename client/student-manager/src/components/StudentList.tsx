import { useContext, useEffect, useState } from "react";
import StudentBox from "../components/StudentBox";
import { StudentsPageContext } from "../contexts/StudentsPageContext";
import { Student } from "../utils/student";
import { ServerStatusContext } from "../contexts/ServerStatusContext";
import { dataApi } from "../utils/api/dataApi";

interface StudentListProps {
  onDelete: () => void;
}

function StudentList({ onDelete }: StudentListProps) {
  const [studentList, setStudentList] = useState<Student[]>([]);

  const { pageProperties } = useContext(StudentsPageContext);
  const {
    serverOnline,
    activeStudentList,
    setActiveStudentList,
    makeDeleteRequest,
  } = useContext(ServerStatusContext);

  const fetchStudentPage = () => {
    let sortBy = "";
    if (pageProperties.sortBy === "ID") {
      sortBy = "id_student";
    } else if (pageProperties.sortBy === "Name") {
      sortBy = "full_name";
    } else if (pageProperties.sortBy === "Score") {
      sortBy = "score";
    }

    let order = "";
    if (pageProperties.order === "Ascending") {
      order = "asc";
    } else if (pageProperties.order === "Descending") {
      order = "desc";
    }

    const currentPage = pageProperties.currentPage;
    const pageSize = pageProperties.pageSize;

    //console.log("fetch student page");
    dataApi
      .get(
        `/api/students/pages/${currentPage}?pageSize=${pageSize}&sortBy=${sortBy}&order=${order}`
      )
      .then((res) => {
        setStudentList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (serverOnline) setActiveStudentList(studentList);
  }, [studentList]);

  useEffect(() => {
    if (serverOnline) {
      fetchStudentPage();
    } else {
      setStudentList(activeStudentList);
    }
  }, [pageProperties, serverOnline]);

  useEffect(() => {
    if (!serverOnline) setStudentList(activeStudentList);
  }, [activeStudentList]);

  const handleDelete = (id: number) => {
    if (!serverOnline) {
      makeDeleteRequest(id);
      return;
    }

    dataApi
      .delete(`/api/students/list/${id}`)
      .then((res) => {
        console.log("Student deleted successfully", res.data);
        onDelete();
        fetchStudentPage();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const studentBoxes = studentList.map((student) => (
    <StudentBox
      key={student.id_student}
      student={student}
      onDelete={handleDelete}
    />
  ));

  return (
    <div className="flex flex-row flex-wrap justify-center items-start">
      {studentBoxes}
    </div>
  );
}

export default StudentList;
