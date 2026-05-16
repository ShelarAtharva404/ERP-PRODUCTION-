import React, { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import './AttendanceClock.css';

const AttendanceClock = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClockIn = () => {
    if (!user) {
      setStatus("You must be logged in to clock in.");
      return;
    }
    setLoading(true);
    api.post("/attendance/clockin")
      .then(() => {
        setStatus("✅ Present (Clocked In)");
        setDisabled(true);
      })
      .catch(err => setStatus(err.response?.data?.message || "Error"))
      .finally(() => setLoading(false));
  };

  if (!user) {
    return (
      <div className="attendance-clock-container">
        <div className="attendance-clock-status">You must be logged in to clock in.</div>
      </div>
    );
  }

  return (
    <div className="attendance-clock-container">
      <button
        onClick={handleClockIn}
        disabled={disabled || loading}
        className="attendance-clock-btn"
      >
        {loading ? "Clocking In..." : "Clock In"}
      </button>
      {status && <div className="attendance-clock-status">{status}</div>}
    </div>
  );
};

export default AttendanceClock;
