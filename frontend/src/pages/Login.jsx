// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const navigate = useNavigate();

  // 🔹 FIXED LOGIN HANDLER (NO BLOCKING ALERTS)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      toast.success("Identity Verified — Welcome Ranger.", {
        style: {
          background: "#0F172A",
          color: "#22D3EE",
          border: "1px solid #22D3EE",
        },
      });

      // 🔹 Small delay so toast is visible
      setTimeout(() => navigate("/dashboard"), 350);
    } else {
      toast.error("Invalid credentials. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f24, #020617)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(15, 23, 42, 0.85)",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #22d3ee55",
          boxShadow: "0 0 25px rgba(34,211,238,0.25)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#22d3ee",
          }}
        >
          RANGER MED-CORE
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: "30px",
            fontSize: "14px",
          }}
        >
          SYSTEM ACCESS PANEL
        </p>

        {/* Email */}
        <label style={{ fontSize: "14px" }}>Email</label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "5px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        />

        {/* Password */}
        <label style={{ fontSize: "14px" }}>Password</label>
        <input
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "5px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: isLoading ? "#075985" : "#0ea5e9",
            color: "white",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "0.2s",
          }}
        >
          {isLoading ? "AUTHENTICATING..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
}

export default Login;
