import "./App.css";
import {
  Home,
  Login,
  Register,
  Dashboard,
  ErrorPage,
  Navbar,
} from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
function App() {
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const [currentForm, setCurrentForm] = useState("login");
  return (
    <div className="App">
      <Router>
    <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              currentForm === "login" ? (
                <Login onFormSwitch={toggleForm} />
              ) : (
                <Register onFormSwitch={toggleForm} />
              )
            }
          />
          <Route path="/admin">
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route
            path="unauthorized"
            element={
              <ErrorPage
                statusCode="401"
                message="Unauthorized access denied"
              />
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
            element=<ErrorPage statusCode="404" message="Page not found" />
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
