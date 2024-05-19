import { useParams } from "react-router-dom";
import StudentForm from "../components/StudentForm";
import GoBackButton from "../components/GoBackButton";
import PageTitle from "../components/PageTitle";

function UpdateStudentPage() {
  const { id } = useParams();
  const studentId = id ? parseInt(id) : 0;

  return (
    <>
      <GoBackButton />
      <PageTitle text="Update Student" />
      <StudentForm type="update" studentId={studentId} />
    </>
  );
}

export default UpdateStudentPage;
