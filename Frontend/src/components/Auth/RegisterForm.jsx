// src/components/Auth/RegisterForm.jsx
import React, { useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "developer",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!formData.fullname || !formData.email || !formData.password) {
      setErrorMsg("All fields are required.");
      return;
    }
    try {
      await api.post("/auth/register", formData);
      setSuccessMsg("Registration successful! Please login.");
      setFormData({
        fullname: "",
        email: "",
        password: "",
        role: "developer",
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-form-title">Create Account</h2>
        <label className="register-form-label">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="register-form-input"
        />
        <label className="register-form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="register-form-input"
        />
        <label className="register-form-label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="register-form-input"
        />
        <label className="register-form-label">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="register-form-input"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
        </select>
        <button type="submit" className="register-form-button">
          Register
        </button>
        {errorMsg && <div className="register-error-message">{errorMsg}</div>}
        {successMsg && <div className="register-success-message">{successMsg}</div>}
        <div className="register-form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
