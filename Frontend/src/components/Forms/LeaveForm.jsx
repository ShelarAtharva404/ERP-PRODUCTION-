// src/components/Forms/LeaveForm.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import './LeaveForm.css';
import DataTable from "react-data-table-component";

const LeaveForm = () => {
  const [form, setForm] = useState({
    leaveType: "sick",
    fromDate: "",
    toDate: "",
    reason: ""
  });
  const [myLeaves, setMyLeaves] = useState([]);

  useEffect(() => {
    api.get("/leave/my") // You need to add this endpoint in backend
      .then(res => setMyLeaves(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    api.post("/leave", form)
      .then(() => {
        Swal.fire("Success", "Leave request submitted!", "success");
        setForm({ leaveType: "sick", fromDate: "", toDate: "", reason: "" });
        return api.get("/leave/my");
      })
      .then(res => setMyLeaves(res.data));
  };

  const columns = [
    { name: "Type", selector: row => row.leaveType, sortable: true },
    { name: "From", selector: row => row.fromDate?.slice(0,10), sortable: true },
    { name: "To", selector: row => row.toDate?.slice(0,10), sortable: true },
    { name: "Status", selector: row => row.status, sortable: true }
  ];

  return (
    <div className="leave-form-container">
      <h2 className="leave-form-title">Leave Application</h2>
      <form onSubmit={handleSubmit}>
        <select name="leaveType" value={form.leaveType} onChange={handleChange} className="leave-form-input">
          <option value="sick">Sick</option>
          <option value="casual">Casual</option>
          <option value="paid">Paid</option>
          <option value="other">Other</option>
        </select>
        <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} className="leave-form-input" required />
        <input type="date" name="toDate" value={form.toDate} onChange={handleChange} className="leave-form-input" required />
        <textarea name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} className="leave-form-input" required />
        <button type="submit" className="leave-form-btn">Submit</button>
      </form>
      <div style={{ marginTop: "2rem" }}>
        <h3>Your Leave Requests</h3>
        <DataTable
          columns={columns}
          data={myLeaves}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default LeaveForm;
