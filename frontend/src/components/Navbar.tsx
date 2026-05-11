import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const Navbar: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="left">
        <div className="title">Microfinance System</div>
        <div className="subtitle">Dashboard</div>
      </div>

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 260px;
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
      `}</style>
    </div>
  );
};

export default Navbar;