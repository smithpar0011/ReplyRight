"use client";
import { useState, useEffect } from "react";

const PRICES = {
  Starter: { monthly: 29, annual: 25 },
  Pro:     { monthly: 59, annual: 50 },
  Agency:  { monthly: 149, annual: 127 },
};

export default function Payment() {
  const [plan, setPlan] = useState("Pro");
  const [billing, setBilling] = useState("monthly");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const annual = billing === "annual";
  const price = PRICES[plan] ? (annual ? PRICES[plan].annual : PRICES[plan].monthly) : 0;
  const savings = PRICES[plan] ? (PRICES[plan].monthly - PRICES[plan].annual) * 12 : 0;

  useEffect(() => {
    // Read plan/billing from rr_signup cookie
    const signupMatch = document.cookie.match(/rr_signup=([^;]+)/);
    if (signupMatch) {
      try {
        const data = JSON.parse(decodeURIComponent(signupMatch[1]));
        if (data.plan) setPlan(data.plan);
        if (data.billing) setBilling(data.billing);
      } catch {}
    }

    // Read user info from rr_user cookie
    const userMatch = document.cookie.match(/rr_user=([^;]+)/);
    if (userMatch) {
      try {
        setUser(JSON.parse(decodeURIComponent(userMatch[1])));
      } catch {}
    }
  }, []);

  async function handleStartTrial() {
    setLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError(data.error || "Something went wrong. Please try again.");
    } catch {
      setCheckoutError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#eef3ff 0%,#f8f5ef 60%,#f2eeff 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px solid rgba(15,31,56,0.07)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
      }}>
        <a href="/" style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "1.4rem",
          fontWeight: 400,
          color: "#0f1f38",
          letterSpacing: "-.02em",
          textDecoration: "none",
        }}>
          Reply<span style={{color:"#2e7df7"}}>Right</span>
        </a>
        <button
          onClick={() => { window.location.href = "/api/auth/logout"; }}
          style={{
            background: "none",
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            padding: ".35rem .9rem",
            fontSize: ".8rem",
            color: "#6b7280",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          Sign out
        </button>
      </div>

      {/* Card */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"2.5rem 1rem"}}>
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "2.5rem 2rem",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 8px 40px rgba(15,31,56,0.10)",
        }}>
          {/* Step indicator */}
          <div style={{display:"flex",justifyContent:"center",gap:".5rem",marginBottom:"1.8rem"}}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{width:s===4?24:8,height:8,borderRadius:4,background:"#0f1f38",transition:"all .3s"}} />
            ))}
          </div>

          <div style={{textAlign:"center",marginBottom:"1.6rem"}}>
            <div style={{fontSize:"2rem",marginBottom:".7rem"}}>💳</div>
            <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.8rem",color:"#0f1f38",letterSpacing:"-.02em",marginBottom:".4rem",fontWeight:400}}>
              Start your free trial
            </h1>
            <p style={{color:"#6b7280",fontSize:".92rem",margin:0,lineHeight:1.5}}>
              Review your plan and start your 14-day free trial. You won't be charged today.
            </p>
          </div>

          {/* Plan summary */}
          <div style={{background:"#f8f7f4",borderRadius:12,padding:"1.2rem",marginBottom:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".5rem"}}>
              <span style={{fontSize:".95rem",fontWeight:700,color:"#0f1f38"}}>{plan} Plan</span>
              <span style={{fontSize:"1.15rem",fontWeight:700,color:"#0f1f38"}}>${price}/mo</span>
            </div>
            <div style={{fontSize:".78rem",color:"#9ca3af",marginBottom: annual || !PRICES[plan] ? 0 : ".8rem"}}>
              {annual ? `Billed $${price * 12}/year` : "Billed monthly"} · 14-day free trial
            </div>
            {!annual && PRICES[plan] && (
              <div
                onClick={() => {
                  setBilling("annual");
                  // Update the cookie too
                  const match = document.cookie.match(/rr_signup=([^;]+)/);
                  if (match) {
                    try {
                      const d = JSON.parse(decodeURIComponent(match[1]));
                      d.billing = "annual";
                      document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify(d))}; Path=/; SameSite=Lax; Max-Age=604800`;
                    } catch {}
                  }
                }}
                style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:8,padding:".6rem .8rem",cursor:"pointer",marginTop:".8rem"}}
              >
                <p style={{fontSize:".78rem",color:"#16a34a",margin:0,fontWeight:600}}>
                  💡 Switch to annual and save ${savings}/year
                </p>
              </div>
            )}
          </div>

          {/* Connected Google account */}
          {user && (
            <div style={{background:"#f8f7f4",borderRadius:12,padding:".9rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".8rem"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"#0f1f38",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",fontWeight:700,flexShrink:0}}>
                {user.name?.[0] || "G"}
              </div>
              <div>
                <div style={{fontSize:".88rem",fontWeight:600,color:"#0f1f38"}}>{user.name || "Google Account"}</div>
                <div style={{fontSize:".75rem",color:"#9ca3af"}}>{user.email || "Connected"}</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:".72rem",color:"#16a34a",fontWeight:600,whiteSpace:"nowrap"}}>✓ Connected</span>
            </div>
          )}

          {checkoutError && (
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:".75rem 1rem",marginBottom:"1rem"}}>
              <p style={{color:"#ef4444",fontSize:".85rem",margin:0}}>{checkoutError}</p>
            </div>
          )}

          <button
            onClick={handleStartTrial}
            disabled={loading}
            style={{
              width:"100%",
              padding:"1rem",
              borderRadius:12,
              background: loading ? "#9ca3af" : "#0f1f38",
              color:"white",
              border:"none",
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"1rem",
              fontWeight:600,
              cursor: loading ? "not-allowed" : "pointer",
              transition:"all .2s",
            }}
          >
            {loading ? "Redirecting to checkout…" : "Start 14-Day Free Trial →"}
          </button>

          <p style={{textAlign:"center",fontSize:".76rem",color:"#9ca3af",marginTop:".8rem",marginBottom:0}}>
            Your card won't be charged until after your 14-day trial. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
