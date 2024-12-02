import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Preferences from "./pages/Preferences";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./pages/Dashboard";
import { Assistant } from "./pages/Assistant";
// import { Recommend } from "./pages/Recommend";

const PrivateWrapper = ({ element }) => {
  const token = localStorage.getItem("jwt");
  const isAuthenticated = token && jwtDecode(token).exp * 1000 > Date.now(); // Example: Set to true if the user is authenticated

  return isAuthenticated ? element : <Navigate to="/Login" />;
};

function App() {
  return (
    <div className="App ">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/preferences"
            element={<PrivateWrapper element={<Preferences />} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateWrapper element={<Dashboard />} />}
          />
          <Route
            path="/Chatbot"
            element={<PrivateWrapper element={<Assistant />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
