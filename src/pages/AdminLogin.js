import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin/dashboard");
    } else {
      setError("❌ Invalid username or password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>🔐 Admin Login</h2>
        <p className="subtitle">Welcome back! Please login below</p>

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login 🚀</button>
      </div>
    </div>
  );
};

export default AdminLogin;
