"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
      } else if (data.user?.email !== "admin@replyrightapp.com") {
        // Clear the session that was just set — this is not an admin account
        document.cookie = "rr_session=; max-age=0; path=/";
        document.cookie = "rr_user=; max-age=0; path=/";
        document.cookie = "rr_plan=; max-age=0; path=/";
        document.cookie = "rr_billing=; max-age=0; path=/";
        setError("Access denied. Admin credentials required.");
      } else {
        window.location.href = "/admin-dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "1.5rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #e8eaf0",
        boxShadow: "0 4px 32px rgba(15,31,56,0.08)",
        padding: "2.5rem 2rem",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Instrument Serif', serif", fontSize: "1.6rem", fontWeight: 400, letterSpacing: "-.02em", color: "#0f1f38" }}>
            Reply<span style={{ color: "#2563eb" }}>Right</span>
          </a>
          <div style={{ marginTop: "0.4rem" }}>
            <span style={{ display: "inline-block", background: "#f0f4ff", color: "#2563eb", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: ".25rem .7rem", borderRadius: 20 }}>
              Admin
            </span>
          </div>
        </div>

        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f1f38", textAlign: "center", marginBottom: ".4rem" }}>
          Admin Sign In
        </h1>
        <p style={{ fontSize: ".85rem", color: "#8a94a6", textAlign: "center", marginBottom: "1.8rem" }}>
          Restricted access — authorized users only
        </p>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: ".75rem 1rem", marginBottom: "1.2rem", fontSize: ".84rem", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#5a6478", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".4rem" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="off"
              required
              style={{
                width: "100%", padding: ".75rem .9rem", border: "1.5px solid #e2e6f0",
                borderRadius: 8, fontSize: ".9rem", color: "#0f1f38", background: "#fafbfd",
                outline: "none", boxSizing: "border-box", transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e2e6f0"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#5a6478", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".4rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                style={{
                  width: "100%", padding: ".75rem 2.8rem .75rem .9rem", border: "1.5px solid #e2e6f0",
                  borderRadius: 8, fontSize: ".9rem", color: "#0f1f38", background: "#fafbfd",
                  outline: "none", boxSizing: "border-box", transition: "border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e6f0"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: ".75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8a94a6", fontSize: "1rem", lineHeight: 1, padding: 0 }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              marginTop: ".5rem", background: "#0f1f38", color: "#fff", border: "none",
              padding: ".85rem", borderRadius: 8, fontSize: ".92rem", fontWeight: 600,
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              opacity: loading || !email || !password ? 0.55 : 1,
              transition: "all .2s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".75rem", color: "#c0c7d4" }}>
          <a href="/" style={{ color: "#c0c7d4", textDecoration: "none" }}>← Back to site</a>
        </p>
      </div>
    </div>
  );
}
