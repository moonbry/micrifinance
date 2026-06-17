import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showLoans, setShowLoans] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showLoanManager, setShowLoanManager] = useState(false);
  const [showGeneralManager, setShowGeneralManager] = useState(false);
  const [showManagingManager, setShowManagingManager] = useState(false);
  const [showRepayment, setShowRepayment] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleUsersClick = async () => {
    setShowUsers(!showUsers);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users/count", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setUserCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("http://127.0.0.1:8000/api/v1/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userRole = user?.role;

  const canAccessLoansForm = userRole === "admin" || userRole === "loan_officer";
  const canAccessLoanManager = userRole === "admin" || userRole === "loan_manager";
  const canAccessGeneralManager = userRole === "admin" || userRole === "general_manager";
  const canAccessManagingDirector = userRole === "admin" || userRole === "managing_director";
  const canAccessUsers = userRole === "admin";
  const canAccessRepayment = userRole === "admin" || userRole === "loan_manager" || userRole === "general_manager" || userRole === "loan_officer" || userRole === "managing_director";

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-area">
        <div className="logo-placeholder"></div>
        {!isCollapsed && (
          <div className="logo-text">
            <div className="logo-title">Microfinance</div>
            <div className="logo-sub">Management System</div>
          </div>
        )}
        <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "❯" : "❮"}
        </button>
      </div>

      {user && !isCollapsed && (
        <div className="user-profile">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role?.replace("_", " ").toUpperCase()}</div>
        </div>
      )}

      <div className="nav-menu">
        {canAccessUsers && (
          <div className="nav-item">
            <div className="nav-header" onClick={handleUsersClick} title="Users">
              <div className="nav-header-left">
                <span className="nav-icon">👥</span>
                {!isCollapsed && <span>Users</span>}
              </div>
              {!isCollapsed && (
                <>
                  {userCount !== null && <span className="nav-badge">{userCount}</span>}
                  <span className={`nav-arrow ${showUsers ? "open" : ""}`}>▼</span>
                </>
              )}
            </div>
            {showUsers && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/users")}>View Users</div>
              </div>
            )}
          </div>
        )}

        {canAccessLoansForm && (
          <div className="nav-item">
            <div className="nav-header" onClick={() => setShowLoans(!showLoans)} title="Loans Form">
              <div className="nav-header-left">
                <span className="nav-icon">📝</span>
                {!isCollapsed && <span>Loans Form</span>}
              </div>
              {!isCollapsed && <span className={`nav-arrow ${showLoans ? "open" : ""}`}>▼</span>}
            </div>
            {showLoans && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/personal-loan")}>Personal Loan</div>
                <div className="nav-link" onClick={() => navigate("/group-loan")}>Group Loan</div>
              </div>
            )}
          </div>
        )}

        {canAccessLoanManager && (
          <div className="nav-item">
            <div className="nav-header" onClick={() => setShowLoanManager(!showLoanManager)} title="Loan Manager">
              <div className="nav-header-left">
                <span className="nav-icon">📊</span>
                {!isCollapsed && <span>Loan Manager</span>}
              </div>
              {!isCollapsed && <span className={`nav-arrow ${showLoanManager ? "open" : ""}`}>▼</span>}
            </div>
            {showLoanManager && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/loan-manager")}>Dashboard</div>
              </div>
            )}
          </div>
        )}

        {canAccessGeneralManager && (
          <div className="nav-item">
            <div className="nav-header" onClick={() => setShowGeneralManager(!showGeneralManager)} title="General Manager">
              <div className="nav-header-left">
                <span className="nav-icon">👔</span>
                {!isCollapsed && <span>General Manager</span>}
              </div>
              {!isCollapsed && <span className={`nav-arrow ${showGeneralManager ? "open" : ""}`}>▼</span>}
            </div>
            {showGeneralManager && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/general-manager")}>Dashboard</div>
              </div>
            )}
          </div>
        )}

        {canAccessManagingDirector && (
          <div className="nav-item">
            <div className="nav-header" onClick={() => setShowManagingManager(!showManagingManager)} title="Managing Director">
              <div className="nav-header-left">
                <span className="nav-icon">💎</span>
                {!isCollapsed && <span>Managing Director</span>}
              </div>
              {!isCollapsed && <span className={`nav-arrow ${showManagingManager ? "open" : ""}`}>▼</span>}
            </div>
            {showManagingManager && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/managing-director")}>Dashboard</div>
              </div>
            )}
          </div>
        )}

        {canAccessRepayment && (
          <div className="nav-item">
            <div className="nav-header" onClick={() => setShowRepayment(!showRepayment)} title="Repayment Tracker">
              <div className="nav-header-left">
                <span className="nav-icon">💰</span>
                {!isCollapsed && <span>Repayment Tracker</span>}
              </div>
              {!isCollapsed && <span className={`nav-arrow ${showRepayment ? "open" : ""}`}>▼</span>}
            </div>
            {showRepayment && !isCollapsed && (
              <div className="nav-submenu">
                <div className="nav-link" onClick={() => navigate("/repayment-tracker")}>View</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="nav-footer">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          {isCollapsed ? "🚪" : "Logout"}
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #090e17 0%, #020617 100%);
          color: #e2e8f0;
          position: fixed;
          top: 0;
          left: 0;
          overflow-x: visible;
          overflow-y: auto;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed { width: 80px; }

        .logo-area {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
        }

        .sidebar.collapsed .logo-area { justify-content: center; padding: 24px 0; }

        .collapse-toggle {
          position: absolute;
          right: -14px;
          top: 30px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: 2px solid #0f172a;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          z-index: 101;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .collapse-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
        }

        .sidebar.collapsed .collapse-toggle { right: 26px; border: 2px solid #020617; }

        .logo-placeholder {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .logo-placeholder::after {
          content: 'M';
          font-size: 20px;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .logo-title {
          font-weight: 800;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .logo-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .user-profile {
          padding: 16px;
          margin: 0 16px 24px 16px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 0 20px rgba(255,255,255,0.01);
          transition: transform 0.2s;
        }
        
        .user-profile:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-name {
          font-weight: 700;
          font-size: 14px;
          color: #f8fafc;
          margin-bottom: 6px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .user-role {
          font-size: 11px;
          color: #38bdf8;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .nav-menu { padding: 0 12px; }
        .collapsed .nav-menu { padding: 0 10px; }

        .nav-item { margin-bottom: 8px; }

        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: transparent;
          border-radius: 12px;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #cbd5e1;
          transition: all 0.2s ease;
        }

        .collapsed .nav-header { justify-content: center; padding: 14px; }

        .nav-header-left { display: flex; align-items: center; gap: 14px; }

        .nav-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
          transition: transform 0.2s, filter 0.2s;
        }

        .nav-header:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }
        
        .nav-header:hover .nav-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
        }

        .nav-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2px 8px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .nav-arrow {
          font-size: 10px;
          color: #64748b;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-arrow.open { transform: rotate(180deg); color: #3b82f6; }

        .nav-submenu {
          margin-top: 4px;
          margin-left: 20px;
          padding-left: 12px;
          border-left: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding-left: 18px;
        }

        .nav-footer {
          position: sticky;
          bottom: 0;
          margin-top: 20px;
          padding: 20px 16px;
          background: linear-gradient(180deg, transparent 0%, rgba(2,6,23,0.95) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          letter-spacing: 0.5px;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};

export default Sidebar;