import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import ClockInOut from '../components/Forms/ClockInOut';
import TimesheetForm from '../components/Forms/TimesheetForm';
import LeaveForm from '../components/Forms/LeaveForm';
import UserProfile from '../components/Profile/UserProfile';
import ApprovalPanel from '../components/Forms/ApprovalPanel';
import ErpCalendar from '../components/Calendar/ErpCalendar';
import UserManagement from '../components/User/UserManagement';
import AttendanceList from '../components/Attendance/AttendanceList';
import AllTimesheets from '../components/Timesheet/AllTimesheets'; // create this page for admin/manager
import AssignTask from '../components/Timesheet/AssignTask'; // create this page for manager
import LeaveRequests from '../components/Leave/LeaveRequests'; // create this page for admin/manager
import MyTasks from '../components/Timesheet/MyTasks';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowed }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clock" element={<RoleRoute allowed={['developer']}><ClockInOut /></RoleRoute>} />
      <Route path="/timesheet" element={<RoleRoute allowed={['developer']}><TimesheetForm /></RoleRoute>} />
      <Route path="/leave" element={<RoleRoute allowed={['developer']}><LeaveForm /></RoleRoute>} />
      <Route path="/approvals" element={<RoleRoute allowed={['manager', 'admin']}><ApprovalPanel /></RoleRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><ErpCalendar /></ProtectedRoute>} />
      <Route path="/users" element={<RoleRoute allowed={['admin']}><UserManagement /></RoleRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendanceList /></ProtectedRoute>} />
      <Route path="/timesheets" element={<RoleRoute allowed={['admin', 'manager']}><AllTimesheets /></RoleRoute>} />
      <Route path="/assign-task" element={<RoleRoute allowed={['manager']}><AssignTask /></RoleRoute>} />
      <Route path="/leaves" element={<RoleRoute allowed={['admin', 'manager']}><LeaveRequests /></RoleRoute>} />
      <Route path="/my-tasks" element={<RoleRoute allowed={['developer']}><MyTasks /></RoleRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
