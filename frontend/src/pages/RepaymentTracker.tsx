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
  completed_at?: string;
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
  const [completedLoans, setCompletedLoans] = useState<Loan[]>([]);
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
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Load completed loans from localStorage when page opens
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load completed loans from localStorage
    const savedCompleted = localStorage.getItem("completedLoans");
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedLoans(parsed);
        console.log("Loaded completed loans:", parsed.length);
      } catch (e) {
        console.error("Error loading:", e);
      }
    }
    
    // Fetch active loans from backend
    await fetchActiveLoans();
  };

  const fetchActiveLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [loansRes, summaryRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/v1/loans/active", { headers }),
        axios.get("http://127.0.0.1:8000/api/v1/repayments/summary", { headers })
      ]);
      
      const allLoans = loansRes.data || [];
      
      const active: Loan[] = [];
      
      for (const loan of allLoans) {
        // Round to remove decimals
        const roundedBalance = Math.round(loan.remaining_balance);
        
        if (roundedBalance <= 0) {
          // Add to completed loans
          const alreadyCompleted = completedLoans.some(cl => cl.id === loan.id);
          if (!alreadyCompleted) {
            const completedLoan = { 
              ...loan, 
              remaining_balance: 0,
              total_paid: loan.amount,
              payment_status: 'completed',
              completed_at: new Date().toISOString()
            };
            setCompletedLoans(prev => {
              const updated = [completedLoan, ...prev];
              localStorage.setItem("completedLoans", JSON.stringify(updated));
              return updated;
            });
          }
        } else {
          // Round all numbers for active loans
          active.push({
            ...loan,
            amount: Math.round(loan.amount),
            total_paid: Math.round(loan.total_paid || 0),
            remaining_balance: roundedBalance
          });
        }
      }
      
      setActiveLoans(active);
      setSummary(summaryRes.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
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
      alert("Imeshindwa kuleta historia ya malipo");
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

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  const submitRepayment = async () => {
    const amount = Math.round(parseFloat(repaymentAmount));
    if (isNaN(amount) || amount <= 0) {
      alert("Tafadhali ingiza kiasi sahihi");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/v1/loans/${selectedLoanForRepayment?.id}/repay`, {
        amount: amount,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        notes: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`Malipo ya TZS ${formatNumber(amount)} yamewekwa`);
      setShowRepaymentModal(false);
      
      const currentBalance = Math.round(selectedLoanForRepayment?.remaining_balance || 0);
      const newBalance = currentBalance - amount;
      
      if (newBalance <= 0) {
        // Move to completed loans
        const completedLoan = {
          ...selectedLoanForRepayment!,
          remaining_balance: 0,
          total_paid: Math.round((selectedLoanForRepayment!.total_paid || 0) + amount),
          payment_status: 'completed',
          completed_at: new Date().toISOString()
        };
        
        setCompletedLoans(prev => {
          const exists = prev.some(l => l.id === completedLoan.id);
          if (!exists) {
            const updated = [completedLoan, ...prev];
            localStorage.setItem("completedLoans", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
        
        setActiveLoans(prev => prev.filter(l => l.id !== selectedLoanForRepayment?.id));
      } else {
        // Update active loan
        setActiveLoans(prev => prev.map(loan => 
          loan.id === selectedLoanForRepayment?.id 
            ? { ...loan, remaining_balance: newBalance, total_paid: Math.round((loan.total_paid || 0) + amount) }
            : loan
        ));
      }
      
      // Refresh data
      await fetchActiveLoans();
      
    } catch (error: any) {
      alert(error.response?.data?.error || "Imeshindwa kurekodi malipo");
    }
  };

  const totalDisbursed = summary?.total_disbursed || 0;
  const totalRepaid = summary?.total_repaid || 0;
  const outstanding = summary?.outstanding || 0;
  const repaymentRate = summary?.repayment_rate || 0;
  const totalCompleted = completedLoans.length;
  const totalCompletedAmount = completedLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);

  const barChartData = {
    labels: ["Total Disbursed", "Total Repaid", "Outstanding"],
    datasets: [{
      label: "Amount (TZS)",
      data: [totalDisbursed, totalRepaid, outstanding],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderRadius: 8,
    }],
  };

  const pieChartData = {
    labels: ["Total Repaid", "Outstanding"],
    datasets: [{
      data: [totalRepaid, outstanding],
      backgroundColor: ["#10b981", "#f59e0b"],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const, labels: { font: { size: 11 } } } },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: { y: { ticks: { callback: (val: any) => `TZS ${val.toLocaleString()}` } } },
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
        <button className="refresh-btn" onClick={loadData}>⟳ Refresh</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">TZS {formatNumber(totalDisbursed)}</div><div className="stat-label">Total Disbursed</div></div>
        <div className="stat-card"><div className="stat-value text-green">TZS {formatNumber(totalRepaid)}</div><div className="stat-label">Total Repaid</div></div>
        <div className="stat-card"><div className="stat-value text-orange">TZS {formatNumber(outstanding)}</div><div className="stat-label">Outstanding</div></div>
        <div className="stat-card"><div className="stat-value text-blue">{repaymentRate}%</div><div className="stat-label">Repayment Rate</div></div>
        <div className="stat-card"><div className="stat-value text-purple">{totalCompleted}</div><div className="stat-label">Completed Loans</div></div>
        <div className="stat-card"><div className="stat-value text-purple">TZS {formatNumber(totalCompletedAmount)}</div><div className="stat-label">Completed Amount</div></div>
      </div>

      <div className="charts-row">
        <div className="chart-box"><h3>Loan Distribution</h3><div className="chart-container"><Bar data={barChartData} options={barOptions} /></div></div>
        <div className="chart-box"><h3>Repayment Status</h3><div className="chart-container"><Pie data={pieChartData} options={chartOptions} /></div></div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active Loans ({activeLoans.length})</button>
        <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Completed Loans ({completedLoans.length})</button>
      </div>

      {activeTab === 'active' && (
        <div className="table-card">
          <h2>Active Loans</h2>
          {loading ? <div className="empty-state">Loading...</div> : activeLoans.length === 0 ? (
            <div className="empty-state"><p>No active loans found</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>#</th><th>Borrower</th><th>Loan Amount</th><th>Paid</th><th>Remaining</th><th>Progress</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {activeLoans.map((loan, idx) => {
                    const progress = loan.amount > 0 ? (loan.total_paid / loan.amount) * 100 : 0;
                    return (
                      <tr key={loan.id}>
                        <td>{idx + 1}</td>
                        <td><strong>{loan.name}</strong></td>
                        <td>TZS {formatNumber(loan.amount)}</td>
                        <td className="text-green">TZS {formatNumber(loan.total_paid || 0)}</td>
                        <td className="text-orange">TZS {formatNumber(loan.remaining_balance)}</td>
                        <td className="progress-cell"><div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div><span>{Math.round(progress)}%</span></div></td>
                        <td><span className={`status ${loan.payment_status || 'pending'}`}>{getStatusBadge(loan.payment_status || 'pending')}</span></td>
                        <td className="actions-cell"><button className="btn-history" onClick={() => viewRepayments(loan)}>History</button><button className="btn-pay" onClick={() => openRepaymentModal(loan)}>Pay</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="table-card">
          <h2>Completed Loans History (Waliomaliza Kulipa)</h2>
          {loading ? <div className="empty-state">Loading...</div> : completedLoans.length === 0 ? (
            <div className="empty-state"><p>No completed loans found yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>#</th><th>Borrower</th><th>Loan Amount</th><th>Total Paid</th><th>Completion Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {completedLoans.map((loan, idx) => (
                    <tr key={loan.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{loan.name}</strong></td>
                      <td>TZS {formatNumber(loan.amount)}</td>
                      <td className="text-green">TZS {formatNumber(loan.total_paid || loan.amount)}</td>
                      <td>{loan.completed_at ? new Date(loan.completed_at).toLocaleDateString() : '-'}</td>
                      <td><span className="status completed">Completed</span></td>
                      <td className="actions-cell"><button className="btn-history" onClick={() => viewRepayments(loan)}>View Full History</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* History Modal */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Repayment History - {selectedLoan.name}</h2><button className="modal-close" onClick={() => setSelectedLoan(null)}>×</button></div>
            <div className="loan-summary">
              <div><strong>Total Loan:</strong> TZS {formatNumber(selectedLoan.amount)}</div>
              <div><strong>Total Paid:</strong> TZS {formatNumber(selectedLoan.total_paid || 0)}</div>
              <div><strong>Remaining:</strong> TZS {formatNumber(selectedLoan.remaining_balance)}</div>
              <div><strong>Status:</strong> <span className={`status ${selectedLoan.payment_status}`}>{getStatusBadge(selectedLoan.payment_status || 'pending')}</span></div>
            </div>
            {repayments.length === 0 ? <div className="empty-state-small">No repayments recorded yet</div> : (
              <div className="table-wrapper">
                <table className="repayment-table">
                  <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Receipt</th></tr></thead>
                  <tbody>
                    {repayments.map((r) => (
                      <tr key={r.id}><td>{new Date(r.payment_date).toLocaleDateString()}</td><td>TZS {formatNumber(r.amount)}</td><td>{r.payment_method}</td><td>{r.receipt_number}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-footer"><button className="btn-secondary" onClick={() => setSelectedLoan(null)}>Close</button></div>
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
              <p><strong>Remaining Balance:</strong> TZS {formatNumber(selectedLoanForRepayment.remaining_balance)}</p>
            </div>
            <div className="form-group"><label>Amount</label><input type="number" step="1" placeholder="Enter amount" value={repaymentAmount} onChange={(e) => setRepaymentAmount(e.target.value)} /></div>
            <div className="form-group"><label>Payment Date</label><input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></div>
            <div className="form-group"><label>Payment Method</label><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option value="cash">Cash</option><option value="bank_transfer">Bank Transfer</option><option value="mobile_money">Mobile Money</option></select></div>
            <div className="form-group"><label>Transaction ID (Optional)</label><input type="text" placeholder="Transaction reference" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} /></div>
            <div className="form-group"><label>Notes</label><textarea rows={2} placeholder="Additional notes" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowRepaymentModal(false)}>Cancel</button><button className="btn-primary" onClick={submitRepayment}>Record Payment</button></div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tracker-page { padding: 80px 20px 20px 20px; min-height: 100vh; background: #f1f5f9; font-family: system-ui, sans-serif; max-width: 100%; overflow-x: hidden; }
        .tracker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 15px; }
        .tracker-header h1 { font-size: 24px; color: #0f172a; }
        .tracker-header p { color: #64748b; font-size: 13px; }
        .refresh-btn { background: #0f172a; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 28px; }
        .stat-card { background: white; padding: 15px; border-radius: 16px; border: 1px solid #e2e8f0; }
        .stat-value { font-size: 20px; font-weight: 800; color: #0f172a; }
        .stat-label { font-size: 12px; color: #64748b; }
        .text-green { color: #10b981; }
        .text-orange { color: #f59e0b; }
        .text-blue { color: #3b82f6; }
        .text-purple { color: #8b5cf6; }
        .charts-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .chart-box { background: white; border-radius: 16px; padding: 15px; border: 1px solid #e2e8f0; }
        .chart-container { height: 240px; }
        .tabs-container { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
        .tab-btn { background: none; border: none; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; }
        .tab-btn.active { color: #10b981; border-bottom: 2px solid #10b981; margin-bottom: -2px; }
        .table-card { background: white; border-radius: 16px; padding: 15px; border: 1px solid #e2e8f0; overflow-x: auto; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 500px; }
        th, td { padding: 10px 8px; text-align: left; font-size: 13px; }
        th { background: #f8fafc; font-weight: 600; }
        td { border-bottom: 1px solid #f1f5f9; }
        .progress-cell { width: 100px; }
        .progress-bar { background: #e2e8f0; border-radius: 20px; height: 6px; width: 80px; position: relative; display: inline-block; }
        .progress-fill { background: #10b981; height: 6px; border-radius: 20px; }
        .progress-bar span { font-size: 10px; position: absolute; right: -30px; top: -2px; }
        .status { padding: 3px 8px; border-radius: 30px; font-size: 11px; font-weight: 500; }
        .status.pending { background: #fef3c7; color: #b45309; }
        .status.partial { background: #dbeafe; color: #1d4ed8; }
        .status.completed { background: #dcfce7; color: #166534; }
        .actions-cell { display: flex; gap: 6px; flex-wrap: wrap; }
        .btn-history, .btn-pay { padding: 4px 10px; border-radius: 30px; font-size: 11px; cursor: pointer; border: none; }
        .btn-history { background: #e2e8f0; color: #1e293b; }
        .btn-pay { background: #10b981; color: white; }
        .empty-state { text-align: center; padding: 40px; color: #64748b; }
        .empty-state-small { text-align: center; padding: 20px; color: #64748b; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
        .modal { background: white; border-radius: 20px; padding: 20px; width: 90%; max-width: 450px; max-height: 90vh; overflow-y: auto; }
        .modal-large { max-width: 650px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; }
        .loan-summary, .loan-info { background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; }
        .form-group { margin-bottom: 14px; display: flex; flex-direction: column; gap: 5px; }
        .form-group label { font-size: 12px; font-weight: 600; }
        .form-group input, .form-group select, .form-group textarea { padding: 10px; border: 1px solid #cbd5e1; border-radius: 10px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .btn-primary { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 40px; cursor: pointer; }
        .btn-secondary { background: #e2e8f0; border: none; padding: 8px 16px; border-radius: 40px; cursor: pointer; }
        @media (max-width: 768px) {
          .tracker-page { padding: 70px 12px 12px 12px; }
          .stat-value { font-size: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default RepaymentTracker;