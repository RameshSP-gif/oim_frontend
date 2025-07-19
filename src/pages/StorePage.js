import React, { useEffect, useState } from "react";
import axios from "axios";

const StorePage = ({ user }) => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ item: "", location: "", stockLevel: "" });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const res = await axios.get("http://localhost:5000/stores");
    setStores(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/stores", form);
    setForm({ item: "", location: "", stockLevel: "" });
    fetchStores();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/stores/${id}`);
    fetchStores();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/stores/${id}`, form);
    fetchStores();
  };

  return (
    <div class="container">
      <h2>Store Page - Welcome {user}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Item" value={form.item}
               onChange={(e) => setForm({ ...form, item: e.target.value })} />
        <input placeholder="Location" value={form.location}
               onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Stock Level" type="number" value={form.stockLevel}
               onChange={(e) => setForm({ ...form, stockLevel: e.target.value })} />
        <button type="submit">Add Item</button>
      </form>

      <ul>
        {stores.map(s => (
          <li key={s.id}>
            {s.item} - {s.location} - {s.stockLevel}
            <button onClick={() => setForm(s)}>Edit</button>
            <button onClick={() => handleUpdate(s.id)}>Update</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StorePage;
