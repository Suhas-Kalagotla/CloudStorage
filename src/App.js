import './App.css';
import {Home , Login } from "./components"; 
import{BrowserRouter as Router , Routes, Route }from "react-router-dom"; 
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
