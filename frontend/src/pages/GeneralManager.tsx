import { useEffect, useState } from "react";
import axios from "axios";

interface Loan {
  id: number;
  name: string;
  amount: number;
  type: string;
  status: string;
  rejection_reason?: string;
  details?: any;
  created_at?: string;
}

const GeneralManager = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLoan, setSelectedLoan] =
    useState<Loan | null>(null);

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [rejectReason, setRejectReason] =
    useState("");

  // ✅ ONGEZA HII FUNCTION - KUPATA TOKEN
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // FETCH LOANS - ✅ ONGEZA TOKEN
  const fetchLoans = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/loans/gm",
        { headers: getAuthHeaders() }
      );

      console.log("GM Loans fetched:", res.data.length);
      setLoans(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // APPROVE - ✅ ONGEZA TOKEN
  const approveLoan = async (id: number) => {
    const confirmApprove = window.confirm(
      "Approve this loan and send to Managing Director?"
    );

    if (!confirmApprove) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/loans/${id}/approve`,
        {},
        { headers: getAuthHeaders() }
      );

      alert(
        "✅ Loan approved and sent to Managing Director"
      );

      fetchLoans();
    } catch (error) {
      console.log(error);
      alert("Failed to approve loan");
    }
  };

  // OPEN REJECT
  const openRejectModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // REJECT - ✅ ONGEZA TOKEN
  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/loans/${selectedLoan?.id}/reject`,
        {
          reason: rejectReason,
        },
        { headers: getAuthHeaders() }
      );

      alert(
        "❌ Loan rejected and returned to Loan Manager"
      );

      setShowRejectModal(false);

      fetchLoans();
    } catch (error) {
      console.log(error);
      alert("Failed to reject loan");
    }
  };

  // VIEW DETAILS
  const viewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  return (
    <div className="gm-page">

      {/* HEADER */}
      <div className="top-header">

        <div>
          <h1>🏦 General Manager Dashboard</h1>

          <p>
            Review applications from Loan Manager
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchLoans}
        >
          🔄 Refresh
        </button>

      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stats-card">
          <span>Total Requests</span>
          <h2>{loans.length}</h2>
        </div>

        <div className="stats-card">
          <span>Current Stage</span>
          <h2>GM Review</h2>
        </div>

        <div className="stats-card">
          <span>Pending Approval</span>
          <h2>{loans.length}</h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="table-card">

        <div className="table-header">
          <h2>Loan Applications</h2>
        </div>

        {loading ? (
          <div className="empty-box">
            Loading applications...
          </div>
        ) : loans.length === 0 ? (
          <div className="empty-box">

            <h3>No Loan Requests</h3>

            <p>
              No applications received from Loan
              Manager
            </p>

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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {loans.map((loan, index) => (
                  <tr key={loan.id}>

                    <td>{index + 1}</td>

                    <td>
                      <div className="client-box">

                        <strong>{loan.name}</strong>

                        <button
                          className="details-btn"
                          onClick={() =>
                            viewDetails(loan)
                          }
                        >
                          👁 View Details
                        </button>

                      </div>
                    </td>

                    <td className="amount">
                      TZS{" "}
                      {Number(
                        loan.amount
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span className="loan-type">
                        {loan.type}
                      </span>
                    </td>

                    <td>
                      <span className="status gm">
                        GM Review
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="approve-btn"
                          onClick={() =>
                            approveLoan(loan.id)
                          }
                        >
                          ✔ Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            openRejectModal(loan)
                          }
                        >
                          ✖ Reject
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowRejectModal(false)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>❌ Reject Loan</h2>

            <div className="modal-info">

              <p>
                <strong>Client:</strong>{" "}
                {selectedLoan?.name}
              </p>

              <p>
                <strong>Amount:</strong> TZS{" "}
                {Number(
                  selectedLoan?.amount
                ).toLocaleString()}
              </p>

            </div>

            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
            />

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowRejectModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                onClick={submitRejection}
              >
                Confirm Reject
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal && selectedLoan && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowDetailsModal(false)
          }
        >

          <div
            className="modal details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="details-header">

              <div>

                <h2>
                  📄 Loan Application Details
                </h2>

                <p>
                  Complete information submitted
                  by applicant
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowDetailsModal(false)
                }
              >
                ✖
              </button>

            </div>

            {/* BASIC DETAILS */}
            <div className="details-section">

              <h3>
                👤 Applicant Information
              </h3>

              <div className="details-grid">

                <div className="detail-card">
                  <span>Full Name</span>
                  <strong>
                    {selectedLoan.name}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Loan Amount</span>
                  <strong>
                    TZS{" "}
                    {Number(
                      selectedLoan.amount
                    ).toLocaleString()}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Loan Type</span>
                  <strong>
                    {selectedLoan.type}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Status</span>
                  <strong>
                    {selectedLoan.status}
                  </strong>
                </div>

                {selectedLoan.created_at && (
                  <div className="detail-card">
                    <span>
                      Application Date
                    </span>

                    <strong>
                      {new Date(
                        selectedLoan.created_at
                      ).toLocaleString()}
                    </strong>
                  </div>
                )}

              </div>

            </div>

            {/* FULL FORM DATA */}
            {selectedLoan.details && (
              <div className="details-section">

                <h3>
                  📑 Complete Application Data
                </h3>

                <div className="application-grid">

                  {Object.entries(
                    selectedLoan.details
                  ).map(([key, value]) => (

                    <div
                      className="application-card"
                      key={key}
                    >

                      <span>
                        {key
                          .replace(/_/g, " ")
                          .replace(
                            /\b\w/g,
                            (c) =>
                              c.toUpperCase()
                          )}
                      </span>

                      <strong>
                        {typeof value ===
                        "object"
                          ? JSON.stringify(
                              value
                            )
                          : String(value)}
                      </strong>

                    </div>

                  ))}

                </div>

              </div>
            )}

            {/* REJECTION */}
            {selectedLoan.rejection_reason && (
              <div className="reason-box">

                <h3>
                  ❌ Rejection Reason
                </h3>

                <p>
                  {
                    selectedLoan.rejection_reason
                  }
                </p>

              </div>
            )}

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowDetailsModal(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      <style>{`

        *{
          box-sizing:border-box;
        }

        .gm-page{
           padding: 80px 30px 30px 30px;
          min-height:100vh;
          background:#f8fafc;
        }

        .top-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
          gap:20px;
        }

        .top-header h1{
          margin:0;
          color:#0f172a;
          font-size:32px;
        }

        .top-header p{
          margin-top:8px;
          color:#64748b;
        }

        .refresh-btn{
          border:none;
          background:#2563eb;
          color:white;
          padding:12px 20px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:20px;
          margin-bottom:25px;
        }

        .stats-card{
          background:white;
          padding:25px;
          border-radius:20px;
          box-shadow:0 10px 25px rgba(0,0,0,0.05);
        }

        .stats-card span{
          color:#64748b;
          font-size:14px;
        }

        .stats-card h2{
          margin-top:10px;
          color:#0f172a;
          font-size:30px;
        }

        .table-card{
          background:white;
          border-radius:20px;
          padding:25px;
          box-shadow:0 10px 25px rgba(0,0,0,0.05);
        }

        .table-header{
          margin-bottom:20px;
        }

        .table-header h2{
          margin:0;
          color:#0f172a;
        }

        .table-wrapper{
          overflow-x:auto;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          background:#0f172a;
          color:white;
          padding:15px;
          text-align:left;
          font-size:14px;
        }

        td{
          padding:16px;
          border-bottom:1px solid #e2e8f0;
        }

        tr:hover{
          background:#f8fafc;
        }

        .client-box{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .details-btn{
          border:none;
          background:none;
          color:#2563eb;
          cursor:pointer;
          text-align:left;
          padding:0;
          font-size:13px;
          font-weight:600;
        }

        .amount{
          color:#16a34a;
          font-weight:700;
        }

        .loan-type{
          background:#e2e8f0;
          padding:6px 12px;
          border-radius:999px;
          font-size:12px;
          font-weight:600;
        }

        .status{
          padding:6px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:700;
        }

        .status.gm{
          background:#dbeafe;
          color:#1d4ed8;
        }

        .action-buttons{
          display:flex;
          gap:10px;
        }

        .approve-btn{
          border:none;
          background:#22c55e;
          color:white;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        }

        .approve-btn:hover{
          background:#16a34a;
        }

        .reject-btn{
          border:none;
          background:#ef4444;
          color:white;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        }

        .reject-btn:hover{
          background:#dc2626;
        }

        .empty-box{
          text-align:center;
          padding:60px 20px;
          color:#64748b;
        }

        /* MODALS */

        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.7);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:1000;
          padding:20px;
        }

        .modal{
          background:white;
          width:500px;
          max-width:100%;
          border-radius:20px;
          padding:25px;
        }

        .details-modal{
          width:950px;
          max-width:100%;
          max-height:92vh;
          overflow-y:auto;
        }

        .modal h2{
          margin-top:0;
          color:#0f172a;
        }

        .modal textarea{
          width:100%;
          min-height:130px;
          margin-top:20px;
          padding:15px;
          border-radius:12px;
          border:1px solid #cbd5e1;
          resize:none;
          outline:none;
          font-size:14px;
        }

        .modal-actions{
          display:flex;
          justify-content:flex-end;
          gap:12px;
          margin-top:20px;
        }

        .cancel-btn{
          border:none;
          background:#e2e8f0;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
        }

        .danger-btn{
          border:none;
          background:#ef4444;
          color:white;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
        }

        .details-header{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          border-bottom:1px solid #e2e8f0;
          padding-bottom:18px;
          margin-bottom:25px;
        }

        .details-header p{
          color:#64748b;
          margin-top:8px;
          font-size:14px;
        }

        .close-btn{
          border:none;
          background:#ef4444;
          color:white;
          width:40px;
          height:40px;
          border-radius:12px;
          cursor:pointer;
          font-weight:bold;
        }

        .details-section{
          margin-bottom:25px;
        }

        .details-section h3{
          margin-bottom:18px;
          color:#0f172a;
        }

        .details-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:15px;
        }

        .detail-card{
          background:#f8fafc;
          padding:18px;
          border-radius:16px;
          border:1px solid #e2e8f0;
        }

        .detail-card span{
          display:block;
          color:#64748b;
          font-size:13px;
          margin-bottom:8px;
        }

        .detail-card strong{
          color:#0f172a;
        }

        .application-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:15px;
        }

        .application-card{
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:16px;
          padding:18px;
          transition:0.2s;
        }

        .application-card:hover{
          transform:translateY(-3px);
          box-shadow:0 10px 20px rgba(0,0,0,0.05);
        }

        .application-card span{
          display:block;
          color:#64748b;
          font-size:13px;
          margin-bottom:8px;
        }

        .application-card strong{
          color:#0f172a;
          line-height:1.6;
          word-break:break-word;
        }

        .reason-box{
          margin-top:25px;
          background:#fef2f2;
          border:1px solid #fecaca;
          padding:20px;
          border-radius:16px;
        }

        .reason-box h3{
          margin-top:0;
          color:#dc2626;
        }

        .reason-box p{
          color:#7f1d1d;
          line-height:1.7;
        }

        @media(max-width:768px){

          .top-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .action-buttons{
            flex-direction:column;
          }

          .details-grid,
          .application-grid{
            grid-template-columns:1fr;
          }

        }

      `}</style>

    </div>
  );
};

export default GeneralManager;