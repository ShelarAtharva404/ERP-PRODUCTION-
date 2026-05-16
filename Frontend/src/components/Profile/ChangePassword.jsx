// src/components/Profile/ChangePassword.jsx
import React, { useState } from "react";
import api from "../../utils/api";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("All fields are required.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    api.post("/users/change-password", formData)
      .then(() => alert("Password changed successfully"))
      .catch((err) => alert(err.response?.data?.message || "Failed to change password"));
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="change-password-label">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="change-password-input"
          required
        />

        <label className="change-password-label">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="change-password-input"
          required
        />

        <label className="change-password-label">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="change-password-input"
          required
        />

        <button
          type="submit"
          className="change-password-btn"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
