import "./App.css";
import { Home, Login, Register, Dashboard } from "./components";
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
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
