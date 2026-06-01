import { useEffect, useState } from "react";
import axios from "axios";
import type { FC } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface LoanStats {
  manager_review: number;
  gm_review: number;
  md_review: number;
  approved: number;
  total: number;
}

interface DashboardData {
  usersCount: number;
  loanStats: LoanStats;
  isLoading: boolean;
  error: string | null;
}

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardData>({
    usersCount: 0,
    loanStats: {
      manager_review: 0,
      gm_review: 0,
      md_review: 0,
      approved: 0,
      total: 0,
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await axios.get("http://127.0.0.1:8000/api/v1/users/count");
      const loansRes = await axios.get("http://127.0.0.1:8000/api/v1/loans/stats");
      
      setData({
        usersCount: usersRes.data.count || 0,
        loanStats: loansRes.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load dashboard data. Please refresh the page.",
      }));
    }
  };

  const stats = [
    {
      key: "users",
      label: "Users",
      value: data.usersCount,
      icon: "👥",
      hint: "Registered members",
      tone: "cyan",
      progress: data.usersCount > 0 ? Math.min(100, Math.round((data.usersCount / 200) * 100)) : 0,
    },
    {
      key: "loans",
      label: "Total Loans",
      value: data.loanStats.total,
      icon: "💳",
      hint: "All loan applications",
      tone: "violet",
      progress: data.loanStats.total > 0 ? Math.min(100, Math.round((data.loanStats.total / 100) * 100)) : 0,
    },
    {
      key: "approved",
      label: "Approved Loans",
      value: data.loanStats.approved,
      icon: "✅",
      hint: "Successfully approved",
      tone: "green",
      progress: data.loanStats.total > 0 ? Math.round((data.loanStats.approved / data.loanStats.total) * 100) : 0,
    },
    {
      key: "pending",
      label: "Pending Requests",
      value: data.loanStats.manager_review + data.loanStats.gm_review + data.loanStats.md_review,
      icon: "⏳",
      hint: "Awaiting approval",
      tone: "amber",
      progress: data.loanStats.total > 0 
        ? Math.round(((data.loanStats.manager_review + data.loanStats.gm_review + data.loanStats.md_review) / data.loanStats.total) * 100) 
        : 0,
    },
  ] as const;

  const approvalRate = data.loanStats.total > 0 
    ? Math.round((data.loanStats.approved / data.loanStats.total) * 100) 
    : 0;

  // Data for Bar Chart - Loan Distribution by Status
  const barChartData = {
    labels: ["Loan Manager", "General Manager", "Managing Director", "Approved"],
    datasets: [
      {
        label: "Number of Loans",
        data: [
          data.loanStats.manager_review,
          data.loanStats.gm_review,
          data.loanStats.md_review,
          data.loanStats.approved,
        ],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",   // Amber
          "rgba(59, 130, 246, 0.8)",    // Blue
          "rgba(139, 92, 246, 0.8)",    // Purple
          "rgba(34, 197, 94, 0.8)",     // Green
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Data for Pie Chart - Loan Status Distribution
  const pieChartData = {
    labels: ["Manager Review", "GM Review", "MD Review", "Approved"],
    datasets: [
      {
        data: [
          data.loanStats.manager_review,
          data.loanStats.gm_review,
          data.loanStats.md_review,
          data.loanStats.approved,
        ],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255,255,255,0.9)",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Loan Distribution by Status",
        color: "rgba(255,255,255,0.9)",
        font: { size: 14, weight: "bold" as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "rgba(255,255,255,0.8)" },
      },
      x: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "rgba(255,255,255,0.8)" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "rgba(255,255,255,0.9)",
          font: { size: 11 },
        },
      },
      title: {
        display: true,
        text: "Loan Status Distribution",
        color: "rgba(255,255,255,0.9)",
        font: { size: 14, weight: "bold" as const },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.loanStats.total;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to Microfinance Management System</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchDashboardData} disabled={data.isLoading}>
            🔄 {data.isLoading ? "Loading..." : "Refresh"}
          </button>
          <div className="chip chip-live">Live</div>
          <div className="chip chip-muted">{new Date().getFullYear()}</div>
        </div>
      </div>

      {data.error && (
        <div className="error-banner">
          <span>⚠️</span> {data.error}
          <button onClick={fetchDashboardData}>Try Again</button>
        </div>
      )}

      {/* CARDS GRID */}
      <div className="cards">
        {stats.map((s) => (
          <div key={s.key} className={`card card--${s.tone}`}>
            <div className="card-top">
              <div className="icon" aria-hidden="true">
                {s.icon}
              </div>
              <div className="label-wrap">
                <div className="label">{s.label}</div>
                <div className="hint">{s.hint}</div>
              </div>
            </div>

            <div className="value-row">
              <div className="value">{data.isLoading ? "..." : s.value}</div>
              <div className="tone-pill">{s.tone}</div>
            </div>

            <div className="bar" aria-label={`${s.progress}%`}>
              <div className="bar-fill" style={{ width: `${s.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="charts-container">
        <div className="chart-card">
          <Bar data={barChartData} options={barOptions} height={250} />
        </div>
        <div className="chart-card">
          <Pie data={pieChartData} options={pieOptions} height={250} />
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats">
        <div className="quick-card">
          <div className="quick-icon">📊</div>
          <div className="quick-info">
            <span>Approval Rate</span>
            <strong>{data.isLoading ? "..." : `${approvalRate}%`}</strong>
          </div>
        </div>
        <div className="quick-card">
          <div className="quick-icon">👔</div>
          <div className="quick-info">
            <span>Manager Review</span>
            <strong>{data.isLoading ? "..." : data.loanStats.manager_review}</strong>
          </div>
        </div>
        <div className="quick-card">
          <div className="quick-icon">🏦</div>
          <div className="quick-info">
            <span>GM Review</span>
            <strong>{data.isLoading ? "..." : data.loanStats.gm_review}</strong>
          </div>
        </div>
        <div className="quick-card">
          <div className="quick-icon">👑</div>
          <div className="quick-info">
            <span>MD Review</span>
            <strong>{data.isLoading ? "..." : data.loanStats.md_review}</strong>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard {
          padding: 24px;
          min-height: 100vh;
          background: radial-gradient(1200px 700px at 10% 10%, rgba(29, 78, 216, 0.18), rgba(29, 78, 216, 0) 55%),
            radial-gradient(900px 600px at 80% 20%, rgba(16, 185, 129, 0.14), rgba(16, 185, 129, 0) 55%),
            radial-gradient(1000px 700px at 60% 110%, rgba(124, 58, 237, 0.14), rgba(124, 58, 237, 0) 55%),
            linear-gradient(180deg, #0b1220 0%, #050816 100%);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          color: rgba(255,255,255,0.92);
        }

        .header {
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .header h1 {
          font-size: 24px;
          margin: 0;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.96);
        }

        .header p {
          opacity: 0.75;
          font-size: 13px;
          margin-top: 4px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: none;
        }

        .refresh-btn {
          border: none;
          background: rgba(59, 130, 246, 0.8);
          color: white;
          padding: 6px 12px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
        }

        .refresh-btn:hover {
          background: rgba(59, 130, 246, 1);
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chip {
          font-size: 11px;
          font-weight: 900;
          padding: 5px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
        }
        .chip-live {
          border-color: rgba(52,211,153,0.35);
          background: rgba(52,211,153,0.12);
          color: rgba(167,243,208,0.95);
        }
        .chip-muted {
          color: rgba(229,231,235,0.78);
          background: rgba(2,6,23,0.3);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 13px;
        }

        .error-banner button {
          background: #ef4444;
          border: none;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
        }

        /* CARDS */
        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .card {
          padding: 14px;
          border-radius: 20px;
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 12px 35px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -1px;
          opacity: 0.5;
          pointer-events: none;
          background: radial-gradient(600px 200px at 20% 10%, rgba(255,255,255,0.1), rgba(255,255,255,0) 55%);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          flex: none;
          font-size: 18px;
        }

        .label {
          font-weight: 800;
          letter-spacing: -0.01em;
          font-size: 14px;
          color: rgba(255,255,255,0.95);
        }

        .hint {
          font-size: 10px;
          margin-top: 2px;
          color: rgba(229,231,235,0.7);
        }

        .value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-top: 12px;
          position: relative;
        }

        .value {
          font-size: 28px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .tone-pill {
          font-size: 10px;
          font-weight: 900;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.28);
          color: rgba(229,231,235,0.82);
          text-transform: capitalize;
          flex: none;
        }

        .bar {
          height: 6px;
          border-radius: 999px;
          margin-top: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(96,165,250,0.9), rgba(52,211,153,0.9));
          transition: width 0.3s ease;
        }

        /* CHARTS SECTION */
        .charts-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .chart-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 18px;
          transition: transform 0.2s ease;
        }

        .chart-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.2);
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .quick-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(12px);
        }

        .quick-icon {
          font-size: 24px;
          background: rgba(255,255,255,0.05);
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .quick-info {
          display: flex;
          flex-direction: column;
        }

        .quick-info span {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
        }

        .quick-info strong {
          font-size: 18px;
          font-weight: 800;
          color: white;
        }

        /* Tone variants */
        .card--cyan .value { color: #22d3ee; }
        .card--violet .value { color: #a78bfa; }
        .card--green .value { color: #34d399; }
        .card--amber .value { color: #fbbf24; }

        @media (max-width: 1200px) {
          .cards {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 15px;
          }
          .cards {
            grid-template-columns: 1fr;
          }
          .quick-stats {
            grid-template-columns: 1fr;
          }
          .header {
            flex-direction: column;
          }
          .header h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;