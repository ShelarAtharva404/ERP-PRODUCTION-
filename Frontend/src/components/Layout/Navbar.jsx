// src/components/Layout/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="erp-navbar">
      <div className="erp-navbar-logo">
        
        <span className="erp-navbar-title">IT Company ERP</span>
      </div>
      <div className="erp-navbar-user">
        <span className="erp-navbar-username">{user?.fullname || "User"}</span>
        <button onClick={handleLogout} className="erp-navbar-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
