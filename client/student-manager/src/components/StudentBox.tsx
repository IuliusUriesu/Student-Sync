import { useState } from "react";
import { Student } from "../utils/student";
import { Link } from "react-router-dom";

interface StudentBoxProps {
  student: Student;
  onDelete: (id: number) => void;
}

function StudentBox({ student, onDelete }: StudentBoxProps) {
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteMessage(true);
  };

  const handleYesClick = () => {
    if (student.id_student) onDelete(student.id_student);
    setShowDeleteMessage(false);
  };

  const handleNoClick = () => {
    setShowDeleteMessage(false);
  };

  return (
    <div className="w-1/4 m-8 flex flex-col items-center space-y-2 p-4 rounded-3xl bg-white shadow-lg">
      <h3 className="text-xl text-black font-bold">{student.full_name}</h3>
      <h5>Score: {student.score}</h5>
      <div className="container mx-auto flex flex-row space-x-4">
        <Link
          to={`/students/${student.id_student}`}
          className="student-btn bg-cyan-600 hover:bg-cyan-800"
        >
          View
        </Link>
        <Link
          to={`/updateStudent/${student.id_student}`}
          className="student-btn bg-sky-500 hover:bg-sky-700"
        >
          Update
        </Link>
        <button
          className="student-btn bg-red-600 hover:bg-red-800"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
      {showDeleteMessage ? (
        <div>
          <p className="mt-2 text-center">
            Are you sure you want to delete this student?
          </p>
          <div className="container mx-auto flex flex-row justify-center mt-4">
            <button
              className="delete-msg-btn bg-red-600 hover:bg-red-800"
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button
              className="delete-msg-btn bg-gray-400 hover:bg-gray-600"
              onClick={handleNoClick}
            >
              No
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default StudentBox;
