import { useEffect, useState } from "react";
import axios from "axios";

interface Loan {
  id: number;
  name: string;
  amount: number;
  type: string;
  status: string;
  phone?: string;
  rejection_reason?: string;
  details?: any;
  created_at?: string;
}

const LoanManager = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    axios
      .get("http://127.0.0.1:8000/api/v1/loans/manager", { headers })
      .then((res) => {
        setLoans(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const approveLoan = (id: number) => {
  if (window.confirm("Approve this loan and send to General Manager?")) {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    axios
      .post(`http://127.0.0.1:8000/api/v1/loans/${id}/approve`, {}, { headers })
      .then((response) => {
        console.log("Approve response:", response.data);
        alert("✅ Loan approved and sent to General Manager");
        fetchLoans();
      })
      .catch((err) => {
        console.error("Approve error:", err);
        console.error("Error response:", err.response?.data);
        
        // Onyesha error halisi kutoka backend
        const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to approve loan";
        alert(`❌ ${errorMessage}`);
      });
  }
};

  const openRejectModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .post(`http://127.0.0.1:8000/api/v1/loans/${selectedLoan?.id}/reject`, {
        reason: rejectReason,
      }, { headers })
      .then(() => {
        alert("Loan rejected and returned to Loan Officer");
        setShowRejectModal(false);
        fetchLoans();
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to reject loan");
      });
  };

  const viewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  return (
    <div className="loan-manager-page">
      <div className="page-header">
        <div>
          <h1>Loan Manager</h1>
          <p>Review, approve or reject loan applications</p>
        </div>
        <button className="refresh-button" onClick={fetchLoans}>
          Refresh
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Total Requests</div>
          <div className="stat-number">{loans.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Current Stage</div>
          <div className="stat-number">Manager Review</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-number">{loans.length}</div>
        </div>
      </div>

      <div className="table-container">
        <h2>Loan Applications</h2>
        
        {loading ? (
          <div className="empty-state">Loading applications...</div>
        ) : loans.length === 0 ? (
          <div className="empty-state">
            <p>No loan requests</p>
            <span>No pending applications to review</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client Name</th>
                  <th>Loan Amount</th>
                  <th>Loan Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (
                  <tr key={loan.id}>
                    <td className="col-number">{index + 1}</td>
                    <td>
                      <div className="client-info">
                        <span className="client-name">{loan.name}</span>
                        <button className="details-link" onClick={() => viewDetails(loan)}>
                          View Details
                        </button>
                      </div>
                    </td>
                    <td className="col-amount">TZS {Number(loan.amount).toLocaleString()}</td>
                    <td><span className="loan-type-badge">{loan.type}</span></td>
                    <td><span className="status-badge status-manager">Manager Review</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-approve" onClick={() => approveLoan(loan.id)}>Approve</button>
                        <button className="btn-reject" onClick={() => openRejectModal(loan)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Loan</h2>
            <div className="modal-info">
              <p><strong>Client:</strong> {selectedLoan?.name}</p>
              <p><strong>Amount:</strong> TZS {Number(selectedLoan?.amount).toLocaleString()}</p>
            </div>
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={submitRejection}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedLoan && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Loan Application Details</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>

            <div className="details-section">
              <h3>Applicant Information</h3>
              <div className="details-grid">
                <div className="detail-item"><span>Full Name</span><strong>{selectedLoan.name}</strong></div>
                <div className="detail-item"><span>Phone Number</span><strong>{selectedLoan.phone || "-"}</strong></div>
                <div className="detail-item"><span>Loan Amount</span><strong>TZS {Number(selectedLoan.amount).toLocaleString()}</strong></div>
                <div className="detail-item"><span>Loan Type</span><strong>{selectedLoan.type}</strong></div>
                <div className="detail-item"><span>Status</span><strong>{selectedLoan.status}</strong></div>
                {selectedLoan.created_at && (
                  <div className="detail-item"><span>Application Date</span><strong>{new Date(selectedLoan.created_at).toLocaleString()}</strong></div>
                )}
              </div>
            </div>

            {selectedLoan.details && (
              <div className="details-section">
                <h3>Complete Application Data</h3>
                <div className="details-grid two-columns">
                  {Object.entries(selectedLoan.details).map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <span>{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                      <strong>{typeof value === "object" ? JSON.stringify(value) : String(value || "-")}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLoan.rejection_reason && (
              <div className="rejection-box">
                <h3>Rejection Reason</h3>
                <p>{selectedLoan.rejection_reason}</p>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loan-manager-page {
          padding: 80px 28px 28px 28px;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .page-header p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .refresh-button {
          background: #0f172a;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .refresh-button:hover {
          background: #1e293b;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-box {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
        }

        .table-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .table-container h2 {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 20px 0;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px 8px;
          background: #f8fafc;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
        }

        td {
          padding: 14px 8px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #1e293b;
        }

        tr:hover {
          background: #f8fafc;
        }

        .col-number {
          width: 50px;
          color: #64748b;
        }

        .col-amount {
          font-weight: 500;
          color: #0f172a;
        }

        .client-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .client-name {
          font-weight: 500;
        }

        .details-link {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
        }

        .details-link:hover {
          text-decoration: underline;
        }

        .loan-type-badge {
          background: #e2e8f0;
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-manager {
          background: #fef3c7;
          color: #b45309;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-approve {
          background: #10b981;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-approve:hover {
          background: #059669;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-reject:hover {
          background: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .empty-state span {
          font-size: 13px;
        }

        /* MODALS */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 28px;
          width: 500px;
          max-width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-large {
          width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-info {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          margin: 16px 0;
        }

        .modal-info p {
          margin: 4px 0;
        }

        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 14px;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-secondary {
          background: #e2e8f0;
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-secondary:hover {
          background: #cbd5e1;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .details-section {
          margin-bottom: 24px;
        }

        .details-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .two-columns {
          grid-template-columns: repeat(2, 1fr);
        }

        .detail-item {
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
        }

        .detail-item span {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .detail-item strong {
          font-size: 14px;
          color: #0f172a;
          word-break: break-word;
        }

        .rejection-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }

        .rejection-box h3 {
          font-size: 13px;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 8px 0;
        }

        .rejection-box p {
          font-size: 13px;
          color: #7f1d1d;
          margin: 0;
        }

        @media (max-width: 768px) {
          .loan-manager-page {
            padding: 70px 16px 16px 16px;
          }
          .stats-row {
            grid-template-columns: 1fr;
          }
          .two-columns {
            grid-template-columns: 1fr;
          }
          .action-buttons {
            flex-direction: column;
          }
          .modal-large {
            width: 95%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoanManager;