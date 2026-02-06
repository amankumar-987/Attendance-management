import React, { useEffect, useState } from "react";
import { api, getUser, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const nav = useNavigate();
  const [me, setMe] = useState(getUser());

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [classRoomId, setClassRoomId] = useState("");

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = getUser();
    if (!token || !u) return nav("/login");
    if (u.role !== "ADMIN") return nav(u.role === "TEACHER" ? "/teacher" : "/student");
    setToken(token);
    setMe(u);
    load();
    // eslint-disable-next-line
  }, []);

  async function load() {
    setMsg("");
    const c = await api.get("/admin/classes");
    const s = await api.get("/admin/students");
    setClasses(c.data);
    setStudents(s.data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    nav("/login");
  }

  async function createClass(e) {
    e.preventDefault();
    setMsg("");
    const res = await api.post("/admin/classes", { name: className, section });
    setClassName("");
    setSection("");
    setMsg(`Created class ID ${res.data.id}`);
    load();
  }

  async function createStudent(e) {
    e.preventDefault();
    setMsg("");
    await api.post("/admin/students", {
      name: studentName,
      rollNo,
      classRoomId: String(classRoomId),
    });
    setStudentName("");
    setRollNo("");
    setMsg("Student added");
    load();
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>
        Logged in as <b>{me?.name}</b> (ADMIN)
      </p>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3>Create Class</h3>
          <form onSubmit={createClass}>
            <input
              placeholder="Class name (e.g., B.Tech CSE)"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 8 }}
            />
            <input
              placeholder="Section (optional)"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 8 }}
            />
            <button>Create</button>
          </form>

          <h4 style={{ marginTop: 16 }}>Classes</h4>
          {classes.map((c) => (
            <div key={c.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <b>{c.name}</b> {c.section ? `(${c.section})` : ""} — ID: {c.id}
            </div>
          ))}
          {!classes.length && <p style={{ color: "#666" }}>No classes yet</p>}
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3>Add Student</h3>
          <form onSubmit={createStudent}>
            <input
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 8 }}
            />
            <input
              placeholder="Roll No"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 8 }}
            />
            <select
              value={classRoomId}
              onChange={(e) => setClassRoomId(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 8 }}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.section ? `(${c.section})` : ""} — ID {c.id}
                </option>
              ))}
            </select>
            <button disabled={!classRoomId}>Add</button>
          </form>

          <h4 style={{ marginTop: 16 }}>Students</h4>
          {students.slice(0, 12).map((s) => (
            <div key={s.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              {s.rollNo} — {s.name} (Class ID: {s.classRoom?.id})
            </div>
          ))}
          {students.length > 12 && <p style={{ color: "#666" }}>Showing 12 of {students.length}</p>}
          {!students.length && <p style={{ color: "#666" }}>No students yet</p>}
        </div>
      </div>
    </div>
  );
}
