// src/components/Forms/ClockInOut.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import './ClockInOut.css';
import { useAuth } from "../../context/AuthContext";

const ClockInOut = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState({ clockIn: null, clockOut: null });
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const navigate = useNavigate();

  // Use user.id or fallback to user._id
  const userId = user?.id || user?._id;

  const fetchTodayStatus = () => {
    if (!userId) return;
    setAttendanceLoading(true);
    api.get("/attendance/my").then(res => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const todayRec = (res.data || []).find(r => {
        if (!r.date) return false;
        const recDate = new Date(r.date);
        recDate.setHours(0,0,0,0);
        return recDate.getTime() === today.getTime();
      });
      setTodayStatus({
        clockIn: todayRec?.timeIn,
        clockOut: todayRec?.clockOut
      });
      setAttendanceLoading(false);
    }).catch(() => setAttendanceLoading(false));
  };

  useEffect(() => {
    fetchTodayStatus();
  }, [userId]);

  const handleClockIn = () => {
    if (!userId) return;
    if (todayStatus.clockIn) {
      Swal.fire("Info", "You have already clocked in today.", "info");
      return;
    }
    setLoading(true);
    api.post("/attendance/clockin")
      .then(() => {
        Swal.fire("Success", "Clocked In!", "success");
        fetchTodayStatus();
      })
      .catch(err => Swal.fire("Error", err.response?.data?.message || "Error", "error"))
      .finally(() => setLoading(false));
  };

  const handleClockOut = () => {
    if (!userId) return; // Prevent API call if user is not loaded
    setLoading(true);
    api.post("/attendance/clockout")
      .then(() => {
        Swal.fire("Success", "Clocked Out!", "success");
        fetchTodayStatus();
      })
      .catch(err => {
        Swal.fire("Error", err.response?.data?.message || "Error", "error");
        fetchTodayStatus(); // Always refresh status, even on error
      })
      .finally(() => setLoading(false));
  };

  if (!userId) {
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
        <h2>Clock In / Clock Out</h2>
        <div>Loading user...</div>
      </div>
    );
  }

  if (attendanceLoading) {
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
        <h2>Clock In / Clock Out</h2>
        <div>Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="clockinout-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2 className="clockinout-title">Clock In / Clock Out</h2>

      <div className="clockinout-status">
        <p>Today's Status</p>
        <span>Clock In: {todayStatus.clockIn ? new Date(todayStatus.clockIn).toLocaleTimeString() : "—"}</span>
        <span>Clock Out: {todayStatus.clockOut ? new Date(todayStatus.clockOut).toLocaleTimeString() : "—"}</span>
      </div>

      <div className="clockinout-btn-group">
        <button
          onClick={handleClockIn}
          disabled={loading || !!todayStatus.clockIn}
          className="clockinout-btn"
        >
          Clock In
        </button>
        <button
          onClick={handleClockOut}
          disabled={loading || !todayStatus.clockIn || !!todayStatus.clockOut}
          className="clockinout-btn"
        >
          Clock Out
        </button>
      </div>
    </div>
  );

};
 
export default ClockInOut;
