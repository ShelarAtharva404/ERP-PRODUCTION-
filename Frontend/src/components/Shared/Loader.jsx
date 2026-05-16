// src/components/Shared/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      <div className="loader"></div>
      {/* 
        .loader class should be defined in your global CSS:
        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      */}
    </div>
  );
};

export default Loader;
