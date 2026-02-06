import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setToken } from "./api";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />
        <Route
          path="/teacher"
          element={
            <Protected>
              <Teacher />
            </Protected>
          }
        />
        <Route
          path="/student"
          element={
            <Protected>
              <Student />
            </Protected>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
