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

// =========================
// AXIOS INTERCEPTORS (Add token to all requests)
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
   HOME PAGE (MODERN UI)
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
      <div className="home__bg" aria-hidden="true" />

      <main className="home__wrap">
        <section className="home__hero">
          <div className="home__badge">Microfinance Platform</div>
          <h1 className="home__title">Microfinance System</h1>
          <p className="home__subtitle">
            Simamia mikopo, wanachama, na ufuatiliaji wa malipo kwa muonekano wa
            kisasa na uzoefu rahisi.
          </p>

          <div className="home__features" role="list">
            <div className="home__feature" role="listitem">
              <div className="home__dot" aria-hidden="true" />
              <div>
                <div className="home__featureTitle">Usalama</div>
                <div className="home__featureText">
                  Mfumo salama wa uingiaji na udhibiti wa taarifa.
                </div>
              </div>
            </div>
            <div className="home__feature" role="listitem">
              <div className="home__dot" aria-hidden="true" />
              <div>
                <div className="home__featureTitle">Ufanisi</div>
                <div className="home__featureText">
                  Utoaji wa mikopo na ufuatiliaji unaoeleweka.
                </div>
              </div>
            </div>
            <div className="home__feature" role="listitem">
              <div className="home__dot" aria-hidden="true" />
              <div>
                <div className="home__featureTitle">Ripoti</div>
                <div className="home__featureText">
                  Angalia taarifa za maendeleo kwa urahisi.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home__panel" aria-label="Get started">
          <div className="home__panelHeader">
            <div>
              <div className="home__panelTitle">Karibu</div>
              <div className="home__panelHint">
                Ingia akaunti yako au tengeneza mpya.
              </div>
            </div>
          </div>

          <div className="home__status" aria-live="polite">
            {status === "loading" && (
              <div className="home__pill home__pill--info">Inaunganisha na server...</div>
            )}
            {status === "error" && (
              <div className="home__pill home__pill--warn">
                Server haijapatikana. Endelea kuingia au jaribu tena baadaye.
              </div>
            )}
            {status === "success" && message && (
              <div className="home__pill home__pill--ok">{message}</div>
            )}
          </div>

          <div className="home__actions">
            <Link to="/login" className="home__btn home__btn--primary">Login</Link>
            <Link to="/register" className="home__btn home__btn--secondary">Register</Link>
          </div>

          <div className="home__fineprint">
            Kwa kuendelea, unakubali masharti ya matumizi ya mfumo.
          </div>
        </section>
      </main>

      <style>{`
        .home {
          min-height: 100vh;
          color: #e5e7eb;
          position: relative;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          background: radial-gradient(1200px 700px at 10% 10%, #1d4ed8 0%, rgba(29, 78, 216, 0) 55%),
            radial-gradient(900px 600px at 80% 20%, #10b981 0%, rgba(16, 185, 129, 0) 55%),
            radial-gradient(1000px 700px at 60% 110%, #7c3aed 0%, rgba(124, 58, 237, 0) 55%),
            linear-gradient(180deg, #0b1220 0%, #050816 100%);
        }

        .home__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, rgba(255,255,255,0) 0);
          background-size: 22px 22px;
          mask-image: radial-gradient(closest-side, rgba(0,0,0,1), rgba(0,0,0,0));
          -webkit-mask-image: radial-gradient(closest-side, rgba(0,0,0,1), rgba(0,0,0,0));
          transform: translateY(-8%) scale(1.05);
        }

        .home__wrap {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          align-items: center;
          padding: 48px 20px;
          max-width: 1080px;
          margin: 0 auto;
        }

        .home__hero {
          padding: 10px 0;
        }

        .home__badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(229,231,235,0.92);
        }

        .home__title {
          margin: 14px 0 10px;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.06;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-shadow: 0 12px 40px rgba(0,0,0,0.55);
        }

        .home__subtitle {
          margin: 0 0 18px;
          max-width: 56ch;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(229,231,235,0.86);
        }

        .home__features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 18px;
          max-width: 560px;
        }

        .home__feature {
          display: flex;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 50px rgba(0,0,0,0.25);
        }

        .home__dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          margin-top: 6px;
          background: linear-gradient(180deg, #60a5fa, #34d399);
          box-shadow: 0 0 0 4px rgba(96,165,250,0.18);
          flex: none;
        }

        .home__featureTitle {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin-bottom: 2px;
        }

        .home__featureText {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(229,231,235,0.8);
        }

        .home__panel {
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          box-shadow: 0 28px 80px rgba(0,0,0,0.45);
          padding: 22px;
        }

        .home__panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }

        .home__panelTitle {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .home__panelHint {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(229,231,235,0.8);
          line-height: 1.5;
        }

        .home__status {
          min-height: 44px;
          display: flex;
          align-items: center;
          margin: 14px 0 14px;
        }

        .home__pill {
          width: 100%;
          padding: 10px 12px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.35;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.35);
        }
        .home__pill--info { color: rgba(226,232,240,0.92); }
        .home__pill--ok {
          color: rgba(167,243,208,0.95);
          border-color: rgba(16,185,129,0.25);
          background: rgba(16,185,129,0.08);
        }
        .home__pill--warn {
          color: rgba(254,243,199,0.95);
          border-color: rgba(245,158,11,0.25);
          background: rgba(245,158,11,0.08);
        }

        .home__actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        .home__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.01em;
          transition: transform 160ms ease, box-shadow 160ms ease,
            filter 160ms ease, background 160ms ease;
          user-select: none;
        }

        .home__btn:active { transform: translateY(1px) scale(0.99); }
        .home__btn--primary {
          color: #0b1220;
          background: linear-gradient(90deg, #60a5fa, #34d399);
          box-shadow: 0 14px 40px rgba(52,211,153,0.18);
        }
        .home__btn--secondary {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .home__btn:hover { transform: translateY(-2px); filter: brightness(1.02); }
        .home__fineprint {
          margin-top: 14px;
          font-size: 12px;
          line-height: 1.45;
          color: rgba(229,231,235,0.68);
        }

        @media (max-width: 900px) {
          .home__wrap { grid-template-columns: 1fr; padding: 34px 16px; }
          .home__panel { padding: 18px; }
        }
      `}</style>
    </div>
  );
}

/* =========================
   MAIN LAYOUT (with Sidebar, Navbar fixed, Footer fixed)
========================= */
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
         marginLeft: "230px",
        display: "flex", 
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9"
      }}>
        <Navbar />
        <div style={{ 
          flex: 1, 
          padding: "80px 24px 24px 24px",
          overflowY: "auto"
        }}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

/* =========================
   APP ROUTES
========================= */
/* =========================
   APP ROUTES
========================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard - With MainLayout */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />

        {/* Users - With MainLayout */}
        <Route path="/users" element={<MainLayout><Users /></MainLayout>} />

        {/* Approval Levels - With MainLayout */}
        <Route path="/loan-manager" element={<MainLayout><LoanManager /></MainLayout>} />
        <Route path="/general-manager" element={<MainLayout><GeneralManager /></MainLayout>} />
        <Route path="/managing-director" element={<MainLayout><ManagingDirector /></MainLayout>} />

        {/* ========== LOAN FORMS - NO LAYOUT (Full page only form) ========== */}
        <Route path="/personal-loan" element={<PersonalLoan />} />
        <Route path="/group-loan" element={<GroupLoan />} />
        <Route path="/employee-loan" element={<EmployeeLoan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;