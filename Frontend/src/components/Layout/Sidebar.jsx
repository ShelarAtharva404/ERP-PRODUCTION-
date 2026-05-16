import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // new state for mobile toggle

  if (!user) return null;

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠", roles: ["admin", "manager", "developer"] },
    { label: "User Management", path: "/users", icon: "🧑‍💼", roles: ["admin"] },
    { label: "Attendance", path: "/attendance", icon: "🕒", roles: ["admin", "manager", "developer"] },
    { label: "Clock In/Out", path: "/clock", icon: "⏰", roles: ["developer"] },
    { label: "Timesheet", path: "/timesheet", icon: "📝", roles: ["developer"] },
    { label: "All Timesheets", path: "/timesheets", icon: "📋", roles: ["admin", "manager"] },
    { label: "Assign Task", path: "/assign-task", icon: "🗂️", roles: ["manager"] },
    { label: "Leave", path: "/leave", icon: "🌴", roles: ["developer"] },
    { label: "Leave Requests", path: "/leaves", icon: "📆", roles: ["admin", "manager"] },
    { label: "Approvals", path: "/approvals", icon: "✅", roles: ["manager", "admin"] },
    { label: "Profile", path: "/profile", icon: "👤", roles: ["developer", "manager", "admin"] },
    { label: "Calendar", path: "/calendar", icon: "📅", roles: ["developer", "manager", "admin"] },
    { label: "My Tasks", path: "/my-tasks", icon: "📋", roles: ["developer"] },
  ];

  return (
    <>
      {/* Mobile hamburger toggle button */}
      <button
        className="erp-sidebar-mobile-toggle-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        ☰
      </button>

      <aside
        className={`erp-sidebar${collapsed ? " erp-sidebar-collapsed" : ""}${mobileOpen ? " open" : ""}`}
      >
        <div className="erp-sidebar-title">&nbsp;</div>

        {/* Desktop collapse toggle button */}
        <button
          className="erp-sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>

        <ul className="erp-sidebar-list">
          {navLinks
            .filter(link => link.roles.includes(user.role))
            .map((link) => (
              <li key={link.path} className={`erp-sidebar-list-item${location.pathname === link.path ? " active" : ""}`}>
                <Link
                  to={link.path}
                  className="erp-sidebar-link"
                  onClick={() => setMobileOpen(false)}  // close sidebar on mobile after clicking a link
                >
                  <span className="erp-sidebar-icon">{link.icon}</span>
                  {!collapsed && link.label}
                </Link>
              </li>
            ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
