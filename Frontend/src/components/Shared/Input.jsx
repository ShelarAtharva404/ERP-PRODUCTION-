// src/components/Shared/Input.jsx
import React from "react";

const Input = ({ label, type = "text", name, value, onChange, placeholder = "", required = false, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 font-semibold" htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
