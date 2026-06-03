import { useEffect, useState } from "react";
import axios from "axios";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Loan {
  id: number;
  name: string;
  amount: number;
  total_paid: number;
  remaining_balance: number;
  payment_status: string;
  status: string;
}

interface Repayment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  receipt_number: string;
}

const RepaymentTracker = () => {
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedLoanForRepayment, setSelectedLoanForRepayment] = useState<Loan | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [loansRes, summaryRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/v1/loans/active", { headers }),
        axios.get("http://127.0.0.1:8000/api/v1/repayments/summary", { headers })
      ]);
      
      setActiveLoans(loansRes.data || []);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewRepayments = async (loan: Loan) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/loans/${loan.id}/repayments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedLoan(loan);
      setRepayments(res.data.repayments || []);
    } catch (error) {
      console.error(error);
    }
  };

  const openRepaymentModal = (loan: Loan) => {
    setSelectedLoanForRepayment(loan);
    setRepaymentAmount("");
    setPaymentMethod("cash");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setTransactionId("");
    setNotes("");
    setShowRepaymentModal(true);
  };

  const submitRepayment = async () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      alert("Tafadhali ingiza kiasi sahihi");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/v1/loans/${selectedLoanForRepayment?.id}/repay`, {
        amount: parseFloat(repaymentAmount),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        notes: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Malipo yamewekwa kikamilifu");
      setShowRepaymentModal(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Imeshindwa kurekodi malipo");
    }
  };

  // Chart data
  const totalDisbursed = summary?.total_disbursed || 0;
  const totalRepaid = summary?.total_repaid || 0;
  const outstanding = summary?.outstanding || 0;
  const repaymentRate = summary?.repayment_rate || 0;

  const barChartData = {
    labels: ["Total Disbursed", "Total Repaid", "Outstanding"],
    datasets: [
      {
        label: "Amount (TZS)",
        data: [totalDisbursed, totalRepaid, outstanding],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderRadius: 8,
      },
    ],
  };

  const pieChartData = {
    labels: ["Total Repaid", "Outstanding"],
    datasets: [
      {
        data: [totalRepaid, outstanding],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 11 } },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { callbacks: { label: (ctx: any) => `TZS ${ctx.raw.toLocaleString()}` } },
    },
    scales: {
      y: { ticks: { callback: (val: any) => `TZS ${val.toLocaleString()}` } },
    },
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "Pending",
      partial: "Partial",
      completed: "Completed",
      overdue: "Overdue"
    };
    return map[status] || status;
  };

  return (
    <div className="tracker-page">
      <div className="tracker-header">
        <div>
          <h1>Repayment Tracker</h1>
          <p>Track loan repayments and outstanding balances</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>⟳ Refresh</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">TZS {totalDisbursed.toLocaleString()}</div>
          <div className="stat-label">Total Disbursed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green">TZS {totalRepaid.toLocaleString()}</div>
          <div className="stat-label">Total Repaid</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-orange">TZS {outstanding.toLocaleString()}</div>
          <div className="stat-label">Outstanding</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-blue">{repaymentRate}%</div>
          <div className="stat-label">Repayment Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-box">
          <h3>Loan Distribution</h3>
          <div className="chart-container">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
        <div className="chart-box">
          <h3>Repayment Status</h3>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="table-card">
        <h2>Active Loans</h2>
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : activeLoans.length === 0 ? (
          <div className="empty-state">
            <p>No active loans found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Borrower</th><th>Loan Amount</th><th>Paid</th><th>Remaining</th><th>Progress</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {activeLoans.map((loan, idx) => {
                  const progress = loan.amount > 0 ? (loan.total_paid / loan.amount) * 100 : 0;
                  return (
                    <tr key={loan.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{loan.name}</strong></td>
                      <td>TZS {loan.amount.toLocaleString()}</td>
                      <td className="text-green">TZS {(loan.total_paid || 0).toLocaleString()}</td>
                      <td className="text-orange">TZS {(loan.remaining_balance || loan.amount).toLocaleString()}</td>
                      <td className="progress-cell">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                          <span>{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td><span className={`status ${loan.payment_status || 'pending'}`}>{getStatusBadge(loan.payment_status || 'pending')}</span></td>
                      <td className="actions-cell">
                        <button className="btn-history" onClick={() => viewRepayments(loan)}>History</button>
                        <button className="btn-pay" onClick={() => openRepaymentModal(loan)}>Pay</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History Modal */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Repayment History - {selectedLoan.name}</h2>
              <button className="modal-close" onClick={() => setSelectedLoan(null)}>×</button>
            </div>
            <div className="loan-summary">
              <div><strong>Total Loan:</strong> TZS {selectedLoan.amount.toLocaleString()}</div>
              <div><strong>Total Paid:</strong> TZS {(selectedLoan.total_paid || 0).toLocaleString()}</div>
              <div><strong>Remaining:</strong> TZS {(selectedLoan.remaining_balance || selectedLoan.amount).toLocaleString()}</div>
            </div>
            {repayments.length === 0 ? (
              <div className="empty-state-small">No repayments recorded yet</div>
            ) : (
              <div className="table-wrapper">
                <table className="repayment-table">
                  <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Receipt</th></tr></thead>
                  <tbody>
                    {repayments.map((r) => (
                      <tr key={r.id}>
                        <td>{new Date(r.payment_date).toLocaleDateString()}</td>
                        <td>TZS {r.amount.toLocaleString()}</td>
                        <td>{r.payment_method}</td>
                        <td>{r.receipt_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedLoan(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Repayment Modal */}
      {showRepaymentModal && selectedLoanForRepayment && (
        <div className="modal-overlay" onClick={() => setShowRepaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Record Repayment</h2>
            <div className="loan-info">
              <p><strong>Borrower:</strong> {selectedLoanForRepayment.name}</p>
              <p><strong>Remaining Balance:</strong> TZS {(selectedLoanForRepayment.remaining_balance || selectedLoanForRepayment.amount).toLocaleString()}</p>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="Enter amount" value={repaymentAmount} onChange={(e) => setRepaymentAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Payment Date</label>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transaction ID (Optional)</label>
              <input type="text" placeholder="Transaction reference" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea rows={2} placeholder="Additional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowRepaymentModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitRepayment}>Record Payment</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tracker-page { padding: 80px 30px 30px 30px; min-height: 100vh; background: #f1f5f9; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
        .tracker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 15px; }
        .tracker-header h1 { font-size: 26px; color: #0f172a; font-weight: 700; }
        .tracker-header p { color: #64748b; margin-top: 6px; font-size: 14px; }
        .refresh-btn { background: #0f172a; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer; font-weight: 500; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
        .stat-card { background: white; padding: 20px; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .stat-value { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .stat-label { font-size: 13px; color: #64748b; letter-spacing: 0.3px; }
        .text-green { color: #10b981; }
        .text-orange { color: #f59e0b; }
        .text-blue { color: #3b82f6; }
        .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .chart-box { background: white; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; }
        .chart-box h3 { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
        .chart-container { height: 260px; position: relative; }
        .table-card { background: white; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; }
        .table-card h2 { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px 8px; background: #f8fafc; color: #334155; font-weight: 600; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
        td { padding: 14px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; }
        .progress-cell { width: 120px; }
        .progress-bar { background: #e2e8f0; border-radius: 20px; height: 8px; width: 100px; position: relative; }
        .progress-fill { background: #10b981; height: 8px; border-radius: 20px; }
        .progress-bar span { font-size: 11px; position: absolute; right: -25px; top: -3px; color: #475569; }
        .status { padding: 4px 10px; border-radius: 30px; font-size: 12px; font-weight: 500; }
        .status.pending { background: #fef3c7; color: #b45309; }
        .status.partial { background: #dbeafe; color: #1d4ed8; }
        .status.completed { background: #dcfce7; color: #166534; }
        .actions-cell { display: flex; gap: 8px; }
        .btn-history { background: #e2e8f0; border: none; padding: 6px 12px; border-radius: 30px; font-size: 12px; cursor: pointer; color: #1e293b; }
        .btn-pay { background: #10b981; border: none; padding: 6px 12px; border-radius: 30px; font-size: 12px; cursor: pointer; color: white; }
        .empty-state { text-align: center; padding: 60px 20px; color: #64748b; }
        .empty-state-small { text-align: center; padding: 30px; color: #64748b; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: white; border-radius: 24px; padding: 28px; width: 500px; max-width: 100%; max-height: 90vh; overflow-y: auto; }
        .modal-large { width: 750px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h2 { font-size: 20px; color: #0f172a; }
        .modal-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #94a3b8; }
        .loan-summary, .loan-info { background: #f8fafc; padding: 16px; border-radius: 16px; margin-bottom: 20px; display: flex; gap: 24px; flex-wrap: wrap; }
        .form-group { margin-bottom: 18px; display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #334155; }
        .form-group input, .form-group select, .form-group textarea { padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 14px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .btn-primary { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 40px; cursor: pointer; font-weight: 500; }
        .btn-secondary { background: #e2e8f0; border: none; padding: 10px 20px; border-radius: 40px; cursor: pointer; font-weight: 500; }
        .repayment-table th, .repayment-table td { padding: 10px 12px; }
        @media (max-width: 1000px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .tracker-page { padding: 70px 15px 15px 15px; } .stats-grid { grid-template-columns: 1fr; } .actions-cell { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default RepaymentTracker;