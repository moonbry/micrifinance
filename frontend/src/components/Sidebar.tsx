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
          background: #0a0f1a;
          color: #e2e8f0;
          position: fixed;
          top: 0;
          left: 0;
          overflow-x: visible;
          overflow-y: auto;
          border-right: 1px solid #1e293b;
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: width 0.3s ease;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .logo-area {
          padding: 20px 18px;
          border-bottom: 1px solid #1e293b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: visible;
        }

        .sidebar.collapsed .logo-area {
          justify-content: center;
          padding: 20px 0;
        }

        .collapse-toggle {
          position: absolute;
          right: -12px;
          top: 25px;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border: none;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          z-index: 101;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .sidebar.collapsed .collapse-toggle {
          right: 28px;
        }

        .logo-placeholder {
          width: 36px;
          height: 36px;
          background: #1e293b;
          border-radius: 10px;
          border: 1px solid #334155;
          flex-shrink: 0;
        }

        .logo-title {
          font-weight: 700;
          font-size: 16px;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .logo-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .user-profile {
          padding: 12px 16px;
          margin: 0 12px 16px 12px;
          background: #111827;
          border-radius: 12px;
          border: 1px solid #1e293b;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: #f1f5f9;
          margin-bottom: 4px;
        }

        .user-role {
          font-size: 11px;
          color: #22d3ee;
          letter-spacing: 0.3px;
        }

        .nav-menu {
          padding: 0 12px;
        }

        .collapsed .nav-menu {
          padding: 0 10px;
        }

        .nav-item {
          margin-bottom: 6px;
        }

        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: #111827;
          border-radius: 10px;
          border: 1px solid #1e293b;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #e2e8f0;
          transition: background 0.2s;
        }

        .collapsed .nav-header {
          justify-content: center;
          padding: 12px;
        }

        .nav-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .nav-header:hover {
          background: #1a2332;
        }

        .nav-badge {
          background: #1e293b;
          padding: 2px 8px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
        }

        .nav-arrow {
          font-size: 10px;
          color: #64748b;
          transition: transform 0.2s;
        }

        .nav-arrow.open {
          transform: rotate(180deg);
        }

        .nav-submenu {
          margin-top: 4px;
          margin-left: 12px;
          padding-left: 8px;
          border-left: 2px solid #1e293b;
        }

        .nav-link {
          padding: 8px 12px;
          margin: 2px 0;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 400;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: #111827;
          color: #f1f5f9;
        }

        .nav-footer {
          position: sticky;
          bottom: 0;
          margin-top: 20px;
          padding: 16px 12px;
          background: #0a0f1a;
          border-top: 1px solid #1e293b;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 10px;
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logout-btn:hover {
          background: #2d3a4e;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: #0f172a;
        }

        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;