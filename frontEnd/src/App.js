import "./App.css";
import {
  Home,
  Login,
  Register,
  Dashboard,
  ErrorPage,
  Navbar,
  Upload,
  Users,
} from "./components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

function AppContent() {
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const location = useLocation();
  const [currentForm, setCurrentForm] = useState("login");
  const [user, setUser] = useState(null);
  const hideNavbarPaths = ["/login"];
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            currentForm === "login" ? (
              <Login onLogin={handleLogin} onFormSwitch={toggleForm} />
            ) : (
              <Register onFormSwitch={toggleForm} />
            )
          }
        />
        <Route path="/admin">
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/upload" element={<Upload />} />
    <Route path = "/users" element= {<Users/>}/>
        <Route
          path="unauthorized"
          element={
            <ErrorPage statusCode="401" message="Unauthorized access denied" />
          }
        />
        <Route
          path="forbidden"
          element={
            <ErrorPage statusCode="403" message="Forbidden access denied" />
          }
        />
        <Route
          path="*"
          element={<ErrorPage statusCode="404" message="Page not found" />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
