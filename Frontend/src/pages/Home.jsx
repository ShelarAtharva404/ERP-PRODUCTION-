import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home-container">
    <div className="home-content">
      {/* Floating emoji for friendly vibe */}
      <div style={{ fontSize: "3.5rem", marginBottom: "0.6rem", animation: "floatUpDown 4s ease-in-out infinite" }}>
        🚀
      </div>

      <h1 className="home-title">Welcome to IT Company ERP</h1>
      <p className="home-message">
        Manage your employees, projects, timesheets, and more with our professional ERP system.
      </p>
      <Link className="home-link" to="/login">
        Go to Login
      </Link>
    </div>
  </div>
);

export default Home;
