import React, { useEffect, useState } from "react";
import { api, getUser, setToken } from "../api";
import { useNavigate } from "react-router-dom";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Teacher() {
  const nav = useNavigate();
  const [me, setMe] = useState(getUser());

  const [classes, setClasses] = useState([]);
  const [classRoomId, setClassRoomId] = useState("");
  const [date, setDate] = useState(todayISO());

  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = getUser();
    if (!token || !u) return nav("/login");
    if (u.role !== "TEACHER" && u.role !== "ADMIN") return nav(u.role === "ADMIN" ? "/admin" : "/student");
    setToken(token);
    setMe(u);
    loadClasses();
    // eslint-disable-next-line
  }, []);

  async function loadClasses() {
    setMsg("");
    try {
      const c = await api.get("/teacher/classes");
      setClasses(c.data);
    } catch {
      setMsg("Could not load classes. Are you logged in with TEACHER/ADMIN and backend running?");
    }
  }

  async function loadAttendance() {
    setMsg("");
    if (!classRoomId) return;
    const res = await api.get("/teacher/attendance/class", { params: { classRoomId, date } });
    setRows(res.data);
  }

  function setStatus(studentId, status) {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  }

  async function save() {
    setMsg("");
    const records = rows.map((r) => ({ studentId: r.studentId, status: r.status }));
    await api.post("/teacher/attendance/mark", { classRoomId: Number(classRoomId), date, records });
    setMsg("Saved ✅");
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
        <h2>Teacher Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>
        Logged in as <b>{me?.name}</b> ({me?.role})
      </p>
      {msg && <p style={{ color: msg.includes("✅") ? "green" : "crimson" }}>{msg}</p>}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <select value={classRoomId} onChange={(e) => setClassRoomId(e.target.value)} style={{ padding: 10 }}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section ? `(${c.section})` : ""} — ID {c.id}
            </option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 10 }} />

        <button onClick={loadAttendance} disabled={!classRoomId}>
          Load
        </button>
        <button onClick={save} disabled={!rows.length}>
          Save
        </button>
      </div>

      <div style={{ marginTop: 14, border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 260px",
            padding: 10,
            fontWeight: "bold",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>Roll</div>
          <div>Name</div>
          <div>Status</div>
        </div>

        {rows.map((r) => (
          <div
            key={r.studentId}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 260px",
              padding: 10,
              borderBottom: "1px solid #f2f2f2",
            }}
          >
            <div>{r.rollNo}</div>
            <div>{r.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setStatus(r.studentId, "PRESENT")} style={{ padding: "6px 10px" }}>
                Present
              </button>
              <button onClick={() => setStatus(r.studentId, "ABSENT")} style={{ padding: "6px 10px" }}>
                Absent
              </button>
              <button onClick={() => setStatus(r.studentId, "LATE")} style={{ padding: "6px 10px" }}>
                Late
              </button>
              <span style={{ marginLeft: 8, color: "#666" }}>{r.status}</span>
            </div>
          </div>
        ))}

        {!rows.length && <div style={{ padding: 12, color: "#666" }}>Load a class to mark attendance.</div>}
      </div>
    </div>
  );
}
