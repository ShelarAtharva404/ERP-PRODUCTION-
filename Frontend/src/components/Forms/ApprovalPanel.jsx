// src/components/Forms/ApprovalPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import './ApprovalPanel.css';

const ApprovalPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/leave/pending")
      .then(res => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = (id, status) => {
    api.put(`/leave/${id}`, { status })
      .then(() => {
        setRequests(prev => prev.filter(req => req._id !== id));
      });
  };

  if (loading) return <div className="approval-panel-loading">Loading...</div>;

  return (
    <div className="approval-panel-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2 className="approval-panel-title">Pending Leave Approvals</h2>
      <ul className="approval-panel-list">
        {requests.length === 0 && <li>No pending requests.</li>}
        {requests.map((req) => (
          <li key={req._id} className="approval-panel-list-item">
            <span>
              {req.user?.fullname || req.user} - {req.leaveType} - {req.startDate?.slice(0,10)} to {req.endDate?.slice(0,10)}
            </span>
            <div>
              <button
                onClick={() => handleAction(req._id, "approved")}
                className="approval-panel-btn approve-btn"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(req._id, "rejected")}
                className="approval-panel-btn reject-btn"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalPanel;
