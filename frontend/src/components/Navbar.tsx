import type { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/personal-loan": "FOMU YA MAOMBI YA MKOPO BINAFSI",
  "/group-loan": "FOMU YA MAOMBI YA MKOPO WA KIKUNDI",
  "/employee-loan": "FOMU YA MAOMBI YA MKOPO WA MFANYAKAZI",
  "/loan-manager": "Loan Manager",
  "/general-manager": "General Manager",
  "/managing-director": "Managing Director",
  "/repayment-tracker": "Repayment Tracker",
  "/users": "Users",
};

const Navbar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subtitle = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="nb">
      <div className="nb__left">
        <div className="nb__title">Microfinance System</div>
        <div className="nb__subtitle">{subtitle}</div>
      </div>

      <div id="navbar-portal" className="nb__portal"></div>

      <button className="nb__logout" onClick={handleLogout}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        Logout
      </button>

      <style>{`
        .nb {
          position: sticky;
          top: 0; left: 0; right: 0;
          height: 60px;
          background: #102a43;
          color: #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          z-index: 99;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .nb__left { display: flex; flex-direction: column; gap: 2px; }
        .nb__title { font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: 0.2px; }
        .nb__subtitle { font-size: 11px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .nb__portal { flex: 1; display: flex; justify-content: flex-end; align-items: center; margin-right: 20px; }
        .nb__logout {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255, 0.08);
          border: 1px solid rgba(255,255,255, 0.12);
          padding: 7px 16px;
          color: #e2e8f0; border-radius: 8px;
          cursor: pointer; font-weight: 600; font-size: 13px;
          font-family: inherit;
          transition: all 0.15s;
        }
        .nb__logout:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
};

export default Navbar;