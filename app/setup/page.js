"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PLAN_LIMITS = { Starter: 1, Pro: 3, Agency: 10 };

export default function Setup() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]); // array of selected location objects
  const [saving, setSaving] = useState(false);
  const [planLabel, setPlanLabel] = useState("");
  const [locationLimit, setLocationLimit] = useState(1);

  useEffect(() => {
    let planFound = false;
    const match = document.cookie.match(/rr_signup=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        if (data.plan) {
          setPlanLabel(`${data.plan} · ${data.billing === "annual" ? "Annual" : "Monthly"}`);
          setLocationLimit(PLAN_LIMITS[data.plan] || 1);
          planFound = true;
        }
      } catch {}
    }
    if (!planFound) {
      // Cookie expired or missing — default to Starter (1 location) with upgrade prompt
      setPlanLabel("");
      setLocationLimit(1);
    }

    fetch("/api/locations")
      .then(r => r.json())
      .then(data => {
        const locs = data.locations || [];
        setLocations(locs);
      })
      .catch(() => setError("Failed to load locations. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  function toggleLocation(loc) {
    setSelected(prev => {
      const isSelected = prev.some(s => s.id === loc.id);
      if (isSelected) return prev.filter(s => s.id !== loc.id);
      if (prev.length >= locationLimit) return prev; // at limit, ignore
      return [...prev, loc];
    });
  }

  async function handleContinue() {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      await fetch("/api/locations/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: selected[0].id,
          locationName: selected[0].name,
          locations: selected.map(l => ({ id: l.id, name: l.name })),
        }),
      });
    } catch {}
    setSaving(false);
    router.push("/payment");
  }

  const canSelectMore = selected.length < locationLimit;

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
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 8px 40px rgba(15,31,56,0.10)",
        }}>
          {/* Step indicator */}
          <div style={{display:"flex",justifyContent:"center",gap:".5rem",marginBottom:"1.8rem"}}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{width:s===3?24:8,height:8,borderRadius:4,background:s<=3?"#0f1f38":"#e5e7eb",transition:"all .3s"}} />
            ))}
          </div>

          <div style={{textAlign:"center",marginBottom:"1rem"}}>
            {planLabel ? (
              <span style={{background:"rgba(15,31,56,0.07)",borderRadius:100,padding:".3rem .9rem",fontSize:".8rem",fontWeight:600,color:"#0f1f38"}}>
                ✓ {planLabel}
              </span>
            ) : (
              <a href="/" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:100,padding:".3rem .9rem",fontSize:".8rem",fontWeight:600,color:"#ef4444",textDecoration:"none",display:"inline-block"}}>
                ⚠ No plan selected — go back to choose one
              </a>
            )}
          </div>

          <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
            <div style={{fontSize:"2.2rem",marginBottom:".7rem"}}>📍</div>
            <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.8rem",color:"#0f1f38",letterSpacing:"-.02em",marginBottom:".5rem",fontWeight:400}}>
              Select your Business {locationLimit > 1 ? "Profiles" : "Profile"}
            </h1>
            <p style={{color:"#6b7280",fontSize:".92rem",margin:0,lineHeight:1.5}}>
              {locationLimit > 1
                ? `Choose up to ${locationLimit} locations for ReplyRight to manage.`
                : "Choose the Google Business location you want ReplyRight to manage reviews for."}
            </p>
          </div>

          {loading && (
            <div style={{textAlign:"center",padding:"2.5rem 0",color:"#9ca3af",fontSize:".9rem"}}>
              Loading your business locations…
            </div>
          )}

          {error && (
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"1rem",marginBottom:"1.2rem"}}>
              <p style={{color:"#ef4444",fontSize:".85rem",margin:"0 0 .4rem",fontWeight:600}}>{error}</p>
              <p style={{color:"#6b7280",fontSize:".8rem",margin:0}}>Make sure you signed in with the Google account that manages your Business Profile.</p>
            </div>
          )}

          {!loading && !error && locations.length === 0 && (
            <div style={{background:"rgba(251,191,36,0.12)",border:"1.5px solid rgba(251,191,36,0.4)",borderRadius:10,padding:"1rem",marginBottom:"1.2rem"}}>
              <p style={{margin:0,fontSize:".87rem",color:"#0f1f38",lineHeight:1.5}}>
                ⚠️ <strong>No Business Profiles found</strong> on this Google account.<br/>
                Make sure you used the Google account that manages your Google Business Profile — not a personal Gmail.
              </p>
            </div>
          )}

          {!loading && locations.length > 0 && (
            <>
              {locationLimit > 1 && (
                <p style={{fontSize:".8rem",color:"#6b7280",marginBottom:".7rem",marginTop:0}}>
                  {selected.length} of {locationLimit} selected
                </p>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:".65rem",marginBottom:"1.4rem",maxHeight:"320px",overflowY:"auto"}}>
                {locations.map(loc => {
                  const isSelected = selected.some(s => s.id === loc.id);
                  const isDisabled = !isSelected && !canSelectMore;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => !isDisabled && toggleLocation(loc)}
                      style={{
                        padding:"1rem 1.1rem",
                        borderRadius:12,
                        border: isSelected ? "2px solid #0f1f38" : "1.5px solid #e5e7eb",
                        background: isSelected ? "rgba(15,31,56,0.05)" : isDisabled ? "#f9fafb" : "white",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.5 : 1,
                        transition:"all .15s",
                        display:"flex",
                        alignItems:"center",
                        gap:".8rem",
                      }}
                    >
                      {/* Radio for single, checkbox for multi */}
                      {locationLimit === 1 ? (
                        <div style={{
                          width:20,height:20,borderRadius:"50%",
                          border: isSelected ? "6px solid #0f1f38" : "2px solid #d1d5db",
                          flexShrink:0,transition:"all .15s",
                        }} />
                      ) : (
                        <div style={{
                          width:20,height:20,borderRadius:5,flexShrink:0,transition:"all .15s",
                          border: isSelected ? "none" : "2px solid #d1d5db",
                          background: isSelected ? "#0f1f38" : "white",
                          display:"flex",alignItems:"center",justifyContent:"center",
                        }}>
                          {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      )}
                      <div>
                        <div style={{fontWeight:600,fontSize:".93rem",color:"#0f1f38"}}>{loc.name}</div>
                        {loc.address && <div style={{fontSize:".78rem",color:"#9ca3af",marginTop:".15rem"}}>{loc.address}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Upgrade nudge */}
          <div style={{textAlign:"center",marginBottom:"1rem"}}>
            <a href="/upgrade" style={{fontSize:".8rem",color:"#2e7df7",textDecoration:"none",fontWeight:500}}>
              Need more locations? Upgrade your plan →
            </a>
          </div>

          <button
            onClick={handleContinue}
            disabled={selected.length === 0 || saving}
            style={{
              width:"100%",
              padding:"1rem",
              borderRadius:12,
              background: (selected.length === 0 || saving) ? "#9ca3af" : "#0f1f38",
              color:"white",
              border:"none",
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"1rem",
              fontWeight:600,
              cursor: (selected.length === 0 || saving) ? "not-allowed" : "pointer",
              transition:"all .2s",
            }}
          >
            {saving ? "Saving…" : "Continue →"}
          </button>

          <p style={{textAlign:"center",fontSize:".76rem",color:"#9ca3af",marginTop:".8rem",marginBottom:0}}>
            You can change your connected location in dashboard settings later.
          </p>
        </div>
      </div>
    </div>
  );
}
