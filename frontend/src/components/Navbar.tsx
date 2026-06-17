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
    <div className="navbar">
      <div className="left">
        <div className="title">Microfinance System</div>
        <div className="subtitle">{subtitle}</div>
      </div>

      <div id="navbar-portal" className="navbar-portal"></div>

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: white;
          color: #0f172a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          z-index: 99;
        }

        .left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .subtitle {
          font-size: 12px;
          color: #64748b;
        }

        .logout {
          background: #ef4444;
          border: none;
          padding: 8px 16px;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .navbar-portal {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Navbar;