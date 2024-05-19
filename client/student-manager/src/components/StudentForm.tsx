import React, { useContext, useEffect, useState } from "react";
import { Student } from "../utils/student";
import { AxiosError } from "axios";
import { ServerStatusContext } from "../contexts/ServerStatusContext";
import FormSubmitButton from "./FormSubmitButton";
import { dataApi } from "../utils/api/dataApi";

interface StudentFormProps {
  type: "add" | "update";
  studentId?: number;
}

function StudentForm({ type, studentId }: StudentFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    score: "",
    bio: "",
  });
  const [alert, setAlert] = useState<any>(null);

  const { serverOnline, makePostRequest, makePutRequest, getStudent } =
    useContext(ServerStatusContext);

  useEffect(() => {
    const fetchStudent = () => {
      if (!serverOnline && studentId) {
        const student = getStudent(studentId);
        setFormData({
          full_name: student.full_name,
          score: student.score.toString(),
          bio: student.bio,
        });
        return;
      }

      dataApi
        .get(`/api/students/list/${studentId}`)
        .then((res) => {
          setFormData({
            full_name: res.data.full_name,
            score: res.data.score,
            bio: res.data.bio,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (type === "update") {
      fetchStudent();
    }
  }, []);

  const getStudentData = (): Student => {
    const student: Student = {
      full_name: formData.full_name,
      score: parseFloat(formData.score),
      bio: formData.bio,
    };
    return student;
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      score: "",
      bio: "",
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addStudent = () => {
    const studentData = getStudentData();
    if (!serverOnline) {
      try {
        makePostRequest(studentData);
        setAlert(
          <div className="form-submit-msg server-down-msg">
            Server is offline. Student will be added when the server is online!
          </div>
        );
        resetForm();
      } catch (error) {
        setAlert(
          <div className="form-submit-msg error-msg">
            {(error as Error).message}
          </div>
        );
      }

      return;
    }

    dataApi
      .post("/api/students", studentData)
      .then(() => {
        setAlert(
          <div className="form-submit-msg ok-msg">
            Student added successfully!
          </div>
        );
        resetForm();
      })
      .catch((error: AxiosError) => {
        let message: any = "An unexpected error occurred!";
        if (error.response) {
          message = error.response.data;
        }
        setAlert(<div className="form-submit-msg error-msg">{message}</div>);
      });
  };

  const updateStudent = () => {
    const studentData = getStudentData();
    if (!serverOnline && studentId) {
      try {
        makePutRequest(studentId, studentData);
        setAlert(
          <div className="form-submit-msg server-down-msg">
            Server is offline. Student will be updated when the server is
            online!
          </div>
        );
      } catch (error) {
        setAlert(
          <div className="form-submit-msg error-msg">
            {(error as Error).message}
          </div>
        );
      }

      return;
    }

    dataApi
      .put(`/api/students/list/${studentId}`, studentData)
      .then(() => {
        setAlert(
          <div className="form-submit-msg ok-msg">
            Student updated successfully!
          </div>
        );
      })
      .catch((error: AxiosError) => {
        let message: any = "An unexpected error occurred!";
        if (error.response) {
          message = error.response.data;
        }
        setAlert(<div className="form-submit-msg error-msg">{message}</div>);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === "add") {
      addStudent();
    } else {
      updateStudent();
    }
  };

  return (
    <form className="form-styling" onSubmit={(e) => handleSubmit(e)}>
      <div className="mb-8">
        <label htmlFor="fullNameInput" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="fullNameInput"
          className="form-input"
          placeholder="John Doe"
          required
          name="full_name"
          value={formData.full_name}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="scoreInput" className="form-label">
          Score
        </label>
        <input
          type="number"
          id="scoreInput"
          className="form-input"
          placeholder="7.89"
          min={0}
          max={10}
          step={0.01}
          required
          name="score"
          value={formData.score}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="bioInput" className="form-label">
          Bio
        </label>
        <textarea
          id="bioInput"
          className="form-input min-h-16 max-h-32"
          placeholder="I love coding..."
          required
          name="bio"
          value={formData.bio}
          onChange={(e) => handleTextAreaChange(e)}
        ></textarea>
      </div>

      <FormSubmitButton text={type === "add" ? "Add" : "Update"} />

      {alert}
    </form>
  );
}

export default StudentForm;
