import { useState } from "react";
import axios from "axios";

function EmployeeLoan() {
  const [form, setForm] = useState({
    employer: "",
    employeeId: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.employer || !form.amount) {
      alert("Jaza Employer na Amount");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/loans",
        {
          name: form.employer,
          amount: form.amount,
          type: "employee",

          details: {
            employeeId: form.employeeId,
          },
        }
      );

      console.log(res.data);

      alert("Loan submitted successfully");

      setForm({
        employer: "",
        employeeId: "",
        amount: "",
      });

    } catch (error: any) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Failed to submit loan"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="card">

        <div className="header">
          <h1>Employee Loan</h1>
          <p>Submit loan request for employee</p>
        </div>

        <form onSubmit={handleSubmit} className="form">

          <div className="input-box">
            <input
              name="employer"
              value={form.employer}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Employer Name</label>
          </div>

          <div className="input-box">
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Employee ID</label>
          </div>

          <div className="input-box">
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Loan Amount (TZS)</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>

      </div>

      <style>{`
        .page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          padding: 20px;
        }

        .card {
          width: 420px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          border-radius: 18px;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          color: white;
        }

        .header h1 {
          margin: 0;
          font-size: 22px;
        }

        .header p {
          font-size: 13px;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-box {
          position: relative;
        }

        input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          outline: none;
          background: rgba(15,23,42,0.9);
          color: white;
        }

        input:focus {
          box-shadow: 0 0 0 2px #22d3ee;
        }

        label {
          position: absolute;
          left: 12px;
          top: 14px;
          color: #94a3b8;
          transition: 0.2s;
          pointer-events: none;
        }

        input:focus + label,
        input:not(:placeholder-shown) + label {
          top: -10px;
          left: 10px;
          font-size: 11px;
          background: #0f172a;
          padding: 0 6px;
          color: #22d3ee;
        }

        button {
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
}

export default EmployeeLoan;