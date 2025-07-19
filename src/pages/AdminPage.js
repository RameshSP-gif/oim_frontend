import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      await axios.post("http://localhost:5000/users", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ username: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("Add user failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      await axios.put(`http://localhost:5000/users/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ username: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update user failed:", err);
    }
  };

  return (
    <div className="container">
      <h2>Admin Page - Manage Users</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <select
          className="form-select mb-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="branch_user">Branch User</option>
          <option value="inventory_user">Inventory User</option>
          <option value="store_user">Store User</option>
          <option value="supplier">Supplier</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {form.id ? "Update User" : "Add User"}
        </button>
      </form>

      <ul className="list-group">
        {users.map((u) => (
          <li className="list-group-item d-flex justify-content-between" key={u.id}>
            <span>{u.username} - {u.role}</span>
            <div>
              <button className="btn btn-sm btn-secondary me-2" onClick={() => setForm(u)}>Edit</button>
              <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(u.id)}>Update</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
