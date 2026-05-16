// src/components/Shared/Button.jsx
import React from "react";

const Button = ({ children, onClick, className = "", type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
