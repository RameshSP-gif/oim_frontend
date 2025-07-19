import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./assets/mcc_logo.jpg";


import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

import OrderPage from "./pages/OrderPage";
import InventoryPage from "./pages/InventoryPage";
import SupplierPage from "./pages/SupplierPage";
import StorePage from "./pages/StorePage";
import AdminPage from "./pages/AdminPage";
import OrderList from "./pages/OrdersListPage";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Dashboard points to AdminDashboard

function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://oim-backend-production.up.railway.app/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRole(res.data.role);
          setUser(res.data.username);
        })
        .catch(() => {
          setRole(null);
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">    
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src={logo} alt="MCC Logo" height="400" width="500" className="me-2"  />
                          Order & Inventory System
</Link>
</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon" />
          </button>
      

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user && (
                <>
                  {role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                  )}

                  {(role === "admin" || role === "branch_user") && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">Place Order</Link>
                    </li>
                  )}

                  {(role === "admin" || role === "branch_user" || role === "inventory_user") && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/order-list">Order List</Link>
                    </li>
                  )}

                  {(role === "admin" || role === "inventory_user") && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">Inventory</Link>
                    </li>
                  )}

                  {(role === "admin" || role === "supplier") && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/supplier">Supplier</Link>
                    </li>
                  )}

                  {(role === "admin" || role === "store_user") && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/store">Store</Link>
                    </li>
                  )}

                  {role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                  )}
                </>
              )}
            </ul>

            <ul className="navbar-nav">
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link disabled">Welcome, {user}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Login setRole={setRole} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute role={role} allowed={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute role={role} allowed={["admin", "branch_user"]}>
              <OrderPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/order-list" element={
            <ProtectedRoute role={role} allowed={["admin", "branch_user", "inventory_user"]}>
              <OrderList />
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute role={role} allowed={["admin", "inventory_user"]}>
              <InventoryPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/supplier" element={
            <ProtectedRoute role={role} allowed={["admin", "supplier"]}>
              <SupplierPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/store" element={
            <ProtectedRoute role={role} allowed={["admin", "store_user"]}>
              <StorePage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute role={role} allowed={["admin"]}>
              <AdminPage user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
