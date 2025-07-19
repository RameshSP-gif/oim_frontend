// File: src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside
    style={{
      width: "200px",
      background: "#fff",
      padding: "20px",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      height: "100vh",
    }}
  >
    <h3>Menu</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
        <a href="/dashboard">Dashboard</a>
      </li>
      <li>
        <a href="/orders">Orders</a>
      </li>
      <li>
        <a href="/inventory">Inventory</a>
      </li>
      <li>
        <a href="/login">Logout</a>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
