import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SignInPage from "../pages/SignInPage";
import RegisterPage from "../pages/RegisterPage";
import AddStudentPage from "../pages/AddStudentPage";
import GradesChartPage from "../pages/GradesChartPage";
import StudentsPage from "../pages/StudentsPage";
import UpdateStudentPage from "../pages/UpdateStudentPage";
import ViewStudentPage from "../pages/ViewStudentPage";

function RoutingComponent() {
  const { user } = useContext(AuthenticationContext);

  const routes = user ? (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/addStudent" element={<AddStudentPage />} />
        <Route path="/gradesChart" element={<GradesChartPage />} />
        <Route path="/updateStudent/:id" element={<UpdateStudentPage />} />
        <Route path="/students/:id" element={<ViewStudentPage />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );

  return <BrowserRouter>{routes}</BrowserRouter>;
}

export default RoutingComponent;
