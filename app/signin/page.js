"use client";
import { useState, useEffect } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "no_account") {
      setError("No account found for that Google account. Please sign up first.");
    } else if (params.get("error") === "1") {
      const detail = params.get("detail");
      setError("Google sign-in failed." + (detail ? " Error: " + decodeURIComponent(detail) : " Please try again."));
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

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
        setError(data.error || "Invalid email or password");
        return;
      }
      // Store plan info if available
      if (data.user?.plan) {
        document.cookie = `rr_plan=${data.user.plan}; Path=/; SameSite=Lax; Max-Age=2592000`;
        localStorage.setItem("rr_plan", data.user.plan);
      }
      if (data.user?.billing) {
        document.cookie = `rr_billing=${data.user.billing}; Path=/; SameSite=Lax; Max-Age=2592000`;
        localStorage.setItem("rr_billing", data.user.billing);
      }
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch {
      // Still show success (don't reveal if email exists)
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
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
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d1e35 50%, #0a1628 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", left: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

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
        position: "relative",
        zIndex: 1,
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 32, fontWeight: 400, fontFamily: "'Instrument Serif', serif", color: "#fff", letterSpacing: "-0.02em" }}>
              Reply<span style={{ color: "#3b82f6" }}>Right</span>
            </span>
          </div>
        </a>

        {/* ── FORGOT PASSWORD MODE ── */}
        {forgotMode ? (
          <>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 10px", letterSpacing: -0.5 }}>
              Reset your password
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            {forgotSent ? (
              <div style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 10,
                padding: "16px",
                marginBottom: 24,
              }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  ✓ If an account exists with that email, you'll receive a reset link shortly. Check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, marginBottom: 16 }}
                  onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#3b82f6",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    opacity: forgotLoading ? 0.7 : 1,
                    marginBottom: 16,
                  }}
                >
                  {forgotLoading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}

            <button
              onClick={() => { setForgotMode(false); setForgotSent(false); }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Back to sign in
            </button>
          </>
        ) : (
          /* ── SIGN IN MODE ── */
          <>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 10px", letterSpacing: -0.5 }}>
              Welcome back
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
              Sign in to your ReplyRight dashboard
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ ...inputStyle, marginBottom: 12 }}
                onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <div style={{ position: "relative", marginBottom: 8 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, marginBottom: 0, paddingRight: 44 }}
                  onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.35)", padding: 0, lineHeight: 1,
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>

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
                  padding: "15px 24px",
                  background: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1f2937",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            <a href="/api/auth/google" style={{ textDecoration: "none", display: "block" }}>
              <button style={{
                width: "100%",
                padding: "13px 24px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
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

            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: "24px 0 20px", lineHeight: 1.6 }}>
              By signing in, you agree to our{" "}
              <a href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms</a>
              {" "}and{" "}
              <a href="/privacy" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Privacy Policy</a>
            </p>

            <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: 0 }}>
                Don't have an account?{" "}
                <a href="/#pricing" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                  Start Free Trial →
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
