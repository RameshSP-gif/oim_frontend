import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const OrderPage = () => {
  const { cart, setCart } = useCart();
  const [customerName] = useState(localStorage.getItem("username") || "");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://oim-backend-production.up.railway.app/inventory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products: " + err.message);
    }
  };

  const addToCart = (product, quantity) => {
    if (!quantity || quantity < 1) return alert("Enter a valid quantity.");
    if (quantity > product.quantity)
      return alert(`Only ${product.quantity} units available.`);

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateCartQty = (id, quantity) => {
    if (quantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  const placeOrder = async () => {
    if (!customerName || cart.length === 0) {
      alert("Login and add items to cart.");
      return;
    }

    for (const item of cart) {
      const stock = products.find((p) => p.id === item.id);
      if (!stock || stock.quantity < item.quantity)
        return alert(`Not enough stock for ${item.item_name}`);
    }

    try {
      for (const item of cart) {
        const orderData = {
          customer_name: customerName,
          product_name: item.item_name,
          quantity: item.quantity,
          price: item.price * item.quantity,
          transaction_id: "TXN-" + Math.floor(Math.random() * 1000000),
          payment_method: paymentMethod,
          status: "Pending",
        };

        await axios.post("https://oim-backend-production.up.railway.app/orders", orderData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const stock = products.find((p) => p.id === item.id);
        const newQty = stock.quantity - item.quantity;

        await axios.put(
          `https://oim-backend-production.up.railway.app/inventory/${item.id}`,
          {
            store: stock.store,
            item_name: item.item_name,
            quantity: newQty,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      alert("Order placed successfully!");
      setCart([]);
      fetchProducts();
    } catch (err) {
      console.error("Order error:", err);
      alert(
        "Error placing order: " +
          (err.response?.data?.msg || err.message || "Unknown error")
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container my-4">
      <h2 className="mb-4">🛒 Place Your Order</h2>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            value={customerName}
            readOnly
            placeholder="Customer Name"
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">{product.item_name}</h5>
                  <p className="card-text">₹{product.price}</p>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    placeholder="Qty"
                    className="form-control mb-2"
                    onChange={(e) =>
                      (product.tempQty = parseInt(e.target.value))
                    }
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addToCart(product, product.tempQty)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr />

      <h4>Cart Items</h4>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="form-control"
                      onChange={(e) =>
                        updateCartQty(item.id, e.target.value)
                      }
                    />
                  </td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total</td>
                <td colSpan="2" className="fw-bold">₹{cartTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {cart.length > 0 && (
        <div className="text-end">
          <button className="btn btn-success" onClick={placeOrder}>
            ✅ Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
