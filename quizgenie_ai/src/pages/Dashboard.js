import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Dashboard({ user }) {
  return (
    <div className="container dashboard-page">
      <h1 className="title" style={{ marginTop: 32 }}>
        Welcome, {user?.name || user?.email || "Quizzer"}!
      </h1>
      <p className="description">
        Take quizzes by category, view your results, and challenge yourself.<br />
        Use the sidebar to navigate. Admins can manage quizzes.
      </p>
      <div style={{ margin: "30px 0" }}>
        <Link className="btn btn-large" to="/quizzes" style={{ marginRight: 10 }}>
          Take a Quiz
        </Link>
        <Link className="btn btn-large" to="/results">
          View My Results
        </Link>
      </div>
      {user?.role === "admin" && (
        <div>
          <Link className="btn btn-accent" to="/admin">
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
}
