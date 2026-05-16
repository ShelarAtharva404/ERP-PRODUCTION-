import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
import DeveloperDashboard from '../components/Dashboard/DeveloperDashboard';
import DashboardWrapper from '../components/Dashboard/DashboardWrapper';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="loading-text">Loading...</p>;

  let DashboardComponent;

  switch (user.role) {
    case 'admin':
      DashboardComponent = AdminDashboard;
      break;
    case 'manager':
      DashboardComponent = ManagerDashboard;
      break;
    case 'developer':
      DashboardComponent = DeveloperDashboard;
      break;
    default:
      DashboardComponent = () => <p className="error-text">Role not recognized</p>;
  }

  return (
    <DashboardWrapper>
      <DashboardComponent />
    </DashboardWrapper>
  );
};

export default Dashboard;
