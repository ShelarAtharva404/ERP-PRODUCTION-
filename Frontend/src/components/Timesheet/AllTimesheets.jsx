import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import './AllTimesheets.css';

const AllTimesheets = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/timesheet/all")
      .then(res => {
        setTimesheets(res.data);
      })
      .catch(err => {
        console.error("Error fetching timesheets:", err.response?.data || err.message);
        alert("Failed to load timesheets: " + (err.response?.data?.message || err.message));
        setTimesheets([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = (id, status) => {
    Swal.fire({
      title: `Are you sure to ${status} this timesheet?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
    }).then(result => {
      if (result.isConfirmed) {
        api.put(`/timesheet/${id}`, { status })
          .then(() => {
            setTimesheets(ts =>
              ts.map(t =>
                t._id === id ? { ...t, status } : t
              )
            );
            Swal.fire("Success", `Timesheet ${status}`, "success");
          });
      }
    });
  };

  // Show debug info if no data
  if (!loading && timesheets.length === 0) {
    return (
      <div>
        <h2>All Timesheets</h2>
        <div style={{ color: "red", margin: "1rem 0" }}>
          No timesheets found.<br />
          <b>Debug:</b> <br />
          - Make sure you have submitted timesheets as a developer.<br />
          - Check your backend /api/timesheet/all endpoint.<br />
          - Check your database for Timesheet records.<br />
        </div>
      </div>
    );
  }

  const filteredTimesheets = timesheets.filter(row =>
    (row.user?.fullname || row.user?.email || row.user || "")
      .toLowerCase().includes(search.toLowerCase()) ||
    (row.tasks || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.status || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.date ? row.date.slice(0,10) : "").includes(search)
  );

  const columns = [
    { name: "User", selector: row => row.user?.fullname || row.user?.email || row.user || "Unknown", sortable: true },
    { name: "Email", selector: row => row.user?.email || "", sortable: true },
    { name: "Date", selector: row => row.date ? row.date.slice(0,10) : "", sortable: true },
    { name: "Tasks", selector: row => row.tasks, sortable: true },
    { name: "Hours", selector: row => row.hoursWorked, sortable: true },
    { name: "Status", selector: row => row.status, sortable: true },
    // Debug: show raw status
    { name: "Raw Status", selector: row => String(row.status), sortable: true },
    {
  name: "Actions",
  cell: row =>
    (user?.role === "manager" || user?.role === "admin") ? (
      <div className="action-buttons">
        <button
          className="btn btn-success"
          onClick={() => handleStatus(row._id, "approved")}
        >
          Approve
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleStatus(row._id, "rejected")}
        >
          Reject
        </button>
      </div>
    ) : null,
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
}

  ];

  return (
    <div className="all-timesheets-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2>All Timesheets</h2>
      <input
        type="text"
        placeholder="Search timesheets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <DataTable
        columns={columns}
        data={filteredTimesheets}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No timesheets found."
      />
    </div>
  );

};

export default AllTimesheets;
