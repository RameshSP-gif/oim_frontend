import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const [formData, setFormData] = useState({
    customer_name: "",
    product_name: "",
    quantity: "",
    price: "",
    status: "",
    transaction_id: "",
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://oim-backend-production.up.railway.app/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleProcessOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://oim-backend-production.up.railway.app/orders/${id}`,
        { status: "Processed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order marked as Processed");
      fetchOrders();
    } catch (err) {
      alert("Failed to process order: " + err.message);
    }
  };

  const handleSearchAndSort = useCallback(() => {
    let results = [...orders];

    if (searchTerm) {
      results = results.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredOrders(results);
  }, [orders, searchTerm, sortConfig]);

  useEffect(() => {
    handleSearchAndSort();
  }, [handleSearchAndSort]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://oim-backend-production.up.railway.app/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEdit = (order) => {
    setEditOrderId(order.id);
    setFormData({
      customer_name: order.customer_name,
      product_name: order.product_name,
      quantity: order.quantity,
      price: order.price,
      status: order.status,
      transaction_id: order.transaction_id,
    });
  };

  const cancelEdit = () => {
    setEditOrderId(null);
    setFormData({
      customer_name: "",
      product_name: "",
      quantity: "",
      price: "",
      status: "",
      transaction_id: "",
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://oim-backend-production.up.railway.app/orders/${editOrderId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      cancelEdit();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sortArrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h3>Order List</h3>
        <Link to="/orders" className="btn btn-primary">
          Place New Order
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by customer or product..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID {sortArrow("id")}
            </th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Transaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No matching orders
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                {editOrderId === order.id ? (
                  <>
                    <td>
                      <input
                        className="form-control"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="form-control"
                        value={formData.transaction_id}
                        disabled
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.price}</td>
                    <td>{order.status}</td>
                    <td>{order.transaction_id}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => startEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                      {role === "inventoryuser" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleProcessOrder(order.id)}
                        >
                          Process
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
