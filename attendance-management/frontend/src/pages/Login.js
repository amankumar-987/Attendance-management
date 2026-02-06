import React, { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);

      const role = res.data.user.role;
      if (role === "ADMIN") nav("/admin");
      else if (role === "TEACHER") nav("/teacher");
      else nav("/student");
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
      <h2>Attendance Login</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <input
            style={{ width: "100%", padding: 10 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button style={{ padding: "10px 14px" }}>Login</button>
      </form>

      <p style={{ marginTop: 14, color: "#666" }}>
        First time? Create admin using backend <code>/api/bootstrap</code>.
      </p>
    </div>
  );
}
