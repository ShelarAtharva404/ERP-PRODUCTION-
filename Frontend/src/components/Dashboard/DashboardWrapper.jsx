// src/components/Dashboard/DashboardWrapper.jsx
import React, { useContext } from "react";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import '../Layout/Sidebar.css';
import '../Layout/Navbar.css';

const DashboardWrapper = () => {
  const { user } = useContext(AuthContext);

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "manager":
        return <ManagerDashboard />;
      case "developer":
        return <DeveloperDashboard />;
      default:
        return <p className="p-6">Unauthorized or no role assigned.</p>;
    }
  };

  return (
    <div className="erp-dashboard-layout" style={{ display: "flex" }}>
      <Sidebar />
      <div
        className="dashboard-main-content"
        style={{
          flex: 1,
          marginLeft: 220,
          minHeight: "100vh",
          background: "#f9fafb",
          width: "100%",
          transition: "margin-left 0.3s",
        }}
      >
        <Navbar />
        <main style={{ padding: "2rem", width: "100%", boxSizing: "border-box" }}>
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default DashboardWrapper;
