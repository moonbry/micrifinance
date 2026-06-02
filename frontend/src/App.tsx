import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

/* =========================
   HOME PAGE (ULTRA MODERN - REDESIGNED)
========================= */
function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    setStatus("loading");
    axios
      .get("http://127.0.0.1:8000/api/test")
      .then((res) => {
        setMessage(res.data.message);
        setStatus("success");
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
  }, []);

  return (
    <div className="home">
      {/* Animated gradient background */}
      <div className="animated-bg"></div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ animationDelay: `${i * 1.5}s` }}></div>
        ))}
      </div>

      {/* Glow orbs */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>
      <div className="glow-orb glow-orb-4"></div>

      {/* Grid pattern overlay */}
      <div className="grid-overlay"></div>

      <main className="home__wrap">
        {/* Hero Section */}
        <section className="home__hero">
          <div className="home__badge">
            <span className="badge-pulse"></span>
            <span className="badge-text">Next-Gen Microfinance</span>
          </div>
          
          <h1 className="home__title">
            Empowering Communities
            <span className="title-gradient"> Through Smart Lending</span>
          </h1>
          
          <p className="home__subtitle">
            Transform your microfinance operations with our cutting-edge platform. 
            Manage loans, track members, and generate insights in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              <span>Get Started</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/register" className="btn-secondary">
              <span>Create Account</span>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <div className="feature-content">
                <h3>Bank-Grade Security</h3>
                <p>Your data is protected with enterprise-level encryption and security protocols.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h3>Lightning Fast</h3>
                <p>Process loan applications and approvals in minutes, not days.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-content">
                <h3>Real-time Analytics</h3>
                <p>Get instant insights and reports to make data-driven decisions.</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Clients</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">₦2.5B+</div>
              <div className="stat-label">Loans Disbursed</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </section>

        {/* Right Panel - Interactive Section */}
        <section className="home__panel">
          <div className="panel-glow"></div>
          
          <div className="panel-header">
            <div className="panel-icon">✨</div>
            <h2>Ready to transform your lending?</h2>
            <p>Join thousands of satisfied users managing their microfinance operations efficiently</p>
          </div>

          {/* Server Status */}
          <div className="server-status">
            <div className="status-indicator">
              <div className={`status-dot ${status}`}></div>
              <span className="status-text">
                {status === "loading" && "Connecting to server..."}
                {status === "success" && "Connected to server"}
                {status === "error" && "Server connection issue"}
              </span>
            </div>
            {status === "success" && message && (
              <div className="status-message">{message}</div>
            )}
          </div>

          {/* Benefits List */}
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <div className="benefit-content">
                <h4>Automated Workflows</h4>
                <p>Streamline loan approval processes with multi-stage verification</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">👥</div>
              <div className="benefit-content">
                <h4>Role-Based Access</h4>
                <p>Loan officers, managers, and directors each have dedicated interfaces</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <div className="benefit-content">
                <h4>Mobile Responsive</h4>
                <p>Access your dashboard from any device, anywhere</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔄</div>
              <div className="benefit-content">
                <h4>Real-time Updates</h4>
                <p>Instant notifications on loan status changes</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <span>🏦 Trusted by Banks</span>
            <span>🏛️ SACCOS</span>
            <span>🏢 Microfinance Institutions</span>
            <span>👥 Community Groups</span>
          </div>
        </section>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home {
          min-height: 100vh;
          color: #e5e7eb;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Animated Gradient Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 25%, #2d2b55 50%, #1a1a4a 75%, #0a0a2a 100%);
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
          z-index: -3;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Grid Overlay */
        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: -2;
          pointer-events: none;
        }

        /* Particles */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: linear-gradient(135deg, rgba(96,165,250,0.3), rgba(168,85,247,0.3));
          border-radius: 50%;
          animation: floatParticle 15s ease-in-out infinite;
        }

        .particle:nth-child(1) { width: 100px; height: 100px; top: 10%; left: 5%; animation-duration: 20s; }
        .particle:nth-child(2) { width: 150px; height: 150px; top: 60%; left: 85%; animation-duration: 25s; }
        .particle:nth-child(3) { width: 70px; height: 70px; top: 75%; left: 15%; animation-duration: 18s; }
        .particle:nth-child(4) { width: 120px; height: 120px; top: 20%; left: 80%; animation-duration: 22s; }
        .particle:nth-child(5) { width: 60px; height: 60px; top: 40%; left: 45%; animation-duration: 28s; }
        .particle:nth-child(6) { width: 90px; height: 90px; top: 85%; left: 50%; animation-duration: 30s; }
        .particle:nth-child(7) { width: 80px; height: 80px; top: 30%; left: 25%; animation-duration: 35s; }
        .particle:nth-child(8) { width: 50px; height: 50px; top: 50%; left: 65%; animation-duration: 15s; }
        .particle:nth-child(9) { width: 130px; height: 130px; top: 15%; left: 55%; animation-duration: 40s; }
        .particle:nth-child(10) { width: 40px; height: 40px; top: 70%; left: 35%; animation-duration: 12s; }
        .particle:nth-child(11) { width: 110px; height: 110px; top: 45%; left: 10%; animation-duration: 32s; }
        .particle:nth-child(12) { width: 85px; height: 85px; top: 5%; left: 70%; animation-duration: 26s; }
        .particle:nth-child(13) { width: 65px; height: 65px; top: 55%; left: 90%; animation-duration: 38s; }
        .particle:nth-child(14) { width: 95px; height: 95px; top: 80%; left: 20%; animation-duration: 24s; }
        .particle:nth-child(15) { width: 45px; height: 45px; top: 25%; left: 40%; animation-duration: 16s; }
        .particle:nth-child(16) { width: 75px; height: 75px; top: 90%; left: 75%; animation-duration: 34s; }
        .particle:nth-child(17) { width: 55px; height: 55px; top: 35%; left: 95%; animation-duration: 29s; }
        .particle:nth-child(18) { width: 105px; height: 105px; top: 10%; left: 35%; animation-duration: 23s; }
        .particle:nth-child(19) { width: 35px; height: 35px; top: 65%; left: 5%; animation-duration: 27s; }
        .particle:nth-child(20) { width: 115px; height: 115px; top: 5%; left: 95%; animation-duration: 31s; }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-40px) translateX(25px) rotate(5deg); opacity: 0.7; }
          50% { transform: translateY(30px) translateX(-20px) rotate(-5deg); opacity: 0.5; }
          75% { transform: translateY(-15px) translateX(15px) rotate(3deg); opacity: 0.6; }
        }

        /* Glow Orbs */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.35;
          z-index: -2;
          animation: orbPulse 10s ease-in-out infinite;
        }

        .glow-orb-1 {
          width: 500px;
          height: 500px;
          background: #6366f1;
          top: -150px;
          left: -200px;
        }

        .glow-orb-2 {
          width: 600px;
          height: 600px;
          background: #8b5cf6;
          bottom: -200px;
          right: -150px;
          animation-delay: -4s;
        }

        .glow-orb-3 {
          width: 350px;
          height: 350px;
          background: #06b6d4;
          top: 40%;
          left: 35%;
          animation-delay: -7s;
        }

        .glow-orb-4 {
          width: 450px;
          height: 450px;
          background: #10b981;
          bottom: 30%;
          left: 10%;
          animation-delay: -2s;
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.15); opacity: 0.4; }
        }

        /* Main Container */
        .home__wrap {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 60px 48px;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Hero Section */
        .home__hero {
          padding: 20px 0;
        }

        .home__badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          margin-bottom: 32px;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: badgePulse 1.5s ease infinite;
        }

        @keyframes badgePulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.7); }
          50% { opacity: 0.5; transform: scale(1.2); box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }

        .badge-text {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #e5e7eb, #9ca3af);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .home__title {
          font-size: clamp(42px, 5.5vw, 68px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          font-weight: 800;
        }

        .home__title .title-gradient {
          background: linear-gradient(135deg, #60a5fa, #34d399, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }

        .home__subtitle {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(229,231,235,0.75);
          max-width: 540px;
          margin-bottom: 36px;
        }

        /* Hero Buttons */
        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139,92,246,0.4);
        }

        .btn-primary:hover svg {
          transform: translateX(4px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 32px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }

        .feature-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.2);
          transform: translateX(8px);
        }

        .feature-icon {
          font-size: 40px;
        }

        .feature-content h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
          color: white;
        }

        .feature-content p {
          font-size: 13px;
          color: rgba(229,231,235,0.65);
          line-height: 1.5;
        }

        /* Stats Section */
        .stats-section {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
        }

        .stat-item {
          flex: 1;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #60a5fa, #34d399);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(229,231,235,0.6);
          margin-top: 6px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.15);
        }

        /* Right Panel */
        .home__panel {
          position: relative;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 32px;
          padding: 40px;
          transition: all 0.3s ease;
        }

        .home__panel:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 25px 45px rgba(0,0,0,0.3);
        }

        .panel-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139,92,246,0.1), transparent);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .home__panel:hover .panel-glow {
          opacity: 1;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .panel-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .panel-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #fff, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .panel-header p {
          font-size: 14px;
          color: rgba(229,231,235,0.7);
          line-height: 1.5;
        }

        /* Server Status */
        .server-status {
          background: rgba(0,0,0,0.3);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 28px;
          text-align: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: statusPulse 1.5s ease infinite;
        }

        .status-dot.loading {
          background: #f59e0b;
          box-shadow: 0 0 0 0 rgba(245,158,11,0.7);
        }

        .status-dot.success {
          background: #10b981;
          box-shadow: 0 0 0 0 rgba(16,185,129,0.7);
        }

        .status-dot.error {
          background: #ef4444;
          box-shadow: 0 0 0 0 rgba(239,68,68,0.7);
        }

        @keyframes statusPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }

        .status-text {
          font-size: 13px;
          color: rgba(229,231,235,0.8);
        }

        .status-message {
          font-size: 12px;
          color: #10b981;
          margin-top: 8px;
        }

        /* Benefits List */
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .benefit-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          background: rgba(255,255,255,0.05);
          transform: translateX(5px);
        }

        .benefit-icon {
          font-size: 28px;
        }

        .benefit-content h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
          color: white;
        }

        .benefit-content p {
          font-size: 12px;
          color: rgba(229,231,235,0.6);
        }

        /* Trust Badges */
        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .trust-badges span {
          font-size: 12px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border-radius: 50px;
          color: rgba(229,231,235,0.7);
          transition: all 0.3s ease;
        }

        .trust-badges span:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .home__wrap {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 32px;
          }
        }

        @media (max-width: 768px) {
          .home__wrap {
            padding: 30px 24px;
          }
          .stats-section {
            flex-direction: column;
            align-items: flex-start;
          }
          .stat-divider {
            width: 100%;
            height: 1px;
          }
          .home__panel {
            padding: 28px;
          }
          .hero-buttons {
            flex-direction: column;
          }
          .btn-primary, .btn-secondary {
            justify-content: center;
          }
          .home__title {
            font-size: 36px;
          }
        }

        @media (max-width: 480px) {
          .home__wrap {
            padding: 20px 16px;
          }
          .stats-section {
            gap: 15px;
          }
          .features-grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
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
function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            token ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Home />
            )
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* OTHER PAGES */}
        <Route
          path="/users"
          element={
            <MainLayout>
              <Users />
            </MainLayout>
          }
        />

        <Route path="/personal-loan" element={<PersonalLoan />} />

        <Route path="/group-loan" element={<GroupLoan />} />

        <Route
          path="/employee-loan"
          element={
            <MainLayout>
              <EmployeeLoan />
            </MainLayout>
          }
        />

        <Route
          path="/loan-manager"
          element={
            <MainLayout>
              <LoanManager />
            </MainLayout>
          }
        />

        <Route
          path="/general-manager"
          element={
            <MainLayout>
              <GeneralManager />
            </MainLayout>
          }
        />

        <Route
          path="/managing-director"
          element={
            <MainLayout>
              <ManagingDirector />
            </MainLayout>
          }
        />

        <Route path="/repayment-tracker" element={<MainLayout><RepaymentTracker /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;