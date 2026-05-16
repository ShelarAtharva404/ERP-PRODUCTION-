// src/components/Auth/RoleRedirect.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RoleRedirect = () => {
  const { authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      if (authUser.role === "admin") navigate("/admin-dashboard");
      else if (authUser.role === "manager") navigate("/manager-dashboard");
      else navigate("/developer-dashboard");
    } else {
      navigate("/login");
    }
  }, [authUser, navigate]);

  return null; // no UI, just redirect
};

export default RoleRedirect;
