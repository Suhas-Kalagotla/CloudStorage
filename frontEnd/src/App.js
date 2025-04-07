import "./App.css";
import React from "react";
import {
  Home,
  Login,
  Register,
  Dashboard,
  ErrorPage,
  Navbar,
  Users,
  Landing,
  Folders,
} from "./components";
import { ProtectedRoute } from "./components/util/ProtectedRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { UserProvider } from "./context/UserContext";

function AppContent() {
  const location = useLocation();
  const [currentForm, setCurrentForm] = useState("login");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const hideNavbarPaths = ["/login"];

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar user={user} />}
      <Routes>
        <Route
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]} user={user} />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>
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
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} user={user} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="folders" element={<Folders />} />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="/folders/:folderId" element={<Home />} />
        <Route
          path="/unauthorized"
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
      <UserProvider>
        <div className="App">
          <AppContent />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
