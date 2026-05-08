"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const [seconds, setSeconds] = useState(5);
  const [planInfo, setPlanInfo] = useState(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.plan) {
            setPlanInfo(data);
            // Store plan info in cookies and localStorage
            document.cookie = `rr_plan=${data.plan}; Path=/; SameSite=Lax; Max-Age=2592000`;
            document.cookie = `rr_billing=${data.billing}; Path=/; SameSite=Lax; Max-Age=2592000`;
            localStorage.setItem("rr_plan", data.plan);
            localStorage.setItem("rr_billing", data.billing);
          }
        })
        .catch(err => console.error("Failed to fetch session:", err));
    }

    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    const r = setTimeout(() => (window.location.href = "/dashboard"), 5000);
    return () => {
      clearInterval(t);
      clearTimeout(r);
    };
  }, [params]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#eef3ff 0%,#f8f5ef 60%,#f2eeff 100%)", fontFamily: "'DM Sans',sans-serif", padding: "2rem" }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
      <div style={{ background: "white", borderRadius: 24, padding: "3rem 2.5rem", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(15,31,56,.10)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "2rem", color: "#0f1f38", marginBottom: ".6rem", letterSpacing: "-.02em" }}>
          You're all set!
        </h1>
        <p style={{ color: "#4a5568", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1.8rem" }}>
          Your 14-day free trial has started{planInfo ? ` on the ${planInfo.plan} plan` : ""}.
          Taking you to your dashboard now.
        </p>
        <a href="/dashboard" style={{ display: "inline-block", background: "#0f1f38", color: "white", padding: ".85rem 2rem", borderRadius: 100, fontWeight: 600, fontSize: ".92rem", textDecoration: "none", marginBottom: "1.2rem" }}>
          Go to Dashboard →
        </a>
        <p style={{ color: "#8896a7", fontSize: ".8rem" }}>
          Redirecting automatically in {seconds}s…
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
