import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import DataTable from "react-data-table-component";
import './LeaveRequests.css';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const endpoint = (user.role === "admin" || user.role === "manager")
      ? "/leave/all"
      : "/leave/my";
    api.get(endpoint)
      .then(res => setLeaves(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredLeaves = leaves.filter(row =>
    (row.user?.fullname || row.user || "")
      .toLowerCase().includes(search.toLowerCase()) ||
    (row.leaveType || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.status || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.fromDate || "").includes(search) ||
    (row.toDate || "").includes(search)
  );

  const columns = [
    { name: "User", selector: row => row.user?.fullname || row.user, sortable: true },
    { name: "Type", selector: row => row.leaveType, sortable: true },
    { name: "From", selector: row => row.fromDate?.slice(0, 10), sortable: true },
    { name: "To", selector: row => row.toDate?.slice(0, 10), sortable: true },
    { name: "Status", selector: row => row.status, sortable: true }
  ];

  return (
    <div className="leave-requests-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2 className="leave-requests-title">Leave Requests</h2>
      <input
        type="text"
        placeholder="Search leaves..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="leave-requests-search"
      />
      <DataTable
        columns={columns}
        data={filteredLeaves}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
};

export default LeaveRequests;
