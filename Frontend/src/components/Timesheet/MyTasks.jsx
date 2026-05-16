import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import DataTable from "react-data-table-component";
import "./MyTasks.css"; // <- Ensure this path is correct

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !user.id) return;
    api.get(`/timesheet/${user.id}`).then(res => {
      setTasks(res.data.filter(t => t.status === "assigned"));
    });
  }, [user]);

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const filteredTasks = tasks
    .filter(t => {
      const taskDate = t.date?.slice(0, 10);
      if (filter === "today") return taskDate === today;
      if (filter === "yesterday") return taskDate === yesterday;
      return true;
    })
    .filter(t =>
      (t.tasks || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.date || "").includes(search) ||
      (t.status || "").toLowerCase().includes(search.toLowerCase())
    );

  const columns = [
    { name: "Date", selector: row => row.date?.slice(0, 10), sortable: true },
    { name: "Task", selector: row => row.tasks, sortable: true },
    { name: "Status", selector: row => row.status, sortable: true },
    { name: "Due Date", selector: row => row.dueDate?.slice(0, 10), sortable: true }
  ];

  return (
    <div className="my-tasks-container">
      <h2>My Assigned Tasks</h2>

      <div className="my-tasks-filter">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("today")}>Today</button>
        <button onClick={() => setFilter("yesterday")}>Yesterday</button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="my-tasks-search"
      />

      <div className="my-tasks-table">
        <DataTable
          columns={columns}
          data={filteredTasks}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default MyTasks;
