import React from "react";
import "./DeveloperDashboard.css"; // make sure to import the CSS file

const DeveloperDashboard = () => (
  <div className="developer-dashboard">
    <h2>Developer Dashboard</h2>
    <p>
      Welcome, Developer. Use the sidebar to clock in/out, submit timesheets, and apply for leave.
    </p>
    {/* Optionally add summary widgets here */}
  </div>
);

export default DeveloperDashboard;
