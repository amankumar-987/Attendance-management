import React, { useEffect, useState } from "react";
import { api, getUser, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const nav = useNavigate();
  const [me, setMe] = useState(getUser());
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = getUser();
    if (!token || !u) return nav("/login");
    setToken(token);
    setMe(u);
    load();
    // eslint-disable-next-line
  }, []);

  async function load() {
    setMsg("");
    try {
      const res = await api.get("/student/attendance/me");
      setRows(res.data);

      const present = res.data.filter((x) => x.status === "PRESENT").length;
      const total = res.data.length || 1;
      const pct = Math.round((present * 100) / total);
      setMsg(`Attendance: ${present}/${res.data.length} (${pct}%)`);
    } catch (e) {
      setMsg("Your student profile is not linked to your login yet (user_id in students table).");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    nav("/login");
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Student Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>
        Logged in as <b>{me?.name}</b> ({me?.role})
      </p>
      {msg && <p style={{ color: msg.includes("Attendance:") ? "green" : "crimson" }}>{msg}</p>}

      <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            padding: 10,
            fontWeight: "bold",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>Date</div>
          <div>Status</div>
        </div>

        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              padding: 10,
              borderBottom: "1px solid #f2f2f2",
            }}
          >
            <div>{r.date}</div>
            <div>{r.status}</div>
          </div>
        ))}

        {!rows.length && <div style={{ padding: 12, color: "#666" }}>No attendance records yet.</div>}
      </div>
    </div>
  );
}
