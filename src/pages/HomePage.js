import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/mcc_logo.jpg"; // adjust path if needed
import "./HomePage.css";

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <img src={logo} alt="MCC Bank Logo" className="homepage-logo" />
        <h1>Welcome to MCC Bank</h1>
        <p className="subtitle">Order & Inventory Management System</p>

        {loggedIn ? (
          <>
            <div className="nav-links">
              <Link className="btn btn-primary me-3" to="/orders">Order Management</Link>
              <Link className="btn btn-primary me-3" to="/inventory">Inventory Management</Link>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <div className="nav-links">
            <Link className="btn btn-success me-3" to="/login">Login</Link>
            <Link className="btn btn-outline-light" to="/register">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
