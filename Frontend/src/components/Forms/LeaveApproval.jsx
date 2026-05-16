import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import './LeaveApproval.css';

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/leave/pending")
      .then(res => setLeaves(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (id, status) => {
    api.put(`/leave/${id}`, { status })
      .then(() => setLeaves(leaves.filter(l => l._id !== id)));
  };

  if (loading) return <div className="leave-approval-loading">Loading...</div>;

  return (
    <div className="leave-approval-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2>Pending Leave Requests</h2>
      <ul className="leave-approval-list">
        {leaves.length === 0 && <li>No pending requests.</li>}
        {leaves.map(l => (
          <li key={l._id} className="leave-approval-list-item">
            <span>
              <b>{l.user?.fullname}</b> ({l.user?.email}) - <b>{l.leaveType}</b> 
              {" "}from <b>{l.fromDate?.slice(0,10)}</b> to <b>{l.toDate?.slice(0,10)}</b>
            </span>
            <div>
              <button onClick={() => handleAction(l._id, "approved")} className="approve-btn">Approve</button>
              <button onClick={() => handleAction(l._id, "rejected")} className="reject-btn">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveApproval;
