// src/components/Dashboard/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [hours, setHours] = useState({});

  useEffect(() => {
    api.get("/users")
      .then(res => setDevelopers(res.data.filter(u => u.role === "developer")));
  }, []);

  useEffect(() => {
    api.get("/attendance/all").then(res => setAttendance(res.data));
    api.get("/timesheet/all")
      .then(res => {
        const hourMap = {};
        res.data.forEach(t => {
          const uid = t.user?._id || t.user;
          if (!hourMap[uid]) hourMap[uid] = 0;
          hourMap[uid] += t.hoursWorked || 0;
        });
        setHours(hourMap);
      });
  }, []);

  useEffect(() => {
    if (selectedDev) {
      api.get(`/timesheet/assigned/${selectedDev}`)
        .then(res => setAssignedTasks(res.data));
    } else {
      setAssignedTasks([]);
    }
  }, [selectedDev]);

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!selectedDev || !taskTitle) {
      Swal.fire("Error", "Select developer and enter task title", "error");
      return;
    }
    api.post("/timesheet/assign", { assignedTo: selectedDev, taskTitle, dueDate })
      .then(() => {
        Swal.fire("Success", "Task assigned!", "success");
        setTaskTitle("");
        setDueDate("");
        return api.get(`/timesheet/assigned/${selectedDev}`);
      })
      .then(res => setAssignedTasks(res.data));
  };

  return (
    <div className="manager-dashboard-container">
      <h2 className="manager-dashboard-title">Manager Dashboard</h2>
      <p>
        Welcome, Manager. Use the sidebar to assign tasks, approve leaves, and view team attendance.
      </p>
      {/* Optionally add summary widgets here */}
    </div>
  );
};

export default ManagerDashboard;
