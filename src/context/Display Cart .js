// Example: Show cart summary
import { useCart } from "../context/CartContext";

const CartSummary = () => {
  const { cartItems } = useCart();

  return (
    <div>
      <h2>Cart Items: {cartItems.length}</h2>
      <ul>
        {cartItems.map((item, i) => (
          <li key={i}>{item.item_name} - ₹{item.price}</li>
        ))}
      </ul>
    </div>
  );
};
