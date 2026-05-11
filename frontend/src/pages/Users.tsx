import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "loan_officer",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users", {
        headers: getAuthHeaders()
      });
      setUsers(res.data);
    } catch (err: any) {
      console.error("Fetch error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      if (editUser) {
        const payload: any = {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        };
        if (newUser.password) payload.password = newUser.password;

        const res = await axios.put(`http://127.0.0.1:8000/api/v1/users/${editUser.id}`, payload, {
          headers: getAuthHeaders()
        });
        setUsers(users.map(u => u.id === editUser.id ? res.data : u));
        alert("User updated successfully!");
      } else {
        if (!newUser.password) {
          alert("Password is required for new user!");
          return;
        }

        const res = await axios.post("http://127.0.0.1:8000/api/v1/users", {
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
        }, {
          headers: getAuthHeaders()
        });
        
        setUsers([...users, res.data]);
        alert(`User created! Email: ${newUser.email}, Password: ${newUser.password}`);
      }
      resetModal();
    } catch (err: any) {
      console.error("Save error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/users/${id}`, {
        headers: getAuthHeaders()
      });
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const startEdit = (user: User) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role,
    });
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditUser(null);
    setNewUser({ name: "", email: "", phone: "", password: "", role: "loan_officer" });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "#8b5cf6",
      loan_officer: "#10b981",
      loan_manager: "#3b82f6",
      general_manager: "#f59e0b",
      managing_director: "#ef4444",
    };
    return colors[role] || "#64748b";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      loan_officer: "Loan Officer",
      loan_manager: "Loan Manager",
      general_manager: "General Manager",
      managing_director: "Managing Director",
    };
    return labels[role] || role;
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>👥 Users Management</h1>
          <div className="actions">
            <input type="text" placeholder="Search user..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="add-btn" onClick={() => { setEditUser(null); setNewUser({ name: "", email: "", phone: "", password: "", role: "loan_officer" }); setShowModal(true); }}>+ Add User</button>
          </div>
        </div>

        {loading ? <p>Loading users...</p> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td><span className="role-badge" style={{ background: getRoleBadgeColor(user.role) }}>{getRoleLabel(user.role)}</span></td>
                    <td><button className="edit" onClick={() => startEdit(user)}>✏️ Edit</button><button className="delete" onClick={() => deleteUser(user.id)}>🗑️ Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={resetModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{editUser ? "✏️ Edit User" : "➕ Add New User"}</h2>
            <input placeholder="Full Name *" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input placeholder="Email *" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
            <input placeholder={editUser ? "New Password (optional)" : "Password *"} type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="loan_officer">Loan Officer</option>
              <option value="loan_manager">Loan Manager</option>
              <option value="general_manager">General Manager</option>
              <option value="managing_director">Managing Director</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions"><button onClick={saveUser} className="save">{editUser ? "Update" : "Create"}</button><button onClick={resetModal} className="cancel">Cancel</button></div>
          </div>
        </div>
      )}

      <style>{`
        .page { min-height: 100vh; background: #f3f4f6; padding: 30px; display: flex; justify-content: center; }
        .card { width: 100%; max-width: 1300px; background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .header h1 { margin: 0; font-size: 24px; color: #0f172a; }
        .actions { display: flex; gap: 10px; }
        .actions input { padding: 10px 15px; border: 1px solid #d1d5db; border-radius: 10px; width: 250px; }
        .add-btn { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #0f172a; color: white; padding: 14px; text-align: left; }
        td { padding: 14px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f8fafc; }
        .role-badge { padding: 5px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: 600; }
        .edit { background: #3b82f6; color: white; border: none; padding: 6px 12px; margin-right: 5px; border-radius: 8px; cursor: pointer; }
        .delete { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-box { background: white; padding: 30px; border-radius: 20px; width: 450px; max-width: 90%; display: flex; flex-direction: column; gap: 15px; }
        .modal-box h2 { margin: 0 0 10px 0; color: #0f172a; }
        .modal-box input, .modal-box select { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
        .save { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .cancel { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        @media (max-width: 768px) { .page { padding: 15px; } .card { padding: 15px; } .header { flex-direction: column; align-items: stretch; } .actions { flex-direction: column; } .actions input { width: 100%; } }
      `}</style>
    </div>
  );
};

export default Users;