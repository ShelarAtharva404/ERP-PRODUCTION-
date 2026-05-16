// src/components/Auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './LoginForm.css';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      Swal.fire("Error", "Please enter both email and password.", "error");
      return;
    }
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.user);
      localStorage.setItem("token", response.data.token);
      setFormData({ email: "", password: "" }); // <-- Reset form after login
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid credentials");
      Swal.fire("Error", error.response?.data?.message || "Invalid credentials", "error");
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Login</h2>
      <form onSubmit={handleSubmit}>
  <div className="form-group">
    <label className="login-form-label">Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      className="login-form-input"
    />
  </div>

  <div className="form-group">
    <label className="login-form-label">Password</label>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      className="login-form-input"
    />
  </div>

  <button
    type="submit"
    className="login-form-button"
  >
    Login
  </button>
</form>

      {errorMsg && <div className="login-error-message">{errorMsg}</div>}
    </div>
  );
};

export default LoginForm;
