import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    supplier_name: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const branches = ["Main Branch", "City Branch", "Downtown Branch"];

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInventory(res.data);
    } catch (err) {
      alert("Error fetching inventory: " + err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert("Error fetching orders: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item_name, quantity, supplier_name, price } = formData;

    if (!item_name || !quantity || !supplier_name || !price) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const endpoint = editingId
        ? `http://localhost:5000/inventory/${editingId}`
        : "http://localhost:5000/inventory";

      const method = editingId ? axios.put : axios.post;

      await method(
        endpoint,
        {
          item_name,
          quantity: parseInt(quantity),
          supplier_name,
          price: parseFloat(price),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert(editingId ? "Item updated!" : "Item added!");
      setFormData({ item_name: "", quantity: "", supplier_name: "", price: "" });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      alert("Failed to save item: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      supplier_name: item.supplier_name,
      price: item.price,
    });
    setEditingId(item.id);
  };

  const handleRequest = async (item) => {
    const quantity = prompt(`Enter quantity to request for ${item.item_name}:`);
    if (!quantity || isNaN(quantity)) return;

    try {
      await axios.post(
        "http://localhost:5000/inventory/request",
        {
          item_id: item.id,
          item_name: item.item_name,
          quantity: parseInt(quantity),
          branch: localStorage.getItem("branch"),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Requested ${quantity} of ${item.item_name}`);
    } catch (err) {
      alert("Request failed: " + err.message);
    }
  };

  const handleIssue = async (item) => {
    const quantity = prompt("Quantity to issue:");
    if (!quantity || isNaN(quantity)) return;

    if (parseInt(quantity) > item.quantity) {
      alert("Not enough stock");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/inventory/${item.id}`,
        {
          ...item,
          quantity: item.quantity - parseInt(quantity),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Issued item");
      fetchInventory();
    } catch (err) {
      alert("Issue failed: " + err.message);
    }
  };

  const handleTransfer = async (item) => {
    const quantity = prompt("Quantity to transfer:");
    const branch = prompt("Target branch:");
    if (!branches.includes(branch)) return alert("Invalid branch");

    try {
      await axios.post(
        "http://localhost:5000/inventory/transfer",
        {
          item_id: item.id,
          item_name: item.item_name,
          quantity: parseInt(quantity),
          from_branch: localStorage.getItem("branch"),
          to_branch: branch,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Transfer completed");
    } catch (err) {
      alert("Transfer failed: " + err.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Order updated");
      fetchOrders();
    } catch (err) {
      alert("Failed to update order");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Inventory Management</h2>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Item Name" name="item_name" value={formData.item_name} onChange={handleInputChange} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Quantity" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Supplier Name" name="supplier_name" value={formData.supplier_name} onChange={handleInputChange} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Price" type="number" name="price" value={formData.price} onChange={handleInputChange} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">{editingId ? "Update" : "Add"}</button>
        </div>
      </form>

      <h4>📦 Inventory</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Name</th><th>Qty</th><th>Supplier</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td><td>{item.item_name}</td><td>{item.quantity}</td><td>{item.supplier_name}</td><td>₹{item.price}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-info btn-sm me-1" onClick={() => handleRequest(item)}>Request</button>
                  <button className="btn btn-secondary btn-sm me-1" onClick={() => handleIssue(item)}>Issue</button>
                  <button className="btn btn-success btn-sm" onClick={() => handleTransfer(item)}>Transfer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="mt-5">📝 Orders</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Price</th><th>Transaction</th><th>Payment</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td><td>{order.customer_name}</td><td>{order.product_name}</td><td>{order.quantity}</td><td>₹{order.price}</td>
                <td>{order.transaction_id}</td><td>{order.payment_method}</td><td>{order.status || "Pending"}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(order.id, "Processed")}>Mark Processed</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
