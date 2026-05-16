// src/components/Notifications/ToastMessage.jsx
import React, { useEffect } from "react";

const ToastMessage = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: "#16a34a",
    error: "#dc2626",
    warning: "#f59e42",
    info: "#2563eb",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
        color: "#fff",
        background: bgColors[type] || bgColors.info,
        zIndex: 2000,
        fontWeight: 600,
        fontSize: "1rem",
        minWidth: "180px",
        textAlign: "center",
        transition: "opacity 0.3s"
      }}
      role="alert"
    >
      {message}
    </div>
  );
};

export default ToastMessage;
