import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import "./AssignTask.css"; // <- make sure this path is correct

const AssignTask = () => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users")
      .then(res => setDevelopers(res.data.filter(u => u.role === "developer")));
  }, []);

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!selectedDev || !taskTitle) {
      Swal.fire("Error", "Select developer and enter task title", "error");
      return;
    }
    api.post("/timesheet/assign", { assignedTo: selectedDev, taskTitle, dueDate })
      .then(() => {
        Swal.fire("Success", "Task assigned!", "success");
        setTaskTitle("");
        setDueDate("");
      });
  };

  return (
    <div className="assign-task-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2>Assign Task</h2>
      <form onSubmit={handleAssignTask}>
        <select value={selectedDev} onChange={e => setSelectedDev(e.target.value)} required>
          <option value="">Select Developer</option>
          {developers.map(dev => (
            <option key={dev._id} value={dev._id}>
              {dev.fullname} ({dev.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
};

export default AssignTask;
