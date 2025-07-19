import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import 'chart.js/auto';
import { Card } from "react-bootstrap";

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/dashboard/kpis", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };
    fetchDashboardData();
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="container">
      <h3 className="mb-4">Admin Dashboard</h3>

      <div className="row g-3">
        {[
          { label: "Total Orders", value: data.totalOrders ?? 0 },
          { label: "Total Sales", value: `₹${data.totalSales ?? 0}` },
          { label: "Pending Orders", value: data.pendingOrders ?? 0 },
          { label: "Completed Orders", value: data.completedOrders ?? 0 },
          { label: "Cancelled Orders", value: data.cancelledOrders ?? 0 },
          { label: "Low Stock Items", value: data.lowStockItems ?? 0 },
        ].map((kpi, idx) => (
          <div className="col-md-4" key={idx}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>{kpi.label}</Card.Title>
                <Card.Text className="fs-4 fw-bold">{kpi.value}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <div className="row g-4">
        <div className="col-md-6">
          <h5>Orders Over Time</h5>
          <Line
            data={{
              labels: data.ordersOverTime?.map((d) => d.date) || [],
              datasets: [{
                label: "Orders",
                data: data.ordersOverTime?.map((d) => d.count) || [],
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "#007bff",
              }],
            }}
          />
        </div>

        <div className="col-md-6">
          <h5>Order Status Distribution</h5>
          <Pie
            data={{
              labels: ["Pending", "Completed", "Cancelled"],
              datasets: [{
                data: [
                  data.pendingOrders ?? 0,
                  data.completedOrders ?? 0,
                  data.cancelledOrders ?? 0,
                ],
                backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
              }],
            }}
          />
        </div>

        <div className="col-md-12">
          <h5>Top Selling Products</h5>
          <Bar
            data={{
              labels: data.topProducts?.map((p) => p.product_name) || [],
              datasets: [{
                label: "Quantity Sold",
                data: data.topProducts?.map((p) => p.total_quantity) || [],
                backgroundColor: "#17a2b8",
              }],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
