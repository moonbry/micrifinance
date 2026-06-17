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

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className={`sb ${isCollapsed ? "sb--collapsed" : ""}`}>

      {/* ── Top bar: collapse toggle + brand ── */}
      <div className="sb__top">
        <button className="sb__toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "»" : "«"}
        </button>
        {!isCollapsed && <span className="sb__brand">Microfinance</span>}
      </div>

      {/* ── User profile ── */}
      <div className="sb__profile">
        <div className="sb__avatar">{userInitial}</div>
        {!isCollapsed && user && (
          <div className="sb__user-info">
            <div className="sb__user-name">{user.name}</div>
            <div className="sb__user-role">{user.role?.replace("_", " ").toUpperCase()}</div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="sb__nav">

        {/* Section: Loan Operations */}
        {canAccessLoansForm && (
          <>
            <div className="sb__section-label">{!isCollapsed ? "Loan Operations" : ""}</div>

            <div className="sb__item" onClick={() => setShowLoans(!showLoans)} title="Loans Form">
              <span className="sb__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </span>
              {!isCollapsed && <span className="sb__label">Loans Form</span>}
              {!isCollapsed && <span className={`sb__chevron ${showLoans ? "sb__chevron--open" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </span>}
            </div>
            {showLoans && !isCollapsed && (
              <div className="sb__submenu">
                <div className="sb__sublink" onClick={() => navigate("/personal-loan")}>Personal Loan</div>
                <div className="sb__sublink" onClick={() => navigate("/group-loan")}>Group Loan</div>
              </div>
            )}
          </>
        )}

        {/* Section: Management */}
        {(canAccessLoanManager || canAccessGeneralManager || canAccessManagingDirector) && (
          <>
            <div className="sb__section-label">{!isCollapsed ? "Management" : ""}</div>

            {canAccessLoanManager && (
              <>
                <div className="sb__item" onClick={() => setShowLoanManager(!showLoanManager)} title="Loan Manager">
                  <span className="sb__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  </span>
                  {!isCollapsed && <span className="sb__label">Loan Manager</span>}
                  {!isCollapsed && <span className={`sb__chevron ${showLoanManager ? "sb__chevron--open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>}
                </div>
                {showLoanManager && !isCollapsed && (
                  <div className="sb__submenu">
                    <div className="sb__sublink" onClick={() => navigate("/loan-manager")}>Dashboard</div>
                  </div>
                )}
              </>
            )}

            {canAccessGeneralManager && (
              <>
                <div className="sb__item" onClick={() => setShowGeneralManager(!showGeneralManager)} title="General Manager">
                  <span className="sb__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  {!isCollapsed && <span className="sb__label">General Manager</span>}
                  {!isCollapsed && <span className={`sb__chevron ${showGeneralManager ? "sb__chevron--open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>}
                </div>
                {showGeneralManager && !isCollapsed && (
                  <div className="sb__submenu">
                    <div className="sb__sublink" onClick={() => navigate("/general-manager")}>Dashboard</div>
                  </div>
                )}
              </>
            )}

            {canAccessManagingDirector && (
              <>
                <div className="sb__item" onClick={() => setShowManagingManager(!showManagingManager)} title="Managing Director">
                  <span className="sb__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </span>
                  {!isCollapsed && <span className="sb__label">Managing Director</span>}
                  {!isCollapsed && <span className={`sb__chevron ${showManagingManager ? "sb__chevron--open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>}
                </div>
                {showManagingManager && !isCollapsed && (
                  <div className="sb__submenu">
                    <div className="sb__sublink" onClick={() => navigate("/managing-director")}>Dashboard</div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Section: Internal */}
        {(canAccessUsers || canAccessRepayment) && (
          <>
            <div className="sb__section-label">{!isCollapsed ? "Internal" : ""}</div>

            {canAccessUsers && (
              <>
                <div className="sb__item" onClick={handleUsersClick} title="Users">
                  <span className="sb__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                  </span>
                  {!isCollapsed && <span className="sb__label">Users</span>}
                  {!isCollapsed && userCount !== null && <span className="sb__badge">{userCount}</span>}
                  {!isCollapsed && <span className={`sb__chevron ${showUsers ? "sb__chevron--open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>}
                </div>
                {showUsers && !isCollapsed && (
                  <div className="sb__submenu">
                    <div className="sb__sublink" onClick={() => navigate("/users")}>View Users</div>
                  </div>
                )}
              </>
            )}

            {canAccessRepayment && (
              <>
                <div className="sb__item" onClick={() => setShowRepayment(!showRepayment)} title="Repayment Tracker">
                  <span className="sb__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                  </span>
                  {!isCollapsed && <span className="sb__label">Repayment Tracker</span>}
                  {!isCollapsed && <span className={`sb__chevron ${showRepayment ? "sb__chevron--open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>}
                </div>
                {showRepayment && !isCollapsed && (
                  <div className="sb__submenu">
                    <div className="sb__sublink" onClick={() => navigate("/repayment-tracker")}>View</div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </nav>

      {/* ── Footer: Settings / Logout ── */}
      <div className="sb__footer">
        <div className="sb__section-label">{!isCollapsed ? "Preferences" : ""}</div>

        <div className="sb__item sb__item--footer" onClick={handleLogout} title="Log Out">
          <span className="sb__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </span>
          {!isCollapsed && <span className="sb__label">Log Out</span>}
        </div>
      </div>

      <style>{`
        /* ═══════════ SIDEBAR SHELL ═══════════ */
        .sb {
          width: 260px;
          height: 100vh;
          background: #2a2a2a;
          color: #d4d4d4;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          z-index: 100;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid #3a3a3a;
        }
        .sb--collapsed { width: 80px; }

        /* ═══════════ TOP BAR ═══════════ */
        .sb__top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #3a3a3a;
          min-height: 56px;
        }
        .sb--collapsed .sb__top {
          justify-content: center;
          padding: 18px 0;
        }

        .sb__toggle {
          background: none;
          border: none;
          color: #d4d4d4;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.15s;
          line-height: 1;
          flex-shrink: 0;
        }
        .sb__toggle:hover { background: #404040; }

        .sb__brand {
          font-size: 18px;
          font-weight: 700;
          color: #e8863a;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        /* ═══════════ PROFILE ═══════════ */
        .sb__profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          margin: 12px 12px 8px 12px;
          background: #353535;
          border-radius: 14px;
        }
        .sb--collapsed .sb__profile {
          justify-content: center;
          padding: 14px;
          margin: 12px 10px 8px 10px;
        }

        .sb__avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8863a 0%, #d4723a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(232, 134, 58, 0.3);
        }

        .sb__user-info {
          overflow: hidden;
        }
        .sb__user-name {
          font-weight: 600;
          font-size: 14px;
          color: #f0f0f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb__user-role {
          font-size: 11px;
          color: #e8863a;
          font-weight: 600;
          letter-spacing: 0.3px;
          margin-top: 2px;
        }

        /* ═══════════ NAVIGATION ═══════════ */
        .sb__nav {
          flex: 1;
          padding: 8px 0;
          overflow-y: auto;
        }

        .sb__section-label {
          font-size: 11px;
          font-weight: 600;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 16px 24px 8px 24px;
          white-space: nowrap;
          min-height: 12px;
        }
        .sb--collapsed .sb__section-label {
          padding: 12px 0;
          text-align: center;
          border-top: 1px solid #3a3a3a;
          margin: 0 10px;
        }

        .sb__item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 24px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          white-space: nowrap;
        }
        .sb--collapsed .sb__item {
          justify-content: center;
          padding: 12px 0;
        }
        .sb__item:hover {
          background: #353535;
        }

        .sb__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: #b0b0b0;
          transition: color 0.15s;
        }
        .sb__item:hover .sb__icon { color: #e8863a; }

        .sb__label {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: #d4d4d4;
        }
        .sb__item:hover .sb__label { color: #f0f0f0; }

        .sb__chevron {
          display: flex;
          align-items: center;
          color: #808080;
          transition: transform 0.25s ease;
        }
        .sb__chevron--open { transform: rotate(180deg); }

        .sb__badge {
          background: #e8863a;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 10px;
          margin-right: auto;
          margin-left: -4px;
        }

        /* ═══════════ SUBMENU ═══════════ */
        .sb__submenu {
          padding: 2px 0 2px 62px;
        }
        .sb__sublink {
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 400;
          color: #a0a0a0;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .sb__sublink:hover {
          color: #e8863a;
          background: #303030;
        }

        /* ═══════════ FOOTER ═══════════ */
        .sb__footer {
          border-top: 1px solid #3a3a3a;
          margin-top: auto;
          padding-bottom: 12px;
        }

        .sb__item--footer .sb__icon { color: #b0b0b0; }
        .sb__item--footer:hover .sb__icon { color: #ef4444; }
        .sb__item--footer:hover .sb__label { color: #ef4444; }

        /* ═══════════ SCROLLBAR ═══════════ */
        .sb::-webkit-scrollbar { width: 4px; }
        .sb::-webkit-scrollbar-track { background: transparent; }
        .sb::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
        .sb::-webkit-scrollbar-thumb:hover { background: #505050; }
      `}</style>
    </div>
  );
};

export default Sidebar;