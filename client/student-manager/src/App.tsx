import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import GradesChartPage from "./pages/GradesChartPage";
import UpdateStudentPage from "./pages/UpdateStudentPage";
import ViewStudentPage from "./pages/ViewStudentPage";
import { StudentsPageProvider } from "./contexts/StudentsPageContext";
import { ServerStatusProvider } from "./contexts/ServerStatusContext";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";

function App() {
  return (
    <BrowserRouter>
      <AuthenticationProvider>
        <ServerStatusProvider>
          <StudentsPageProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/addStudent" element={<AddStudentPage />} />
                <Route path="/gradesChart" element={<GradesChartPage />} />
                <Route
                  path="/updateStudent/:id"
                  element={<UpdateStudentPage />}
                />
                <Route path="/students/:id" element={<ViewStudentPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </StudentsPageProvider>
        </ServerStatusProvider>
      </AuthenticationProvider>
    </BrowserRouter>
  );
}

export default App;
