// src/components/Forms/TimesheetForm.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import './TimesheetForm.css';
import { useAuth } from "../../context/AuthContext";
import DataTable from "react-data-table-component";

const TimesheetForm = () => {
  const [hours, setHours] = useState("");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const { user } = useAuth();
  const [myTimesheets, setMyTimesheets] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTimesheets = () => {
    if (!user || !user.id) return; // Prevent API call if user or user.id is not loaded
    api.get(`/timesheet/${user.id}`)
      .then(res => {
        setMyTimesheets(res.data);
        const total = res.data.reduce((sum, t) => sum + (t.hoursWorked || 0), 0);
        setTotalHours(total);
      });
  };

  useEffect(() => {
    fetchTimesheets();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.id) return; // Prevent API call if user or user.id is not loaded
    api.post("/timesheet", { date, tasks: task, hoursWorked: hours })
      .then(() => {
        Swal.fire("Success", "Timesheet submitted!", "success");
        setTask("");
        setHours("");
        setDate("");
        fetchTimesheets();
      })
      .catch(() => Swal.fire("Error", "Failed to submit timesheet.", "error"));
  };

  const timesheetColumns = [
    { name: "Date", selector: row => row.date?.slice(0,10), sortable: true },
    { name: "Task", selector: row => row.tasks, sortable: true },
    { name: "Hours", selector: row => row.hoursWorked, sortable: true },
    { name: "Status", selector: row => row.status, sortable: true }
  ];

  const filteredTimesheets = myTimesheets.filter(row =>
    (row.tasks || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.date || "").includes(search) ||
    (row.status || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="timesheet-form-container">
      <h2 className="timesheet-form-title">Submit Timesheet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="timesheet-form-input"
          required
        />
        <input
          type="text"
          placeholder="Task Description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="timesheet-form-input"
          required
        />
        <input
          type="number"
          placeholder="Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="timesheet-form-input"
          required
        />
        <button type="submit" className="timesheet-form-btn">
          Submit
        </button>
      </form>
      <div className="timesheet-form-message">
        Total Hours Worked: <b>{totalHours}</b>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h3>Your Submitted Timesheets</h3>
        <input
          type="text"
          placeholder="Search timesheets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 12, padding: 6, width: "100%", maxWidth: 300 }}
        />
        <DataTable
          columns={timesheetColumns}
          data={filteredTimesheets}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default TimesheetForm;
