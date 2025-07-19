// src/pages/CartPage.js
import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Item</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.item_inventoryname}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>₹{item.price}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ₹{item.price * item.quantity}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: "red" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CartPage;
