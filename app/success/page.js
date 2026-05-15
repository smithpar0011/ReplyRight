"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const [planInfo, setPlanInfo] = useState(null);
  const [backfillState, setBackfillState] = useState("idle"); // idle | running | done | error
  const [backfillResult, setBackfillResult] = useState(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(async data => {
        if (data.plan) {
          setPlanInfo(data);
          document.cookie = `rr_plan=${data.plan}; Path=/; SameSite=Lax; Max-Age=2592000`;
          document.cookie = `rr_billing=${data.billing}; Path=/; SameSite=Lax; Max-Age=2592000`;
          localStorage.setItem("rr_plan", data.plan);
          localStorage.setItem("rr_billing", data.billing);

          // Trigger backfill after plan is set
          setBackfillState("running");
          try {
            const bf = await fetch("/api/reviews/backfill", { method: "POST" });
            const bfData = await bf.json();
            setBackfillResult(bfData);
            setBackfillState("done");
          } catch {
            setBackfillState("error");
          }
        }
      })
      .catch(() => setBackfillState("error"));
  }, [params]);

  const isDone = backfillState === "done" || backfillState === "error";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#eef3ff 0%,#f8f5ef 60%,#f2eeff 100%)", fontFamily: "'DM Sans',sans-serif", padding: "2rem" }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .spinner { display:inline-block; width:20px; height:20px; border:2.5px solid #e5e7eb; border-top-color:#0f1f38; border-radius:50%; animation:spin .7s linear infinite; vertical-align:middle; margin-right:8px; }
        .progress-bar-bg { background:#f3f4f6; border-radius:100px; height:6px; margin-top:.5rem; overflow:hidden; }
        .progress-bar-fill { height:100%; background:#0f1f38; border-radius:100px; animation:pulse 1.5s ease infinite; }
      `}</style>
      <div style={{ background: "white", borderRadius: 24, padding: "3rem 2.5rem", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(15,31,56,.10)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "2rem", color: "#0f1f38", marginBottom: ".6rem", letterSpacing: "-.02em" }}>
          You're all set!
        </h1>
        <p style={{ color: "#4a5568", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1.8rem" }}>
          Your 14-day free trial has started{planInfo ? ` on the ${planInfo.plan} plan` : ""}.
        </p>

        {/* Backfill status */}
        <div style={{ background: "#f8f7f4", borderRadius: 12, padding: "1.1rem 1.3rem", marginBottom: "1.5rem", textAlign: "left" }}>
          {backfillState === "idle" && (
            <p style={{ color: "#6b7280", fontSize: ".88rem", margin: 0 }}>Setting up your account…</p>
          )}
          {backfillState === "running" && (
            <>
              <p style={{ color: "#0f1f38", fontSize: ".9rem", fontWeight: 600, margin: "0 0 .4rem" }}>
                <span className="spinner" />
                Responding to your existing reviews…
              </p>
              <p style={{ color: "#6b7280", fontSize: ".8rem", margin: "0 0 .6rem" }}>
                Our AI is catching up on your unanswered reviews. This may take up to a minute.
              </p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "60%" }} />
              </div>
            </>
          )}
          {backfillState === "done" && backfillResult && !backfillResult.skipped && (
            <p style={{ color: "#16a34a", fontSize: ".9rem", fontWeight: 600, margin: 0 }}>
              ✓ Responded to {backfillResult.responded} of {backfillResult.total} existing reviews
            </p>
          )}
          {(backfillState === "done" && backfillResult?.skipped) && (
            <p style={{ color: "#6b7280", fontSize: ".88rem", margin: 0 }}>✓ Account ready</p>
          )}
          {backfillState === "error" && (
            <p style={{ color: "#6b7280", fontSize: ".88rem", margin: 0 }}>✓ Account ready — you can respond to existing reviews from the dashboard</p>
          )}
        </div>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            background: isDone ? "#0f1f38" : "#9ca3af",
            color: "white",
            padding: ".85rem 2rem",
            borderRadius: 100,
            fontWeight: 600,
            fontSize: ".92rem",
            textDecoration: "none",
            marginBottom: "1rem",
            pointerEvents: isDone ? "auto" : "none",
            transition: "background .3s",
          }}
        >
          Go to Dashboard →
        </a>
        {isDone && (
          <p style={{ color: "#8896a7", fontSize: ".8rem" }}>Your dashboard is ready.</p>
        )}
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
