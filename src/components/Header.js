import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/mcc_logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ toggleSidebar }) => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("branch");
    navigate("/login");
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-light me-3 d-lg-none"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={logo}
              alt="MCC Bank Logo"
              style={{ height: "5px", marginRight: "5px" }}
            />
            <span className="fw-bold fs-5">MCC Bank System</span>
          </Link>
        </div>

        <div className="collapse navbar-collapse justify-content-between">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orderslistpage"><b> Orders List</b></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inventory">Inventory</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">🛒 Cart ({totalItems})</Link>
            </li>
          </ul>

          {isLoggedIn && (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                👤 {username || "User"}
              </span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
