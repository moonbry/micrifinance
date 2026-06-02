import { useEffect, useState } from "react";
import axios from "axios";

interface Loan {
  id: number;
  name: string;
  amount: number;
  total_paid: number;
  remaining_balance: number;
  monthly_payment: number;
  payment_status: string;
  next_payment_date: string;
  status: string;
}

interface Repayment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string;
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
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const [activeRes, summaryRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/v1/loans/active", { headers }),
        axios.get("http://127.0.0.1:8000/api/v1/repayments/summary", { headers })
      ]);
      
      setActiveLoans(activeRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error(error);
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
      setRepayments(res.data.repayments);
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
      alert("Please enter a valid amount");
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
      
      alert("✅ Repayment recorded successfully!");
      setShowRepaymentModal(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to record repayment");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "🟡 Pending",
      partial: "🔵 Partial",
      completed: "✅ Completed",
      overdue: "🔴 Overdue"
    };
    return badges[status] || status;
  };

  return (
    <div className="rt-container">
      <div className="rt-header">
        <div>
          <h1>💰 Repayment Tracker</h1>
          <p>Track loan repayments and outstanding balances</p>
        </div>
        <button className="rt-refresh-btn" onClick={fetchData}>
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="rt-summary-cards">
        <div className="rt-summary-card">
          <div className="rt-summary-icon">💰</div>
          <div className="rt-summary-info">
            <span>Total Disbursed</span>
            <strong>TZS {summary?.total_disbursed?.toLocaleString() || 0}</strong>
          </div>
        </div>
        <div className="rt-summary-card">
          <div className="rt-summary-icon">✅</div>
          <div className="rt-summary-info">
            <span>Total Repaid</span>
            <strong>TZS {summary?.total_repaid?.toLocaleString() || 0}</strong>
          </div>
        </div>
        <div className="rt-summary-card">
          <div className="rt-summary-icon">📊</div>
          <div className="rt-summary-info">
            <span>Outstanding</span>
            <strong>TZS {summary?.outstanding?.toLocaleString() || 0}</strong>
          </div>
        </div>
        <div className="rt-summary-card">
          <div className="rt-summary-icon">📈</div>
          <div className="rt-summary-info">
            <span>Repayment Rate</span>
            <strong>{summary?.repayment_rate || 0}%</strong>
          </div>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="rt-table-card">
        <div className="rt-table-header">
          <h2>Active Loans</h2>
        </div>
        {loading ? (
          <div className="rt-empty">Loading loans...</div>
        ) : activeLoans.length === 0 ? (
          <div className="rt-empty">
            <h3>No Active Loans</h3>
            <p>No active loans found</p>
          </div>
        ) : (
          <div className="rt-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Borrower</th>
                  <th>Loan Amount</th>
                  <th>Total Paid</th>
                  <th>Remaining</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map((loan, index) => {
                  const progress = loan.amount > 0 ? (loan.total_paid / loan.amount) * 100 : 0;
                  return (
                    <tr key={loan.id}>
                      <td>{index + 1}</td>
                      <td>{loan.name}</td>
                      <td>TZS {loan.amount.toLocaleString()}</td>
                      <td className="rt-paid">TZS {loan.total_paid?.toLocaleString() || 0}</td>
                      <td className="rt-remaining">TZS {loan.remaining_balance?.toLocaleString() || loan.amount.toLocaleString()}</td>
                      <td>
                        <div className="rt-progress-bar">
                          <div className="rt-progress-fill" style={{ width: `${progress}%` }}></div>
                          <span>{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`rt-status-badge rt-${loan.payment_status}`}>
                          {getStatusBadge(loan.payment_status)}
                        </span>
                      </td>
                      <td>
                        <button className="rt-btn-view" onClick={() => viewRepayments(loan)}>📋 History</button>
                        <button className="rt-btn-pay" onClick={() => openRepaymentModal(loan)}>💰 Pay</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Repayment History Modal */}
      {selectedLoan && (
        <div className="rt-modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="rt-modal rt-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="rt-modal-header">
              <h2>📋 Repayment History - {selectedLoan.name}</h2>
              <button className="rt-close-btn" onClick={() => setSelectedLoan(null)}>✖</button>
            </div>
            <div className="rt-loan-summary">
              <div><strong>Total Loan:</strong> TZS {selectedLoan.amount.toLocaleString()}</div>
              <div><strong>Total Paid:</strong> TZS {selectedLoan.total_paid?.toLocaleString() || 0}</div>
              <div><strong>Remaining:</strong> TZS {selectedLoan.remaining_balance?.toLocaleString() || selectedLoan.amount.toLocaleString()}</div>
            </div>
            {repayments.length === 0 ? (
              <p className="rt-no-data">No repayments recorded yet</p>
            ) : (
              <div className="rt-table-wrapper">
                <table className="rt-repayment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Receipt #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repayments.map((repayment) => (
                      <tr key={repayment.id}>
                        <td>{new Date(repayment.payment_date).toLocaleDateString()}</td>
                        <td>TZS {repayment.amount.toLocaleString()}</td>
                        <td>{repayment.payment_method}</td>
                        <td>{repayment.receipt_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="rt-modal-actions">
              <button className="rt-cancel-btn" onClick={() => setSelectedLoan(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Repayment Modal */}
      {showRepaymentModal && selectedLoanForRepayment && (
        <div className="rt-modal-overlay" onClick={() => setShowRepaymentModal(false)}>
          <div className="rt-modal" onClick={(e) => e.stopPropagation()}>
            <h2>💰 Record Repayment</h2>
            <div className="rt-loan-info">
              <p><strong>Borrower:</strong> {selectedLoanForRepayment.name}</p>
              <p><strong>Remaining Balance:</strong> TZS {selectedLoanForRepayment.remaining_balance?.toLocaleString() || selectedLoanForRepayment.amount.toLocaleString()}</p>
            </div>
            <div className="rt-form-group">
              <label>Amount *</label>
              <input type="number" placeholder="Enter amount" value={repaymentAmount} onChange={(e) => setRepaymentAmount(e.target.value)} />
            </div>
            <div className="rt-form-group">
              <label>Payment Date *</label>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
            <div className="rt-form-group">
              <label>Payment Method *</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            <div className="rt-form-group">
              <label>Transaction ID (Optional)</label>
              <input type="text" placeholder="Transaction reference" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            </div>
            <div className="rt-form-group">
              <label>Notes (Optional)</label>
              <textarea rows={2} placeholder="Additional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="rt-modal-actions">
              <button className="rt-cancel-btn" onClick={() => setShowRepaymentModal(false)}>Cancel</button>
              <button className="rt-submit-btn" onClick={submitRepayment}>Record Payment</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }

        .rt-container {
          padding: 80px 30px 30px 30px;
          min-height: 100vh;
          background: #f8fafc;
        }

        .rt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .rt-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
        }

        .rt-header p {
          margin-top: 5px;
          color: #64748b;
          font-size: 14px;
        }

        .rt-refresh-btn {
          border: none;
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .rt-refresh-btn:hover {
          background: #1d4ed8;
        }

        .rt-summary-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .rt-summary-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .rt-summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .rt-summary-icon {
          font-size: 36px;
        }

        .rt-summary-info {
          display: flex;
          flex-direction: column;
        }

        .rt-summary-info span {
          font-size: 13px;
          color: #64748b;
        }

        .rt-summary-info strong {
          font-size: 24px;
          color: #0f172a;
          font-weight: 700;
        }

        .rt-table-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .rt-table-header {
          margin-bottom: 20px;
        }

        .rt-table-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
        }

        .rt-table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #0f172a;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 14px;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        tr:hover {
          background: #f8fafc;
        }

        .rt-paid {
          color: #10b981;
          font-weight: 600;
        }

        .rt-remaining {
          color: #f59e0b;
          font-weight: 600;
        }

        .rt-progress-bar {
          width: 100px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          height: 8px;
        }

        .rt-progress-fill {
          background: #10b981;
          height: 8px;
          border-radius: 10px;
        }

        .rt-progress-bar span {
          font-size: 11px;
          position: absolute;
          right: 5px;
          top: -14px;
          color: #0f172a;
        }

        .rt-status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          display: inline-block;
        }

        .rt-status-badge.rt-pending {
          background: #fef3c7;
          color: #b45309;
        }

        .rt-status-badge.rt-partial {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .rt-status-badge.rt-completed {
          background: #dcfce7;
          color: #166534;
        }

        .rt-status-badge.rt-overdue {
          background: #fee2e2;
          color: #dc2626;
        }

        .rt-btn-view, .rt-btn-pay {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          margin-right: 5px;
          border: none;
          transition: 0.2s;
        }

        .rt-btn-view {
          background: #3b82f6;
          color: white;
        }

        .rt-btn-view:hover {
          background: #2563eb;
        }

        .rt-btn-pay {
          background: #10b981;
          color: white;
        }

        .rt-btn-pay:hover {
          background: #059669;
        }

        .rt-empty {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .rt-empty h3 {
          margin-bottom: 8px;
          color: #0f172a;
        }

        /* MODALS */
        .rt-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .rt-modal {
          background: white;
          border-radius: 20px;
          padding: 30px;
          width: 500px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .rt-modal-large {
          width: 800px;
          max-width: 95%;
        }

        .rt-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .rt-modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
        }

        .rt-close-btn {
          background: #ef4444;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .rt-close-btn:hover {
          background: #dc2626;
        }

        .rt-loan-summary, .rt-loan-info {
          display: flex;
          gap: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .rt-loan-summary div, .rt-loan-info p {
          margin: 0;
        }

        .rt-form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rt-form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .rt-form-group input, .rt-form-group select, .rt-form-group textarea {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          transition: 0.2s;
        }

        .rt-form-group input:focus, .rt-form-group select:focus, .rt-form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
        }

        .rt-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .rt-cancel-btn {
          padding: 10px 20px;
          background: #e2e8f0;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }

        .rt-cancel-btn:hover {
          background: #cbd5e1;
        }

        .rt-submit-btn {
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }

        .rt-submit-btn:hover {
          background: #059669;
        }

        .rt-no-data {
          text-align: center;
          padding: 30px;
          color: #64748b;
        }

        .rt-repayment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rt-repayment-table th {
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 600;
        }

        @media (max-width: 1100px) {
          .rt-summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .rt-container {
            padding: 70px 15px 15px 15px;
          }
          .rt-summary-cards {
            grid-template-columns: 1fr;
          }
          .rt-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .rt-loan-summary, .rt-loan-info {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default RepaymentTracker;