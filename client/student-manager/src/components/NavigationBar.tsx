import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ServerStatusContext } from "../contexts/ServerStatusContext";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

function NavigationBar() {
  const { serverOnline } = useContext(ServerStatusContext);
  const { accessToken, setAccessToken } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const handleSignOutClick = () => {
    navigate("/");
    setAccessToken(null);
  };

  const serverLabel = serverOnline ? (
    <p className="font-bold text-xs text-green-300">ONLINE</p>
  ) : (
    <p className="font-bold text-xs text-red-600">OFFLINE</p>
  );

  const navLinks = accessToken ? (
    <div>
      <Link to="/" className="nav-bar-btn">
        Home
      </Link>
      <Link to="/students" className="nav-bar-btn">
        Students
      </Link>
      <Link to="/addStudent" className="nav-bar-btn">
        Add Student
      </Link>
      <Link to="/gradesChart" className="nav-bar-btn">
        Grades Chart
      </Link>
      <button className="nav-bar-btn" onClick={handleSignOutClick}>
        Sign out
      </button>
    </div>
  ) : (
    <div>
      <Link to="/" className="nav-bar-btn">
        Home
      </Link>
      <Link to="/sign-in" className="nav-bar-btn">
        Sign in
      </Link>
    </div>
  );

  return (
    <nav className="bg-sky-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Student Manager</h1>
          {serverLabel}
        </div>

        {navLinks}
      </div>
    </nav>
  );
}

export default NavigationBar;
