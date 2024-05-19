import { useParams } from "react-router-dom";
import GoBackButton from "../components/GoBackButton";
import { useContext, useEffect, useState } from "react";
import { Student, getDefaultStudent } from "../utils/student";
import PageTitle from "../components/PageTitle";
import { ServerStatusContext } from "../contexts/ServerStatusContext";
import EnrollmentsTable from "../components/EnrollmentsTable";
import { dataApi } from "../utils/api/dataApi";

function ViewStudentPage() {
  const [student, setStudent] = useState<Student>(getDefaultStudent());

  const { serverOnline, getStudent } = useContext(ServerStatusContext);

  const { id } = useParams();
  const studentId = id ? parseInt(id) : 0;

  useEffect(() => {
    const fetchStudent = () => {
      if (!serverOnline) {
        setStudent(getStudent(studentId));
        return;
      }

      dataApi
        .get(`/api/students/list/${studentId}`)
        .then((res) => {
          setStudent(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStudent();
  }, []);

  return (
    <>
      <GoBackButton />
      <PageTitle text={student.full_name} />
      <h3 className="text-center text-lg font-semibold">
        Score: {student.score}
      </h3>
      <div className="max-w-lg mx-auto my-8 px-2 py-1 bg-white text-sm text-center rounded-lg shadow-lg">
        {student.bio}
      </div>

      {serverOnline ? (
        <EnrollmentsTable studentId={studentId} />
      ) : (
        <div className="form-submit-msg text-center text-red-600 bg-red-100 border-red-600 w-1/2 mx-auto mt-16">
          Server is offline. Enrollments of this student will be available when
          the server is online.
        </div>
      )}
    </>
  );
}

export default ViewStudentPage;
