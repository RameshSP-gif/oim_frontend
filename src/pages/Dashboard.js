import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRole(res.data.role);
          setUser(res.data.username);
          if (res.data.role === "admin") fetchAdminData(token);
        })
        .catch(() => {
          setRole(null);
          setUser(null);
        });
    }
  }, []);

  const fetchAdminData = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard/kpis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const renderContent = () => {
    if (!role) return <p>Please log in to see your dashboard.</p>;

    if (role === "admin") {
      return (
        <>
          <h2 className="mb-4">Admin Dashboard</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="card bg-primary text-white mb-3">
                <div className="card-body">
                  <h5>Total Users</h5>
                  <p className="h4">{data.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white mb-3">
                <div className="card-body">
                  <h5>Total Orders</h5>
                  <p className="h4">{data.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white mb-3">
                <div className="card-body">
                  <h5>Total Sales</h5>
                  <p className="h4">${data.totalSales}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark mb-3">
                <div className="card-body">
                  <h5>Pending Orders</h5>
                  <p className="h4">{data.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    // Content for other user roles
    return (
      <div>
        <h2 className="mb-4">Welcome, {user}</h2>
        {role === "branch_user" && <p>🔸 You can place and view branch orders.</p>}
        {role === "inventory_user" && <p>🔸 You can manage and update inventory.</p>}
        {role === "supplier" && <p>🔸 You can fulfill and manage supply requests.</p>}
        {role === "store_user" && <p>🔸 You can receive and track store deliveries.</p>}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      {renderContent()}
    </div>
  );
}

export default Dashboard;
