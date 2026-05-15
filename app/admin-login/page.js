"use client";
import { useEffect, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not_admin") {
      setError("That Google account is not authorized as admin.");
    } else if (params.get("error") === "1") {
      setError("Google sign-in failed. Please try again.");
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 400,
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "'Instrument Serif', serif", color: "#fff", letterSpacing: "-0.02em" }}>
            Reply<span style={{ color: "#3b82f6" }}>Right</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
            Admin Access
          </div>
        </div>

        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px", letterSpacing: -0.5 }}>
          Admin Sign In
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>
          Use the authorized admin Google account to access the admin dashboard.
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
          }}>
            <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <a href="/api/auth/google?flow=admin" style={{ textDecoration: "none", display: "block" }}>
          <button style={{
            width: "100%",
            padding: "13px 24px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s ease",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </a>

        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 24 }}>
          Restricted access — authorized personnel only.
        </p>
      </div>
    </div>
  );
}
