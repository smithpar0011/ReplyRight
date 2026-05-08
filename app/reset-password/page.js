"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    fontSize: 14,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d1e35 50%, #0a1628 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "2rem",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "52px 44px",
        width: "100%",
        maxWidth: 440,
        textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        backdropFilter: "blur(16px)",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
              Reply<span style={{ color: "#3b82f6" }}>Right</span>
            </span>
          </div>
        </a>

        {!token ? (
          <>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 16px" }}>Invalid Reset Link</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              This password reset link is invalid or has expired.
            </p>
            <a href="/signin" style={{ color: "#3b82f6", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              ← Back to Sign In
            </a>
          </>
        ) : success ? (
          <>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✓</div>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>Password Updated</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <a
              href="/signin"
              style={{
                display: "inline-block",
                background: "#fff",
                color: "#1f2937",
                padding: "14px 32px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Sign In →
            </a>
          </>
        ) : (
          <>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 10px" }}>Create new password</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>
              Enter your new password below. Must be at least 8 characters.
            </p>

            <form onSubmit={handleReset}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                style={{ ...inputStyle, marginBottom: 12 }}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={8}
                style={{ ...inputStyle, marginBottom: 20 }}
              />

              {error && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                }}>
                  <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1f2937",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1628", color: "#fff" }}>Loading…</div>}>
      <ResetContent />
    </Suspense>
  );
}
