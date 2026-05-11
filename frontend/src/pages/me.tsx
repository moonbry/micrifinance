import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Sidebar from "./components/Sidebar";

import GroupLoan from "./pages/GroupLoan";
import PersonalLoan from "./pages/PersonalLoan";
import EmployeeLoan from "./pages/EmployeeLoan";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/test")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="card">

        <h1 className="title">Microfinance System</h1>
        <p className="tagline">Empowering Your Financial Growth</p>

        {message && <p className="subtitle">{message}</p>}

        <div className="buttons">
          <Link to="/login" className="btn login">Login</Link>
          <Link to="/register" className="btn register">Register</Link>
        </div>

      </div>
    </div>
  );
}

/* 🔥 LAYOUT YA DASHBOARD */
function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Dashboard />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />} />

        {/* LOAN PAGES (🔥 HII NDIO ILIKUWA INAKOSEKANA) */}
        <Route path="/group-loan" element={<GroupLoan />} />
        <Route path="/personal-loan" element={<PersonalLoan />} />
        <Route path="/employee-loan" element={<EmployeeLoan />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;