import PageTitle from "../components/PageTitle";
import StudentForm from "../components/StudentForm";

function AddStudentPage() {
  return (
    <>
      <PageTitle text="Add a New Student" />
      <StudentForm type="add" />
    </>
  );
}

export default AddStudentPage;
