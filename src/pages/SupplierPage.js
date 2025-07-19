import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierPage = ({ user }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", address: "" });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/suppliers");
    setSuppliers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/suppliers", form);
    setForm({ name: "", contact: "", address: "" });
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/uppliers/${id}`);
    fetchSuppliers();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/suppliers/${id}`, form);
    fetchSuppliers();
  };

  return (
    <div class="container">
      <h2>Supplier Page - Welcome {user}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Contact" value={form.contact}
               onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        <input placeholder="Address" value={form.address}
               onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button type="submit">Add Supplier</button>
      </form>

      <ul>
        {suppliers.map(s => (
          <li key={s.id}>
            {s.name} - {s.contact} - {s.address}
            <button onClick={() => setForm(s)}>Edit</button>
            <button onClick={() => handleUpdate(s.id)}>Update</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierPage;
