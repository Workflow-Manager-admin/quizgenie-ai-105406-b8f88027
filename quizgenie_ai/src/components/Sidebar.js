import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/quizzes", label: "Quizzes", icon: "📝" },
  { to: "/results", label: "Results", icon: "📊" },
];

const adminLinks = [
  { to: "/admin", label: "Admin Panel", icon: "🛠️" },
];

export default function Sidebar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(undefined);
    navigate("/auth/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-symbol" style={{ color: "#1976d2" }}>🎲</span>
        <span className="sidebar-title">QuizGenie AI</span>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link
            className={`sidebar-link${location.pathname === link.to ? " active" : ""}`}
            to={link.to}
            key={link.to}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
        {user && user.role === "admin" &&
          adminLinks.map((link) => (
            <Link
              className={`sidebar-link${location.pathname === link.to ? " active" : ""}`}
              to={link.to}
              key={link.to}
            >
              <span className="sidebar-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))
        }
      </nav>
      <div className="sidebar-footer">
        {user ? (
          <div className="sidebar-user">
            <span>{user.name || user.email}</span>
            <button className="btn btn-small" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/auth/login" className="btn btn-small sidebar-login">Login</Link>
        )}
      </div>
    </aside>
  );
}
