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

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showLoans, setShowLoans] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showLoanManager, setShowLoanManager] = useState(false);
  const [showGeneralManager, setShowGeneralManager] = useState(false);
  const [showManagingManager, setShowManagingManager] = useState(false);
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

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="brand">
          <div className="brand-title">Microfinance</div>
          <div className="brand-sub">Management</div>
        </div>
      </div>

      {user && (
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role?.replace("_", " ").toUpperCase()}</div>
        </div>
      )}

      <ul>
        {canAccessUsers && (
          <>
            <li onClick={handleUsersClick}>
              <span>👥 Users</span>
              {userCount !== null && <span className="pill">{userCount}</span>}
            </li>
            {showUsers && (
              <ul className="dropdown">
                <li className="sub" onClick={() => navigate("/users")}>View Users</li>
              </ul>
            )}
          </>
        )}

        {canAccessLoansForm && (
          <>
            <li onClick={() => setShowLoans(!showLoans)}>
              <span>📝 Loans form</span>
              <span className={`chev ${showLoans ? "open" : ""}`}>▾</span>
            </li>
            {showLoans && (
              <ul className="dropdown">
                <li className="sub" onClick={() => navigate("/personal-loan")}>👤 Personal form</li>
                <li className="sub" onClick={() => navigate("/group-loan")}>👥 Group form</li>
              </ul>
            )}
          </>
        )}

        {canAccessLoanManager && (
          <>
            <li onClick={() => setShowLoanManager(!showLoanManager)}>
              <span>📊 Loan Manager</span>
              <span className={`chev ${showLoanManager ? "open" : ""}`}>▾</span>
            </li>
            {showLoanManager && (
              <ul className="dropdown">
                <li className="sub" onClick={() => navigate("/loan-manager")}>View</li>
              </ul>
            )}
          </>
        )}

        {canAccessGeneralManager && (
          <>
            <li onClick={() => setShowGeneralManager(!showGeneralManager)}>
              <span>👔 General Manager</span>
              <span className={`chev ${showGeneralManager ? "open" : ""}`}>▾</span>
            </li>
            {showGeneralManager && (
              <ul className="dropdown">
                <li className="sub" onClick={() => navigate("/general-manager")}>View</li>
              </ul>
            )}
          </>
        )}

        {canAccessManagingDirector && (
          <>
            <li onClick={() => setShowManagingManager(!showManagingManager)}>
              <span>👑 Managing Director</span>
              <span className={`chev ${showManagingManager ? "open" : ""}`}>▾</span>
            </li>
            {showManagingManager && (
              <ul className="dropdown">
                <li className="sub" onClick={() => navigate("/managing-director")}>View</li>
              </ul>
            )}
          </>
        )}
      </ul>

      <div className="bottom">
        <button className="bottom-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <style>{`
        .sidebar { 
          width: 260px; 
          height: 100vh; 
          background: radial-gradient(900px 600px at 40% 0%, rgba(29,78,216,0.22), rgba(29,78,216,0) 55%), linear-gradient(180deg, #0b1220 0%, #050816 100%); 
          color: rgba(255,255,255,0.92); 
          position: fixed; 
          top: 0; 
          left: 0; 
          overflow-y: auto; 
          border-right: 1px solid rgba(255,255,255,0.08);
          z-index: 100;
        }
        .logo-container { padding: 18px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
        .logo { width: 40px; height: 40px; object-fit: contain; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 6px; }
        .brand-title { font-weight: 900; color: rgba(255,255,255,0.96); }
        .brand-sub { font-size: 12px; margin-top: 2px; color: rgba(229,231,235,0.72); }
        .user-info { padding: 12px 16px; margin: 10px; background: rgba(255,255,255,0.05); border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); }
        .user-name { font-weight: bold; font-size: 14px; }
        .user-role { font-size: 11px; color: #22d3ee; margin-top: 4px; }
        ul { list-style: none; padding: 0 10px 12px; }
        li { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; cursor: pointer; }
        .dropdown { margin-left: 12px; margin-bottom: 10px; }
        .sub { background: rgba(2,6,23,0.3); border-color: rgba(255,255,255,0.1); font-size: 13px; font-weight: 700; }
        .pill { font-size: 12px; font-weight: 900; padding: 4px 9px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(2,6,23,0.35); }
        .chev { opacity: 0.85; transition: none; }
        .chev.open { transform: rotate(180deg); }
        .bottom { position: sticky; bottom: 0; padding: 12px 10px 14px; background: linear-gradient(180deg, rgba(5,8,22,0), rgba(5,8,22,0.95) 45%, rgba(5,8,22,1)); border-top: 1px solid rgba(255,255,255,0.08); }
        .bottom-btn { width: 100%; height: 42px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); cursor: pointer; font-weight: 900; }
      `}</style>
    </div>
  );
};

export default Sidebar;