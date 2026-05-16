import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import UserManagement from "../User/UserManagement";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [hours, setHours] = useState({});
  const [userStats, setUserStats] = useState({});
  const [leaveStats, setLeaveStats] = useState({});

  useEffect(() => {
    api.get("/users")
      .then(res => {
        setDevelopers(res.data.filter(u => u.role === "developer"));
        const stats = {};
        res.data.forEach(u => {
          stats[u.role] = (stats[u.role] || 0) + 1;
        });
        setUserStats(stats);
      });

    api.get("/attendance/all").then(res => setAttendance(res.data));

    api.get("/timesheet/all")
      .then(res => {
        const hourMap = {};
        res.data.forEach(t => {
          const uid = t.user?._id || t.user;
          hourMap[uid] = (hourMap[uid] || 0) + (t.hoursWorked || 0);
        });
        setHours(hourMap);
      });

    api.get("/leave/pending").then(res => setLeaveStats(ls => ({ ...ls, pending: res.data.length })));
    api.get("/leave/approved").then(res => setLeaveStats(ls => ({ ...ls, approved: res.data.length })));
  }, []);

  return (
    <div className="dashboard-section">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">Admins: {userStats.admin || 0}</div>
        <div className="stat-card">Managers: {userStats.manager || 0}</div>
        <div className="stat-card">Developers: {userStats.developer || 0}</div>
        <div className="stat-card">Pending Leaves: {leaveStats.pending || 0}</div>
        <div className="stat-card">Approved Leaves: {leaveStats.approved || 0}</div>
      </div>

      <div className="dashboard-welcome">
        Welcome, Admin. Use the sidebar to manage users, attendance, leaves, and timesheets.
      </div>
    </div>
  );
};

export default AdminDashboard;
