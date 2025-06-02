import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import Quizzes from "./pages/Quizzes";
import Results from "./pages/Results";
import AdminPanel from "./pages/AdminPanel";
import QuizSession from "./pages/QuizSession";
import { getProfile } from "./utils/api";
import "./App.css";

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user if token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile(token)
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-loading">Loading...</div>;

  return (
    <Router>
      <div className="app quizgenie-theme">
        <Sidebar user={user} setUser={setUser} />

        <main className="main-area">
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard user={user} /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/auth/:tab"
              element={<AuthPage setUser={setUser} />}
            />
            <Route
              path="/quizzes"
              element={user ? <Quizzes user={user} /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/results"
              element={user ? <Results user={user} /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/quiz/:categoryId"
              element={user ? <QuizSession user={user} /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="/admin"
              element={user && user.role === "admin" ? <AdminPanel user={user} /> : <Navigate to="/" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;