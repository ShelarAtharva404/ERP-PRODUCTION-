import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Button from "../Shared/Button";
import { useAuth } from "../../context/AuthContext";
import "./UserManagement.css";

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "admin") return <div>Unauthorized</div>;
  const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
  };
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
  fullname: "",
  email: "",
  password: "",
  role: "developer",
  joiningDate: getTodayDate(),
  });
  const [search, setSearch] = useState("");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserData, setEditingUserData] = useState({
    fullname: "",
    email: "",
    role: "developer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/users/${id}`).then(() => {
          setUsers(users.filter((u) => u._id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        });
      }
    });
  };

  const handleCreate = (e) => {
  e.preventDefault();
  api
    .post("/auth/register", newUser)
    .then(() => {
      Swal.fire("Success", "User created!", "success");
      setNewUser({ fullname: "", email: "", password: "", role: "developer", joiningDate: getTodayDate() });
      fetchUsers();
    });
};

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditingUserData({
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingUserData({ fullname: "", email: "", role: "developer" });
  };

  const saveEditUser = () => {
    api.put(`/users/${editingUserId}`, editingUserData)
      .then(() => {
        Swal.fire("Success", "User updated!", "success");
        fetchUsers();
        cancelEdit();
      })
      .catch((err) => {
        Swal.fire("Error", err.response?.data?.message || "Failed to update user", "error");
      });
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "Name",
      selector: (row) =>
        editingUserId === row._id ? (
          <input
            type="text"
            value={editingUserData.fullname}
            onChange={(e) =>
              setEditingUserData({ ...editingUserData, fullname: e.target.value })
            }
          />
        ) : (
          row.fullname
        ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) =>
        editingUserId === row._id ? (
          <input
            type="email"
            value={editingUserData.email}
            onChange={(e) =>
              setEditingUserData({ ...editingUserData, email: e.target.value })
            }
          />
        ) : (
          row.email
        ),
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) =>
        editingUserId === row._id ? (
          <select
            value={editingUserData.role}
            onChange={(e) =>
              setEditingUserData({ ...editingUserData, role: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
          </select>
        ) : (
          row.role
        ),
      sortable: true,
    },
    {
      name: "Joining Date", // ✅ New Column
      selector: (row) =>
        row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : "—",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) =>
        editingUserId === row._id ? (
          <>
            <Button onClick={saveEditUser} className="btn btn-success" style={{ marginRight: '0.5rem' }}>
              Save
            </Button>
            <Button onClick={cancelEdit} className="btn btn-secondary">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => startEditUser(row)}
              className="btn btn-edit"
              style={{ marginRight: "0.5rem" }}
            >
              Edit
            </Button>
            <Button onClick={() => handleDelete(row._id)} className="btn btn-delete">
              Delete
            </Button>
          </>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="user-management-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h3>User Management</h3>

      <form className="user-management-form" onSubmit={handleCreate}>
        <input
          placeholder="Full Name"
          value={newUser.fullname}
          onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
        </select>
        <Button type="submit" className="btn btn-primary">
          Add User
        </Button>
      </form>

      <input
        type="text"
        className="user-management-search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="user-management-table">
        <DataTable
          columns={columns}
          data={filteredUsers}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default UserManagement;
