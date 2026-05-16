import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ErpCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const evts = [];

      // Attendance
      try {
        let attendanceRes;
        if (user.role === "admin" || user.role === "manager") {
          attendanceRes = await api.get("/attendance/all");
        } else {
          attendanceRes = await api.get("/attendance/my");
        }
        (attendanceRes.data || []).forEach(a => {
          if (user.role === "developer" && (a.user?._id || a.user) !== user.id) return;
          evts.push({
            title: a.user?.fullname ? `Present: ${a.user.fullname}` : "Present",
            start: a.date || a.timeIn,
            color: "#22c55e",
            allDay: true,
            extendedProps: { type: "attendance" }
          });
        });
      } catch {}

      // Leaves
      try {
        let leavesRes;
        if (user.role === "admin" || user.role === "manager") {
          leavesRes = await api.get("/leave/all");
        } else {
          leavesRes = await api.get("/leave/my");
        }
        (leavesRes.data || [])
          .filter(l => l.status === "approved")
          .forEach(l => {
            evts.push({
              title: l.user?.fullname
                ? `Leave (${l.leaveType}): ${l.user.fullname}`
                : `Leave (${l.leaveType})`,
              start: l.fromDate,
              end: l.toDate,
              color: "#f59e42",
              allDay: true,
              extendedProps: { type: "leave", status: l.status }
            });
          });
      } catch {}

      // Timesheets/Tasks
      try {
        let timesheetRes;
        if (user.role === "developer") {
          timesheetRes = await api.get(`/timesheet/${user.id}`);
        } else {
          timesheetRes = await api.get("/timesheet/all");
        }
        (timesheetRes.data || []).forEach(t => {
          if (user.role === "developer" && (t.user?._id || t.user) !== user.id) return;
          // Show blue for assigned tasks (due), purple for submitted/completed
          evts.push({
            title: t.user?.fullname
              ? `${t.tasks || "Task"}: ${t.user.fullname}`
              : t.tasks || "Task",
            start: t.dueDate || t.date,
            color: t.status === "assigned" ? "#2563eb" : "#a855f7",
            allDay: true,
            extendedProps: { type: "task", status: t.status }
          });
        });
      } catch {}

      setEvents(evts);
    };

    fetchEvents();
  }, [user]);

  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: 20, margin: "2rem auto", maxWidth: 900 }}>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2 style={{ marginBottom: 16 }}>Calendar View</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={600}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
      />
    </div>
  );
};

export default ErpCalendar;
