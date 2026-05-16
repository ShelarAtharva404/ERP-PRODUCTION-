import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import DataTable from "react-data-table-component";
import './AttendanceList.css';

const AttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [hoursMap, setHoursMap] = useState({});
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [summarySearch, setSummarySearch] = useState("");
  const navigate = useNavigate();

  // Use user.id or fallback to user._id
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) return; // Prevent API call if user or userId is not loaded
    const endpoint = (user.role === "admin" || user.role === "manager")
      ? "/attendance/all"
      : "/attendance/my";
    api.get(endpoint).then(res => {
      setRecords(res.data);
      // Build summary: group by user
      const sum = {};
      res.data.forEach(r => {
        const uid = r.user?._id || r.user;
        const name = r.user?.fullname || r.user?.email || r.user || "Unknown";
        if (!sum[uid]) sum[uid] = { uid, name, count: 0 };
        sum[uid].count += 1;
      });
      setSummary(Object.values(sum));
    });
    // Fetch timesheet hours for all users (admin/manager) or self (developer)
    if (user.role === "admin" || user.role === "manager") {
      api.get("/timesheet/all").then(res => {
        const map = {};
        res.data.forEach(t => {
          const uid = t.user?._id || t.user;
          if (!map[uid]) map[uid] = 0;
          map[uid] += t.hoursWorked || 0;
        });
        setHoursMap(map);
      });
    } else {
      api.get(`/timesheet/${userId}`).then(res => {
        const total = res.data.reduce((sum, t) => sum + (t.hoursWorked || 0), 0);
        setHoursMap({ [userId]: total });
      });
    }
  }, [user, userId]);

  const summaryColumns = [
    { name: "Employee", selector: row => row.name, sortable: true },
    { name: "Days Present", selector: row => row.count, sortable: true },
    { name: "Total Hours", selector: row => hoursMap[row.uid] || 0, sortable: true }
  ];

  const recordColumns = [
    { name: "Employee", selector: row => row.user?.fullname || row.user?.email || row.user || "Unknown", sortable: true },
    { name: "Date", selector: row => row.date ? row.date.slice(0,10) : "", sortable: true },
    { name: "Time In", selector: row => row.timeIn ? new Date(row.timeIn).toLocaleTimeString() : "", sortable: true },
    { name: "Clock Out", selector: row => row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : "—", sortable: true },
    { 
      name: "Status", 
      selector: row => {
        if (row.timeIn && row.clockOut) return "Present";
        if (row.timeIn && !row.clockOut) return "Present (No Clock Out)";
        return "Absent";
      },
      sortable: true
    }
  ];

  const filteredRecords = records.filter(r =>
    (r.user?.fullname || r.user?.email || r.user || "")
      .toLowerCase().includes(search.toLowerCase()) ||
    (r.date ? r.date.slice(0,10) : "").includes(search)
  );

  const filteredSummary = summary.filter(row =>
    (row.name || "").toLowerCase().includes(summarySearch.toLowerCase())
  );

  return (
    <div className="attendance-list-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2>Attendance Summary</h2>
      <input
        type="text"
        placeholder="Search summary..."
        value={summarySearch}
        onChange={e => setSummarySearch(e.target.value)}
        style={{ marginBottom: 12, padding: 6, width: "100%", maxWidth: 300 }}
      />
      <DataTable
        columns={summaryColumns}
        data={filteredSummary}
        pagination
        highlightOnHover
        striped
        responsive
      />
      <h2>Attendance Records</h2>
      <input
        type="text"
        placeholder="Search attendance..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 6, width: "100%", maxWidth: 300 }}
      />
      <DataTable
        columns={recordColumns}
        data={filteredRecords}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
};

export default AttendanceList;
