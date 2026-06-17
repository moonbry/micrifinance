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
          height: 70px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #0f172a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
          z-index: 99;
          transition: all 0.3s ease;
        }

        .left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .title {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .logout {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          padding: 10px 20px;
          color: white;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
        
        .logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        .navbar-portal {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-right: 30px;
        }
      `}</style>
    </div>
  );
};

export default Navbar;