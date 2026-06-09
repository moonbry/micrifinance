import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import GroupLoan from "./pages/GroupLoan";
import PersonalLoan from "./pages/PersonalLoan";
import EmployeeLoan from "./pages/EmployeeLoan";

import Users from "./pages/Users";

import LoanManager from "./pages/LoanManager";
import GeneralManager from "./pages/GeneralManager";
import ManagingDirector from "./pages/ManagingDirector";

import RepaymentTracker from "./pages/RepaymentTracker";

// =========================
// AXIOS INTERCEPTORS
// =========================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =========================
// MICROFINANCE CALCULATOR COMPONENT
// =========================
function MicrofinanceCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [loanPeriod, setLoanPeriod] = useState<number>(12);
  const [repaymentFrequency, setRepaymentFrequency] = useState<string>("Monthly");
  const [interestType, setInterestType] = useState<string>("Declining Balance");
  const [interestRate, setInterestRate] = useState<number>(3);
  const [processingFee, setProcessingFee] = useState<number>(2);
  const [startDate, setStartDate] = useState<string>("2026-06-27");
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, loanPeriod, interestRate, processingFee, interestType]);

  const calculateLoan = () => {
    let monthlyRate = interestRate / 100;
    let monthly = 0;
    
    if (interestType === "Declining Balance") {
      monthlyRate = interestRate / 100;
      if (monthlyRate > 0) {
        monthly = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanPeriod) / (Math.pow(1 + monthlyRate, loanPeriod) - 1);
      } else {
        monthly = loanAmount / loanPeriod;
      }
    } else {
      const totalInterestFlat = loanAmount * (interestRate / 100) * loanPeriod;
      monthly = (loanAmount + totalInterestFlat) / loanPeriod;
    }
    
    const totalLoanPayment = monthly * loanPeriod;
    const interest = totalLoanPayment - loanAmount;
    const fee = (loanAmount * processingFee) / 100;
    
    setMonthlyPayment(monthly);
    setTotalPayment(totalLoanPayment + fee);
    setTotalInterest(interest);
    setTotalFee(fee);
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const exportToPDF = () => {
    alert("PDF Export feature will be available soon!");
  };

  return (
    <div className="main-calculator">
      <div className="calc-header">
        <h1>MICROFINANCE CALCULATOR</h1>
      </div>
      
      <div className="calc-form">
        <div className="form-grid">
          <div className="field-group">
            <label>Loan Amount (TZS)</label>
            <input 
              type="text" 
              value={formatMoney(loanAmount)} 
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setLoanAmount(Number(val) || 0);
              }}
            />
          </div>

          <div className="field-group">
            <label>Loan Period</label>
            <input 
              type="number" 
              value={loanPeriod} 
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
            />
          </div>

          <div className="field-group">
            <label>Repayment Frequency</label>
            <select value={repaymentFrequency} onChange={(e) => setRepaymentFrequency(e.target.value)}>
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Bi-Weekly</option>
              <option>Quarterly</option>
            </select>
          </div>

          <div className="field-group">
            <label>Interest Type</label>
            <select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
              <option>Declining Balance</option>
              <option>Flat Rate</option>
            </select>
          </div>

          <div className="field-group">
            <label>Interest Rate (% per month)</label>
            <input 
              type="number" 
              step="0.1"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <div className="field-group">
            <label>Processing Fee (%)</label>
            <input 
              type="number" 
              step="0.5"
              value={processingFee} 
              onChange={(e) => setProcessingFee(Number(e.target.value))}
            />
          </div>

          <div className="field-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="field-group buttons">
            <button className="btn-calculate" onClick={calculateLoan}>Calculate</button>
            <button className="btn-export" onClick={exportToPDF}>Export PDF</button>
          </div>
        </div>
      </div>

      <div className="calc-results">
        <div className="result-card">
          <div className="result-label">Monthly Payment</div>
          <div className="result-value">{formatMoney(monthlyPayment)}</div>
        </div>
        <div className="result-card">
          <div className="result-label">Total Payment</div>
          <div className="result-value">{formatMoney(totalPayment)}</div>
        </div>
        <div className="result-card">
          <div className="result-label">Total Interest</div>
          <div className="result-value">{formatMoney(totalInterest)}</div>
        </div>
        <div className="result-card">
          <div className="result-label">Processing Fee</div>
          <div className="result-value">{formatMoney(totalFee)}</div>
        </div>
      </div>
    </div>
  );
}

// =========================
// HOME PAGE (LANDING PAGE)
// =========================
function Home() {
  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="logo">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">Orethan Microfinance</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Get Started</Link>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="calculator-section">
        <MicrofinanceCalculator />
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2026 Orethan Microfinance. All rights reserved.</p>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Landing Page */
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
        }

        /* Top Navigation */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 28px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: white;
        }

        .nav-links {
          display: flex;
          gap: 16px;
        }

        .login-btn {
          padding: 10px 28px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 40px;
          color: white;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .login-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: white;
        }

        .register-btn {
          padding: 10px 28px;
          background: white;
          border: none;
          border-radius: 40px;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* Calculator Section */
        .calculator-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 60px;
        }

        /* Main Calculator */
        .main-calculator {
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 28px;
          padding: 32px 40px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }

        .calc-header h1 {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        }

        /* Form Grid - Horizontal Layout */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }

        .field-group label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .field-group input,
        .field-group select {
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
          background: #f8fafc;
        }

        .field-group input:focus,
        .field-group select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
          background: white;
        }

        .field-group.buttons {
          display: flex;
          flex-direction: row;
          gap: 12px;
          margin-top: 22px;
        }

        .btn-calculate {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-calculate:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }

        .btn-export {
          flex: 1;
          padding: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-export:hover {
          background: #e2e8f0;
        }

        /* Results */
        .calc-results {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .result-card {
          text-align: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
        }

        .result-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .result-value {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 16px;
          background: rgba(0,0,0,0.1);
        }

        .footer p {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }

        /* Responsive */
        @media (max-width: 1000px) {
          .form-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .calc-results {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .top-nav {
            padding: 15px 30px;
            flex-direction: column;
            gap: 15px;
          }
          .calculator-section {
            padding: 30px;
          }
          .main-calculator {
            padding: 24px;
          }
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .calc-results {
            grid-template-columns: 1fr;
          }
          .field-group.buttons {
            flex-direction: column;
          }
          .calc-header h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

// =========================
// PROTECTED ROUTE COMPONENT
// =========================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// =========================
// MAIN LAYOUT
// =========================
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: "238px",
        display: "flex", 
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9"
      }}>
        <Navbar />
        <div style={{ 
          flex: 1, 
          padding: "24px 24px 24px 24px",
          overflowY: "auto"
        }}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

// =========================
// APP ROUTES
// =========================
// =========================
// APP ROUTES
// =========================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT - Home Page (Landing Page with Calculator) */}
        <Route path="/" element={<Home />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========== FORMS - FULL PAGE (NO SIDEBAR) ========== */}
        {/* Hizi forms zitaonekana full screen bila sidebar */}
        <Route path="/personal-loan" element={<PersonalLoan />} />
        <Route path="/group-loan" element={<GroupLoan />} />
        <Route path="/employee-loan" element={<EmployeeLoan />} />

        {/* ========== PROTECTED ROUTES - WITH SIDEBAR ========== */}
        {/* Hizi ni routes zenye sidebar (dashboard, users, managers, n.k) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-manager"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LoanManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/general-manager"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GeneralManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managing-director"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ManagingDirector />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/repayment-tracker"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RepaymentTracker />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;