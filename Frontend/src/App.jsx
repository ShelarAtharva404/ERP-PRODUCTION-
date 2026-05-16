import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="erp-app-wrapper">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
