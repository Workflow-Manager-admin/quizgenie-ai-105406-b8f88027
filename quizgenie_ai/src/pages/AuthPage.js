import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function AuthPage({ setUser }) {
  const { tab } = useParams();
  const [mode, setMode] = useState(tab === "register" ? "register" : "login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMode("login");
      } else {
        const { token, user } = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(form),
        });
        localStorage.setItem("token", token);
        setUser(user);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <div className="container auth-page">
      <h2>{mode === "register" ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 330 }}>
        {mode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="input"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />
        <button className="btn btn-large" type="submit" style={{ width: "100%" }}>
          {mode === "register" ? "Register" : "Login"}
        </button>
        {error && <div className="error" style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 9, textAlign: "center" }}>
          {mode === "register" ? (
            <span>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => setMode("login")}>
                Login
              </button>
            </span>
          ) : (
            <span>
              No account?{" "}
              <button type="button" className="link-btn" onClick={() => setMode("register")}>
                Register
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
