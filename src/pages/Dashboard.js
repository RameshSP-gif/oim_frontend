import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
        .get("https://oim-backend-production.up.railway.app/auth/me", {
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
      const res = await axios.get("https://oim-backend-production.up.railway.app/dashboard/kpis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  const renderCharts = () => {
    const pieData = [
      { name: "Completed Orders", value: data.totalOrders - data.pendingOrders },
      { name: "Pending Orders", value: data.pendingOrders },
    ];

    const barData = [
      {
        name: "Sales Overview",
        Sales: data.totalSales,
        Orders: data.totalOrders,
        Users: data.totalUsers,
      },
    ];

    return (
      <div className="row mt-4">
        <div className="col-md-6">
          <h5 className="text-center">Order Status</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6">
          <h5 className="text-center">KPI Comparison</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#8884d8" />
              <Bar dataKey="Orders" fill="#82ca9d" />
              <Bar dataKey="Users" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
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

          {/* Charts */}
          {renderCharts()}
        </>
      );
    }

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

  return <div className="container mt-4">{renderContent()}</div>;
}

export default Dashboard;
