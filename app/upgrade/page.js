"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    name: "Starter",
    locations: 1,
    monthly: 29,
    annual: 25,
    features: ["Up to 50 reviews/mo", "1 business location", "AI responses · 4 tone styles", "Email support"],
  },
  {
    name: "Pro",
    locations: 3,
    monthly: 59,
    annual: 50,
    features: ["Unlimited reviews", "Up to 3 locations", "Expanded tone library", "Priority support"],
    popular: true,
  },
  {
    name: "Agency",
    locations: 10,
    monthly: 149,
    annual: 127,
    features: ["Unlimited reviews", "Up to 10 locations", "Tone library per location", "Dedicated support"],
  },
];

export default function Upgrade() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Starter");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const match = document.cookie.match(/rr_signup=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        if (data.plan) setCurrentPlan(data.plan);
        if (data.billing === "annual") setAnnual(true);
      } catch {}
    }
  }, []);

  function handleSelect(plan) {
    setSelected(plan.name);
    // Update the rr_signup cookie with new plan
    const match = document.cookie.match(/rr_signup=([^;]+)/);
    let existing = {};
    if (match) {
      try { existing = JSON.parse(decodeURIComponent(match[1])); } catch {}
    }
    existing.plan = plan.name;
    existing.billing = annual ? "annual" : "monthly";
    document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify(existing))}; Path=/; SameSite=Lax; Max-Age=604800`;
    setTimeout(() => router.push("/setup"), 300);
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
        <a href="/setup" style={{
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
          onClick={() => router.push("/setup")}
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
          ← Back
        </button>
      </div>

      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"2.5rem 1rem"}}>
        <div style={{maxWidth: 580, width: "100%"}}>

          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:"2rem",color:"#0f1f38",letterSpacing:"-.02em",marginBottom:".5rem",fontWeight:400}}>
              Choose your plan
            </h1>
            <p style={{color:"#6b7280",fontSize:".92rem",margin:"0 0 1.2rem",lineHeight:1.5}}>
              Select the plan that fits your number of locations.
            </p>

            {/* Billing toggle */}
            <div style={{display:"inline-flex",alignItems:"center",gap:".6rem",background:"white",borderRadius:100,padding:".3rem .5rem",boxShadow:"0 1px 6px rgba(15,31,56,0.08)"}}>
              <button
                onClick={() => setAnnual(false)}
                style={{
                  padding:".3rem .9rem",borderRadius:100,border:"none",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",fontWeight:600,
                  background: !annual ? "#0f1f38" : "transparent",
                  color: !annual ? "white" : "#6b7280",
                  transition:"all .2s",
                }}
              >Monthly</button>
              <button
                onClick={() => setAnnual(true)}
                style={{
                  padding:".3rem .9rem",borderRadius:100,border:"none",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",fontWeight:600,
                  background: annual ? "#0f1f38" : "transparent",
                  color: annual ? "white" : "#6b7280",
                  transition:"all .2s",
                  display:"flex",alignItems:"center",gap:".4rem",
                }}
              >
                Annual
                <span style={{background:"#16a34a",color:"white",fontSize:".65rem",padding:".1rem .4rem",borderRadius:100,fontWeight:700}}>SAVE 15%</span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div style={{display:"flex",flexDirection:"column",gap:".8rem"}}>
            {PLANS.map(plan => {
              const price = annual ? plan.annual : plan.monthly;
              const isCurrent = plan.name === currentPlan;
              const isSelected = plan.name === selected;
              const highlight = plan.popular;

              return (
                <div
                  key={plan.name}
                  onClick={() => handleSelect(plan)}
                  style={{
                    background: highlight ? "#0f1f38" : "white",
                    borderRadius: 16,
                    padding: "1.3rem 1.5rem",
                    border: isSelected ? "2px solid #2e7df7" : highlight ? "2px solid #0f1f38" : "1.5px solid #e5e7eb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all .15s",
                    boxShadow: highlight ? "0 4px 24px rgba(15,31,56,0.18)" : "0 1px 6px rgba(15,31,56,0.05)",
                    position: "relative",
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: isSelected ? "7px solid #2e7df7" : highlight ? "2px solid rgba(255,255,255,0.4)" : "2px solid #d1d5db",
                    transition: "all .15s",
                  }} />

                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".3rem"}}>
                      <span style={{fontWeight:700,fontSize:"1rem",color: highlight ? "white" : "#0f1f38"}}>
                        {plan.name}
                      </span>
                      {plan.popular && (
                        <span style={{background:"#2e7df7",color:"white",fontSize:".65rem",padding:".15rem .5rem",borderRadius:100,fontWeight:700}}>
                          POPULAR
                        </span>
                      )}
                      {isCurrent && !isSelected && (
                        <span style={{background:"rgba(255,255,255,0.15)",color: highlight ? "rgba(255,255,255,0.7)" : "#9ca3af",fontSize:".65rem",padding:".15rem .5rem",borderRadius:100,fontWeight:600}}>
                          current
                        </span>
                      )}
                    </div>
                    <div style={{fontSize:".82rem",color: highlight ? "rgba(255,255,255,0.65)" : "#6b7280"}}>
                      Up to {plan.locations} location{plan.locations > 1 ? "s" : ""} · {plan.features[1] || plan.features[0]}
                    </div>
                  </div>

                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"1.4rem",fontWeight:700,color: highlight ? "white" : "#0f1f38",lineHeight:1}}>
                      ${price}
                    </div>
                    <div style={{fontSize:".72rem",color: highlight ? "rgba(255,255,255,0.5)" : "#9ca3af"}}>
                      /mo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{textAlign:"center",fontSize:".76rem",color:"#9ca3af",marginTop:"1.2rem"}}>
            All plans include a 14-day free trial. No charge until after your trial.
          </p>
        </div>
      </div>
    </div>
  );
}
