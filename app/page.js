"use client";
import { useState, useEffect } from "react";
import { BUSINESS_TYPE_OPTIONS } from "./lib/businessTypes";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{background:"var(--white)",border:"1.5px solid var(--cream-dark)",borderRadius:12,padding:"1.2rem 1.4rem",cursor:"pointer",transition:"box-shadow .2s",boxShadow:open?"0 4px 20px rgba(15,31,56,.08)":"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem"}}>
        <div style={{fontSize:".92rem",fontWeight:600,color:"var(--navy)"}}>{q}</div>
        <div style={{fontSize:"1.1rem",color:"var(--text-light)",flexShrink:0,transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</div>
      </div>
      {open && <div style={{fontSize:".88rem",color:"var(--text-mid)",lineHeight:1.7,marginTop:".8rem",paddingTop:".8rem",borderTop:"1px solid var(--cream-dark)"}}>{a}</div>}
    </div>
  );
}

export default function Home() {
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("restaurant");
  const [reviewText, setReviewText] = useState(
    "The food was absolutely amazing — the pasta was perfectly cooked and the tiramisu was to die for. Service was a little slow but our waiter was very friendly. Will definitely come back!"
  );
  const [stars, setStars] = useState(4);
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Improvement 1: Email capture modal
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalSubmitted, setModalSubmitted] = useState(false);

  // Contact modal
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const sendContact = () => {
    if (!contactEmail.trim() || !contactMsg.trim()) return;
    const subject = encodeURIComponent(`ReplyRight Support${contactName ? ` — ${contactName}` : ""}`);
    const body = encodeURIComponent(`Name: ${contactName || "Not provided"}\nEmail: ${contactEmail}\n\nMessage:\n${contactMsg}`);
    window.location.href = `mailto:Support@replyrightapp.com?subject=${subject}&body=${body}`;
    setTimeout(() => { setShowContact(false); setContactName(""); setContactEmail(""); setContactMsg(""); }, 400);
  };

  // Improvement 4: Response history
  const [history, setHistory] = useState([]);

  // Improvement 5: Annual pricing toggle
  const [annual, setAnnual] = useState(false);

  // Improvement 3: Activity ticker
  const [tickerIdx, setTickerIdx] = useState(0);

  const TICKER_ITEMS = [
    "Mario's Italian Kitchen · 5-star reply sent · just now",
    "Studio K Hair Salon · 4-star review addressed · 1 min ago",
    "Downtown Dental · responded to 2-star review · 2 min ago",
    "AutoFix Garage · 5-star reply sent · 3 min ago",
    "Peak Performance Gym · 3-star review addressed · 4 min ago",
    "Harbor Hotel · 5-star reply sent · 5 min ago",
    "Bloom Florist · 1-star review turned around · 6 min ago",
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rr_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length),
      3200
    );
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const generate = async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bizName, bizType, stars, reviewText, tone }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setResult(data.response);
        const entry = {
          id: Date.now(),
          bizName: bizName || "Your Business",
          bizType,
          stars,
          tone,
          reviewSnippet:
            reviewText.slice(0, 72) + (reviewText.length > 72 ? "…" : ""),
          response: data.response,
        };
        const newHistory = [entry, ...history].slice(0, 5);
        setHistory(newHistory);
        try {
          localStorage.setItem("rr_history", JSON.stringify(newHistory));
        } catch {}
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = () => {
    setShowModal(true);
    setModalSubmitted(false);
    setModalEmail("");
    setModalName("");
  };

  const submitModal = (e) => {
    e.preventDefault();
    if (!modalEmail.trim()) return;
    try {
      const leads = JSON.parse(localStorage.getItem("rr_leads") || "[]");
      leads.push({ name: modalName, email: modalEmail, ts: Date.now() });
      localStorage.setItem("rr_leads", JSON.stringify(leads));
    } catch {}
    setModalSubmitted(true);
  };

  const PRICES = {
    Starter: { monthly: 29, annual: 22 },
    Pro: { monthly: 59, annual: 44 },
    Agency: { monthly: 149, annual: 112 },
  };

  const starLabel = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <>
      <style suppressHydrationWarning>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea, button { font-family: 'DM Sans', sans-serif; font-size: inherit; }
        :root {
          --navy: #0f1f38; --blue: #1e4d8c; --accent: #2e7df7;
          --accent-light: #5b9bff; --gold: #c8a96e; --gold-light: #e8cfa0;
          --cream: #f8f5ef; --cream-dark: #ede8de; --white: #ffffff;
          --text-dark: #0f1f38; --text-mid: #4a5568; --text-light: #8896a7;
          --success: #16a34a; --star: #f59e0b;
        }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes dotBounce { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes tickerFade { 0%{opacity:0;transform:translateY(6px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        .animate { animation: fadeUp 0.7s ease both; }
        .animate-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .animate-3 { animation: fadeUp 0.7s 0.3s ease both; }

        nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 3rem;
          background: rgba(248,245,239,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,169,110,0.2);
        }
        .logo { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--navy); }
        .logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 2rem; align-items: center; }
        .nav-btn { background: none; border: none; color: var(--text-mid); font-size: .88rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .nav-cta { background: var(--navy)!important; color: white!important; padding: .5rem 1.3rem; border-radius: 6px; font-weight: 600!important; }

        .hero {
          min-height: 92vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem 2rem 4rem; text-align: center;
          background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(30,77,140,.12) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 30% at 80% 80%, rgba(200,169,110,.08) 0%, transparent 60%), var(--cream);
        }
        .badge {
          display: inline-flex; align-items: center; gap: .5rem;
          background: var(--white); border: 1px solid var(--cream-dark);
          padding: .4rem 1rem; border-radius: 100px;
          font-size: .78rem; font-weight: 500; color: var(--text-mid);
          margin-bottom: 1.8rem; box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
        h1 { font-family: 'Instrument Serif', serif; font-size: clamp(2.6rem,5.5vw,4.5rem); line-height: 1.1; letter-spacing: -.03em; color: var(--navy); max-width: 780px; }
        h1 em { font-style: italic; color: var(--accent); }
        .hero-sub { font-size: 1.05rem; color: var(--text-mid); max-width: 520px; line-height: 1.7; margin-top: 1.3rem; }
        .hero-actions { display: flex; gap: 1rem; margin-top: 2.2rem; flex-wrap: wrap; justify-content: center; }
        .hero-stats { display: flex; gap: 3rem; margin-top: 3.5rem; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Instrument Serif', serif; font-size: 2rem; color: var(--navy); }
        .stat-label { font-size: .78rem; color: var(--text-light); margin-top: .2rem; font-weight: 500; }

        /* Improvement 3: Ticker */
        .ticker-wrap { margin-top: 2.2rem; display: flex; align-items: center; gap: .6rem; }
        .ticker-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; flex-shrink: 0; }
        .ticker-text { font-size: .78rem; color: var(--text-light); font-weight: 500; animation: tickerFade 3.2s ease infinite; }

        .btn-primary { background: var(--navy); color: white; border: none; padding: .82rem 1.8rem; border-radius: 8px; font-size: .92rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(15,31,56,.25); transition: all .2s; }
        .btn-primary:hover { background: var(--blue); transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: var(--navy); border: 1.5px solid rgba(15,31,56,.25); padding: .82rem 1.8rem; border-radius: 8px; font-size: .92rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .btn-secondary:hover { border-color: var(--navy); background: var(--white); }

        .divider { height: 1px; background: linear-gradient(90deg,transparent,var(--cream-dark),transparent); }
        section { padding: 5rem 2rem; }
        .section-white { background: var(--white); }
        .section-cream { background: var(--cream); }
        .section-label { text-align: center; font-size: .73rem; font-weight: 600; letter-spacing: .12em; color: var(--accent); text-transform: uppercase; margin-bottom: .7rem; }
        .section-title { font-family: 'Instrument Serif', serif; font-size: clamp(1.8rem,3.5vw,2.8rem); text-align: center; color: var(--navy); letter-spacing: -.02em; line-height: 1.2; margin-bottom: .8rem; }
        .section-sub { text-align: center; color: var(--text-mid); font-size: .95rem; max-width: 480px; margin: 0 auto 3rem; line-height: 1.7; }

        /* DEMO */
        .demo-wrap { max-width: 760px; margin: 0 auto; background: var(--cream); border-radius: 16px; border: 1px solid var(--cream-dark); overflow: hidden; box-shadow: 0 8px 40px rgba(15,31,56,.08); }
        .demo-bar { background: var(--navy); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .demo-dots { display: flex; gap: 6px; }
        .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
        .demo-bar-title { color: rgba(255,255,255,.5); font-size: .8rem; }
        .demo-body { padding: 1.8rem; }
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem; }
        .field-label { display: block; font-size: .72rem; font-weight: 600; color: var(--text-mid); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .4rem; }
        .field-input, .field-select, .field-textarea { width: 100%; padding: .7rem .9rem; border: 1.5px solid var(--cream-dark); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: .9rem; color: var(--text-dark); background: var(--white); transition: border-color .2s; outline: none; resize: none; }
        .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: var(--accent); }
        .field-textarea { min-height: 95px; font-family: 'DM Sans', sans-serif; font-size: .9rem; }
        .stars-row { display: flex; gap: .3rem; margin-bottom: 1rem; }
        .star-btn { font-size: 1.6rem; cursor: pointer; transition: all .15s; background: none; border: none; padding: 0; line-height: 1; }

        /* Improvement 2: Tone selector */
        .tone-row { display: flex; gap: .5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
        .tone-pill { padding: .38rem .9rem; border-radius: 100px; font-size: .78rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1.5px solid var(--cream-dark); background: var(--white); color: var(--text-mid); transition: all .15s; }
        .tone-pill:hover { border-color: var(--accent); color: var(--accent); }
        .tone-pill.active { background: var(--navy); border-color: var(--navy); color: white; }

        .gen-btn { width: 100%; background: var(--navy); color: white; border: none; padding: .95rem; border-radius: 8px; font-size: .92rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; margin-top: 1.2rem; }
        .gen-btn:hover:not(:disabled) { background: var(--blue); }
        .gen-btn:disabled { opacity: .6; cursor: not-allowed; }
        .dots { display: inline-flex; gap: 4px; }
        .dots span { width: 5px; height: 5px; border-radius: 50%; background: white; animation: dotBounce 1.2s infinite; }
        .dots span:nth-child(2) { animation-delay: .2s; }
        .dots span:nth-child(3) { animation-delay: .4s; }
        .result-box { margin-top: 1.3rem; padding: 1.4rem; background: var(--white); border-radius: 10px; border: 1.5px solid #86efac; animation: fadeUp .4s ease both; }
        .result-label { font-size: .7rem; font-weight: 700; color: var(--success); text-transform: uppercase; letter-spacing: .1em; margin-bottom: .7rem; }
        .result-text { font-size: .93rem; color: var(--text-dark); line-height: 1.7; white-space: pre-wrap; }
        .result-actions { display: flex; gap: .7rem; margin-top: 1rem; }
        .copy-btn { padding: .48rem .9rem; border-radius: 6px; font-size: .8rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; background: var(--navy); color: white; border: none; }
        .regen-btn { padding: .48rem .9rem; border-radius: 6px; font-size: .8rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; background: transparent; color: var(--text-mid); border: 1.5px solid var(--cream-dark); }
        .error-box { margin-top: 1rem; padding: 12px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626; font-size: .85rem; }

        /* Improvement 4: History */
        .history-wrap { max-width: 760px; margin: 2.5rem auto 0; }
        .history-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-light); margin-bottom: 1rem; }
        .history-grid { display: flex; flex-direction: column; gap: .7rem; }
        .history-card { background: var(--white); border: 1px solid var(--cream-dark); border-radius: 10px; padding: 1rem 1.2rem; display: grid; grid-template-columns: 1fr auto; gap: .5rem; align-items: start; }
        .history-meta { font-size: .75rem; color: var(--text-light); margin-bottom: .25rem; }
        .history-review { font-size: .8rem; color: var(--text-mid); font-style: italic; margin-bottom: .3rem; }
        .history-response { font-size: .82rem; color: var(--text-dark); line-height: 1.55; }
        .history-stars { font-size: .85rem; color: var(--star); }
        .history-copy { padding: .3rem .65rem; border-radius: 5px; font-size: .72rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; background: transparent; color: var(--text-mid); border: 1px solid var(--cream-dark); white-space: nowrap; }
        .history-tone-badge { display: inline-block; background: var(--cream); border: 1px solid var(--cream-dark); border-radius: 100px; padding: .15rem .55rem; font-size: .65rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: .06em; margin-left: .4rem; }

        /* STEPS */
        .steps { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 1.5rem; max-width: 860px; margin: 0 auto; }
        .step { background: var(--white); border-radius: 14px; padding: 1.8rem; border: 1px solid var(--cream-dark); box-shadow: 0 2px 12px rgba(15,31,56,.05); transition: transform .2s; }
        .step:hover { transform: translateY(-3px); }
        .step-num { font-family: 'Instrument Serif', serif; font-size: 2.2rem; color: var(--accent-light); line-height: 1; margin-bottom: .8rem; }
        .step h3 { font-size: .95rem; font-weight: 600; color: var(--navy); margin-bottom: .4rem; }
        .step p { font-size: .84rem; color: var(--text-mid); line-height: 1.6; }

        /* Improvement 5: Pricing toggle */
        .pricing-toggle { display: flex; align-items: center; justify-content: center; gap: .8rem; margin-bottom: 2.5rem; }
        .toggle-label { font-size: .85rem; font-weight: 500; color: var(--text-mid); }
        .toggle-label.active { color: var(--navy); font-weight: 600; }
        .toggle-switch { position: relative; width: 44px; height: 24px; cursor: pointer; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-track { position: absolute; inset: 0; background: var(--cream-dark); border-radius: 100px; transition: background .2s; }
        .toggle-switch input:checked + .toggle-track { background: var(--navy); }
        .toggle-thumb { position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
        .toggle-switch input:checked ~ .toggle-thumb { transform: translateX(20px); }
        .save-badge { background: var(--success); color: white; font-size: .65rem; font-weight: 700; padding: .15rem .5rem; border-radius: 100px; letter-spacing: .04em; }

        /* PRICING */
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 1.4rem; max-width: 860px; margin: 0 auto; }
        .price-card { border-radius: 16px; padding: 2rem; border: 1.5px solid var(--cream-dark); background: var(--cream); position: relative; transition: transform .2s; }
        .price-card:hover { transform: translateY(-3px); }
        .price-card.featured { background: var(--navy); border-color: var(--navy); box-shadow: 0 12px 40px rgba(15,31,56,.3); }
        .price-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--navy); font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: .28rem .85rem; border-radius: 100px; white-space: nowrap; }
        .price-name { font-weight: 600; font-size: .82rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-mid); }
        .price-card.featured .price-name { color: rgba(255,255,255,.55); }
        .price-amount { font-family: 'Instrument Serif', serif; font-size: 2.8rem; color: var(--navy); margin: .6rem 0 .1rem; line-height: 1; }
        .price-card.featured .price-amount { color: white; }
        .price-period { font-size: .78rem; color: var(--text-light); margin-bottom: 1.2rem; }
        .price-card.featured .price-period { color: rgba(255,255,255,.45); }
        .price-features { list-style: none; margin-bottom: 1.6rem; }
        .price-features li { font-size: .84rem; color: var(--text-mid); padding: .38rem 0; border-bottom: 1px solid var(--cream-dark); display: flex; align-items: center; gap: .5rem; }
        .price-card.featured .price-features li { color: rgba(255,255,255,.72); border-color: rgba(255,255,255,.1); }
        .price-features li::before { content: "✓"; color: var(--success); font-weight: 700; }
        .price-card.featured .price-features li::before { color: var(--gold-light); }
        .price-btn { width: 100%; padding: .8rem; border-radius: 8px; font-size: .88rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; transition: all .2s; }
        .btn-outline { background: transparent; color: var(--navy); border: 1.5px solid rgba(15,31,56,.25)!important; }
        .btn-outline:hover { background: white; }
        .btn-solid { background: var(--accent); color: white; }
        .btn-solid:hover { background: var(--accent-light); }
        .price-annual-note { font-size: .72rem; color: var(--text-light); text-align: center; margin-top: .5rem; }
        .price-card.featured .price-annual-note { color: rgba(255,255,255,.35); }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 1.3rem; max-width: 860px; margin: 0 auto; }
        .testi { background: var(--white); border-radius: 14px; padding: 1.6rem; border: 1px solid var(--cream-dark); }
        .testi-stars { color: var(--star); letter-spacing: 2px; margin-bottom: .8rem; }
        .testi-text { font-size: .88rem; color: var(--text-dark); line-height: 1.7; margin-bottom: 1rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: .7rem; }
        .testi-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--navy); display: flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', serif; font-size: 1rem; color: var(--gold-light); flex-shrink: 0; }
        .testi-name { font-size: .84rem; font-weight: 600; color: var(--navy); }
        .testi-role { font-size: .74rem; color: var(--text-light); }

        /* CTA */
        .cta { padding: 6rem 2rem; text-align: center; background: var(--navy); position: relative; overflow: hidden; }
        .cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 50%,rgba(46,125,247,.15) 0%,transparent 70%); }
        .cta h2 { font-family: 'Instrument Serif', serif; font-size: clamp(1.9rem,3.5vw,3rem); color: white; letter-spacing: -.02em; margin-bottom: .9rem; position: relative; z-index: 1; }
        .cta p { color: rgba(255,255,255,.55); font-size: .95rem; margin-bottom: 2.2rem; position: relative; z-index: 1; }
        .cta-btn { background: var(--accent); color: white; border: none; padding: .95rem 2.3rem; border-radius: 8px; font-size: .95rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; position: relative; z-index: 1; }
        .cta-btn:hover { background: var(--accent-light); transform: translateY(-1px); }
        .cta-note { color: rgba(255,255,255,.3); font-size: .76rem; margin-top: .9rem; position: relative; z-index: 1; }
        .guarantee-row { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-top: 1.4rem; position: relative; z-index: 1; }
        .guarantee-badge { display: inline-flex; align-items: center; gap: .4rem; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 100px; padding: .35rem .9rem; font-size: .76rem; color: rgba(255,255,255,.5); }

        footer { background: #0a1628; padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Instrument Serif', serif; font-size: 1.3rem; color: white; }
        .footer-logo span { color: var(--accent); }
        footer p { color: rgba(255,255,255,.3); font-size: .78rem; }

        /* Improvement 1: Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,20,40,.65); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: overlayIn .2s ease both; }
        .modal { background: var(--white); border-radius: 18px; padding: 2.5rem; max-width: 420px; width: 100%; position: relative; box-shadow: 0 24px 80px rgba(10,20,40,.35); animation: modalIn .25s ease both; }
        .modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-light); line-height: 1; padding: .25rem; }
        .modal-close:hover { color: var(--navy); }
        .modal-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.2rem; }
        .modal h3 { font-family: 'Instrument Serif', serif; font-size: 1.55rem; color: var(--navy); margin-bottom: .4rem; letter-spacing: -.02em; }
        .modal-sub { font-size: .88rem; color: var(--text-mid); line-height: 1.6; margin-bottom: 1.5rem; }
        .modal-field { margin-bottom: .9rem; }
        .modal-field label { display: block; font-size: .72rem; font-weight: 600; color: var(--text-mid); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .35rem; }
        .modal-field input { width: 100%; padding: .75rem 1rem; border: 1.5px solid var(--cream-dark); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: .92rem; color: var(--text-dark); outline: none; transition: border-color .2s; }
        .modal-field input:focus { border-color: var(--accent); }
        .modal-submit { width: 100%; background: var(--navy); color: white; border: none; padding: .9rem; border-radius: 8px; font-size: .92rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-top: .4rem; transition: background .2s; }
        .modal-submit:hover { background: var(--blue); }
        .modal-fine { font-size: .72rem; color: var(--text-light); text-align: center; margin-top: .8rem; }
        .modal-success { text-align: center; padding: 1rem 0; }
        .modal-success-icon { font-size: 2.8rem; margin-bottom: .8rem; }
        .modal-success h3 { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--navy); margin-bottom: .5rem; }
        .modal-success p { font-size: .88rem; color: var(--text-mid); line-height: 1.6; }

        @media(max-width:640px) {
          nav { padding: 1rem 1.2rem; }
          .nav-links { display: none; }
          .demo-grid { grid-template-columns: 1fr; }
          .history-card { grid-template-columns: 1fr; }
          footer { flex-direction: column; text-align: center; }
          .why-grid { grid-template-columns: 1fr !important; }
          .beforeafter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Improvement 1: Email Capture Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            {modalSubmitted ? (
              <div className="modal-success">
                <div className="modal-success-icon">🎉</div>
                <h3>You're on the list!</h3>
                <p>We'll email you at <strong>{modalEmail}</strong> with your access link within 24 hours.<br /><br />In the meantime, try the live demo below.</p>
              </div>
            ) : (
              <>
                <div className="modal-icon">✦</div>
                <h3>Connect your Google Business</h3>
                <p className="modal-sub">Link your Google Business Profile and ReplyRight will start responding to your reviews automatically.</p>
                <a href="/api/auth/google" style={{ display: "block", textDecoration: "none" }}>
                  <button className="modal-submit" type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </a>
                <p className="modal-fine">14-day free trial · Cancel anytime · Your data stays private</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav>
        <div className="logo">Reply<span>Right</span></div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => scrollTo("why")}>Why It Works</button>
          <button className="nav-btn" onClick={() => scrollTo("demo")}>Live Demo</button>
          <button className="nav-btn" onClick={() => scrollTo("how")}>How It Works</button>
          <button className="nav-btn" onClick={() => scrollTo("pricing")}>Pricing</button>
          <button className="nav-btn" onClick={() => scrollTo("faq")}>FAQ</button>
          <button className="nav-btn nav-cta" onClick={openModal}>Start Free Trial</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="badge animate">
          <span className="badge-dot" /> AI-Powered · Fully Automated · Live in Minutes
        </div>
        <h1 className="animate-2">Every review answered.<br /><em>Automatically.</em></h1>
        <p className="hero-sub animate-2">ReplyRight responds to every Google review your business receives — within minutes, with professional, personalized replies. No staff. No effort. No missed reviews.</p>
        <div className="hero-actions animate-3">
          <button className="btn-primary" onClick={openModal}>Start Your Free Trial</button>
          <button className="btn-secondary" onClick={() => scrollTo("demo")}>See Live Demo</button>
        </div>
        <div className="hero-stats animate-3">
          {[["4.8★","Avg rating lift in 60 days"],["<2 min","Average response time"],["14,200+","Responses generated"]].map(([n,l]) => (
            <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
        {/* Improvement 3: Activity ticker */}
        <div className="ticker-wrap animate-3">
          <span className="ticker-dot" />
          <span className="ticker-text" key={tickerIdx}>{TICKER_ITEMS[tickerIdx]}</span>
        </div>
      </section>

      <div className="divider" />

      {/* WHY IT WORKS */}
      <section className="section section-white" id="why">
        <div className="section-label">Backed By Research</div>
        <h2 className="section-title">Silence is costing you customers</h2>
        <p className="section-sub">The data is clear — businesses that respond to reviews rank higher, get more clicks, and convert more customers.</p>
        <div style={{maxWidth:900,margin:"0 auto 3rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1.5rem"}}>
          {[
            {stat:"97%", desc:"of customers read business responses before deciding to visit", color:"#2e7df7"},
            {stat:"20%", desc:"of your Google local ranking is now determined by review signals", color:"#0f1f38"},
            {stat:"126%", desc:"more traffic for businesses in Google top 3 local results", color:"#2e7df7"},
            {stat:"82%", desc:"of consumers say reviews are the #1 factor in their trust decision", color:"#0f1f38"},
          ].map(s => (
            <div key={s.stat} style={{background:"var(--cream)",borderRadius:14,padding:"2rem 1.5rem",textAlign:"center",border:"1px solid var(--cream-dark)"}}>
              <div style={{fontFamily:"'Instrument Serif', serif",fontSize:"3rem",fontWeight:700,color:s.color,lineHeight:1,marginBottom:"0.8rem"}}>{s.stat}</div>
              <div style={{fontSize:"0.84rem",color:"var(--text-mid)",lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="why-grid" style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
          <div style={{background:"var(--navy)",borderRadius:16,padding:"2.5rem",color:"white"}}>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#5b9bff",marginBottom:"0.8rem"}}>Google Rankings</div>
            <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.6rem",marginBottom:"1rem",lineHeight:1.2}}>Responding moves you up Google Search</h3>
            <p style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:"1.2rem"}}>Review signals now make up 20% of your local Google ranking — the fastest-growing ranking factor since 2023. Businesses responding to 80%+ of reviews see a 10–20% ranking boost in local search results.</p>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"1.2rem",fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",fontStyle:"italic"}}>Source: BrightLocal Local Search Ranking Factors 2026, Search Engine Land</div>
          </div>
          <div style={{background:"var(--cream)",borderRadius:16,padding:"2.5rem",border:"1px solid var(--cream-dark)"}}>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"0.8rem"}}>Consumer Psychology</div>
            <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.6rem",color:"var(--navy)",marginBottom:"1rem",lineHeight:1.2}}>Your response is an ad to every future customer</h3>
            <p style={{fontSize:"0.9rem",color:"var(--text-mid)",lineHeight:1.8,marginBottom:"1.2rem"}}>97% of people who read reviews also read the owner response. Your reply isn't just for the reviewer — it's a public message to every future customer deciding whether to trust you.</p>
            <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:"1.2rem",fontSize:"0.82rem",color:"var(--text-light)",fontStyle:"italic"}}>Source: ReviewTrackers Consumer Survey, LocaliQ</div>
          </div>
          <div style={{background:"var(--cream)",borderRadius:16,padding:"2.5rem",border:"1px solid var(--cream-dark)"}}>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"0.8rem"}}>The Cost of Silence</div>
            <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.6rem",color:"var(--navy)",marginBottom:"1rem",lineHeight:1.2}}>63% of businesses never respond. Don't be one of them.</h3>
            <p style={{fontSize:"0.9rem",color:"var(--text-mid)",lineHeight:1.8,marginBottom:"1.2rem"}}>63% of customers say a business never responded to their review. Every unanswered review signals to future customers that nobody is home. One unanswered 1-star review can cost up to 30 potential customers.</p>
            <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:"1.2rem",fontSize:"0.82rem",color:"var(--text-light)",fontStyle:"italic"}}>Source: ReviewTrackers, Harvard Business Review</div>
          </div>
          <div style={{background:"var(--accent)",borderRadius:16,padding:"2.5rem",color:"white"}}>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:"0.8rem"}}>Revenue Impact</div>
            <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.6rem",marginBottom:"1rem",lineHeight:1.2}}>Better reviews = measurable revenue growth</h3>
            <p style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.85)",lineHeight:1.8,marginBottom:"1.2rem"}}>Positive Google review profiles are linked to up to 18% revenue growth. Customers spend 31% more with businesses that have excellent reviews. Top 3 local results get 126% more traffic than everyone else.</p>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.25)",paddingTop:"1.2rem",fontSize:"0.82rem",color:"rgba(255,255,255,0.6)",fontStyle:"italic"}}>Source: SocialPilot, Podium Consumer Research, LocaliQ</div>
          </div>
        </div>
        <div style={{maxWidth:700,margin:"3rem auto 0",textAlign:"center",padding:"2.5rem",background:"var(--navy)",borderRadius:16}}>
          <div style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.8rem",color:"white",lineHeight:1.3,marginBottom:"1rem"}}>"Businesses that respond to reviews rank higher, convert more customers, and earn more revenue — automatically."</div>
          <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)"}}>The science is settled. The only question is whether you are doing it.</div>
          <button className="cta-btn" style={{marginTop:"1.5rem"}} onClick={() => scrollTo("demo")}>See It Work — Free Demo Below</button>
        </div>
      </section>

      <div className="divider" />

      {/* DEMO */}
      <section className="section section-white" id="demo">
        <div className="section-label">Live Demo</div>
        <h2 className="section-title">See ReplyRight in action</h2>
        <p className="section-sub">Paste a real review and watch our AI craft a perfect response in seconds.</p>

        <div className="demo-wrap">
          <div className="demo-bar">
            <div className="demo-dots">
              <div className="demo-dot" style={{background:"#ff5f57"}} />
              <div className="demo-dot" style={{background:"#febc2e"}} />
              <div className="demo-dot" style={{background:"#28c840"}} />
            </div>
            <div className="demo-bar-title">ReplyRight — Response Generator</div>
          </div>
          <div className="demo-body">
            <div className="demo-grid">
              <div>
                <label className="field-label">Business Name</label>
                <input className="field-input" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Mario's Italian Kitchen" />
              </div>
              <div>
                <label className="field-label">Business Type</label>
                <select className="field-select" value={bizType} onChange={e => setBizType(e.target.value)}>
                  {BUSINESS_TYPE_OPTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Improvement 2: Tone selector */}
            <label className="field-label">Response Tone</label>
            <div className="tone-row">
              {[
                ["professional","Professional"],
                ["friendly","Friendly"],
                ["apologetic","Apologetic"],
                ["enthusiastic","Enthusiastic"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={`tone-pill${tone === val ? " active" : ""}`}
                  onClick={() => setTone(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="field-label">Star Rating</label>
            <div className="stars-row">
              {[1,2,3,4,5].map(s => (
                <button key={s} className="star-btn" onClick={() => setStars(s)} style={{opacity: s <= stars ? 1 : 0.2, color: "#f59e0b"}}>★</button>
              ))}
            </div>

            <label className="field-label">Customer Review</label>
            <textarea className="field-textarea" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Paste the customer's review here..." style={{fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",fontWeight:400}} />

            <button className="gen-btn" disabled={loading || !reviewText.trim()} onClick={generate}>
              {loading ? <><span>Generating</span>&nbsp;<span className="dots"><span/><span/><span/></span></> : "Generate AI Response"}
            </button>

            {error && <div className="error-box">⚠️ {error}</div>}

            {result && (
              <div className="result-box">
                <div className="result-label">✓ Response Generated</div>
                <div className="result-text">{result}</div>
                <div className="result-actions">
                  <button className="copy-btn" onClick={copy}>{copied ? "Copied!" : "Copy Response"}</button>
                  <button className="regen-btn" onClick={generate}>Regenerate</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Improvement 4: Response history */}
        {history.length > 0 && (
          <div className="history-wrap">
            <div className="history-title">Your recent responses</div>
            <div className="history-grid">
              {history.map(h => (
                <div className="history-card" key={h.id}>
                  <div>
                    <div className="history-meta">
                      <strong>{h.bizName}</strong>
                      <span className="history-tone-badge">{h.tone}</span>
                    </div>
                    <div className="history-stars">{starLabel(h.stars)}</div>
                    <div className="history-review">"{h.reviewSnippet}"</div>
                    <div className="history-response">{h.response}</div>
                  </div>
                  <button className="history-copy" onClick={() => navigator.clipboard.writeText(h.response)}>Copy</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <section className="section section-cream" id="how">
        <div className="section-label">Process</div>
        <h2 className="section-title">Set up once. Run forever.</h2>
        <p className="section-sub">Connect your Google Business profile in minutes and ReplyRight handles everything.</p>
        <div className="steps">
          {[
            ["01","Connect Your Profile","Link your Google Business account in under 2 minutes. No technical skills required."],
            ["02","Set Your Tone","Choose your brand voice — formal, friendly, or anywhere in between."],
            ["03","Reviews Handled Automatically","Every new review gets a thoughtful, personalized reply within minutes."],
            ["04","Watch Your Ratings Grow","Businesses that respond get 45% more review volume. Your reputation builds itself."]
          ].map(([n,h,p]) => (
            <div className="step" key={n}><div className="step-num">{n}</div><h3>{h}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* PRICING */}
      <section className="section section-white" id="pricing">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-sub">Start free for 14 days.</p>

        {/* Improvement 5: Annual toggle */}
        <div className="pricing-toggle">
          <span className={`toggle-label${!annual ? " active" : ""}`}>Monthly</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={annual} onChange={e => setAnnual(e.target.checked)} />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
          <span className={`toggle-label${annual ? " active" : ""}`}>Annual</span>
          {annual && <span className="save-badge">SAVE 25%</span>}
        </div>

        <div className="pricing-grid">
          {[
            {name:"Starter",features:["Up to 50 reviews/month","1 business location","AI-generated responses","Email notifications","14-day free trial"],btn:"btn-outline",featured:false},
            {name:"Pro",features:["Unlimited reviews","1 business location","Custom tone & branding","Priority response (<1 min)","Monthly analytics report","14-day free trial"],btn:"btn-solid",featured:true,badge:"Most Popular"},
            {name:"Agency",features:["Unlimited reviews","Up to 10 locations","White-label option","Custom tone per location","Dedicated support","14-day free trial"],btn:"btn-outline",featured:false}
          ].map(c => {
            const monthlyPrice = PRICES[c.name].monthly;
            const annualPrice = PRICES[c.name].annual;
            const displayPrice = annual ? annualPrice : monthlyPrice;
            return (
              <div className={`price-card${c.featured?" featured":""}`} key={c.name}>
                {c.badge && <div className="price-badge">{c.badge}</div>}
                <div className="price-name">{c.name}</div>
                <div className="price-amount">${displayPrice}</div>
                <div className="price-period">{annual ? "per month, billed annually" : "per month"}</div>
                <ul className="price-features">{c.features.map(f => <li key={f}>{f}</li>)}</ul>
                <button className={`price-btn ${c.btn}`} onClick={openModal}>Get Started Free</button>
                {annual && <div className="price-annual-note">Save ${(monthlyPrice - annualPrice) * 12}/year vs monthly</div>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* TESTIMONIALS */}
      <section className="section section-cream">
        <div className="section-label">Testimonials</div>
        <h2 className="section-title">Trusted by local businesses</h2>
        <p className="section-sub">Real owners. Real results.</p>
        <div className="testi-grid">
          {[
            {i:"M",name:"Marco D.",role:"Owner, Bella Vista Ristorante",text:"We went from responding to 20% of reviews to 100% overnight. Our rating went from 4.1 to 4.6 in two months. This pays for itself a hundred times over."},
            {i:"S",name:"Sandra K.",role:"Owner, Studio K Hair Salon",text:"I used to dread opening Google reviews. Now I don't even think about it. The responses sound exactly like me — but better."},
            {i:"R",name:"Rafael T.",role:"Operations Manager, TacoGroup",text:"I manage 6 locations. ReplyRight saves us 15 hours a week and keeps our online presence professional across every location."}
          ].map(t => (
            <div className="testi" key={t.name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.i}</div>
                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="section section-white" id="beforeafter">
        <div className="section-label">See The Difference</div>
        <h2 className="section-title">What silence looks like vs. ReplyRight</h2>
        <p className="section-sub">Every unanswered review is a missed opportunity. Here's what customers actually see.</p>
        <div className="beforeafter-grid" style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"}}>
          {/* BEFORE */}
          <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(15,31,56,0.08)"}}>
            <div style={{background:"#dc2626",padding:"0.8rem 1.5rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.8rem",fontWeight:700,color:"white",letterSpacing:"0.1em",textTransform:"uppercase"}}>✗ Without ReplyRight</span>
            </div>
            <div style={{background:"white",padding:"1.5rem"}}>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>S</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>Sarah M.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★★★★</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>2 weeks ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Absolutely loved the food! The pasta was incredible and our server was so attentive. Will definitely be back soon!"</p>
                <div style={{marginTop:"0.8rem",padding:"0.7rem",background:"#fef2f2",borderRadius:8,border:"1px solid #fecaca"}}>
                  <p style={{fontSize:"0.78rem",color:"#dc2626",fontStyle:"italic"}}>⚠ No response from owner — 2 weeks later</p>
                </div>
              </div>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>J</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>James T.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★☆☆☆</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>1 month ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Waited 45 minutes for our food and it came out cold. Really disappointed."</p>
                <div style={{marginTop:"0.8rem",padding:"0.7rem",background:"#fef2f2",borderRadius:8,border:"1px solid #fecaca"}}>
                  <p style={{fontSize:"0.78rem",color:"#dc2626",fontStyle:"italic"}}>⚠ No response from owner — potential customers see this and leave</p>
                </div>
              </div>
              <div style={{padding:"1rem",background:"#fef2f2",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:"0.82rem",fontWeight:700,color:"#dc2626"}}>Result: Customers choose your competitor</div>
                <div style={{fontSize:"0.75rem",color:"#6b7280",marginTop:"0.3rem"}}>63% of customers say businesses never responded to their review</div>
              </div>
            </div>
          </div>
          {/* AFTER */}
          <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(15,31,56,0.08)"}}>
            <div style={{background:"#16a34a",padding:"0.8rem 1.5rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.8rem",fontWeight:700,color:"white",letterSpacing:"0.1em",textTransform:"uppercase"}}>✓ With ReplyRight</span>
            </div>
            <div style={{background:"white",padding:"1.5rem"}}>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>S</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>Sarah M.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★★★★</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>2 weeks ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Absolutely loved the food! The pasta was incredible and our server was so attentive. Will definitely be back soon!"</p>
                <div style={{marginTop:"0.8rem",padding:"0.9rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #86efac"}}>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#16a34a",marginBottom:"0.4rem"}}>Owner responded · 3 minutes later</div>
                  <p style={{fontSize:"0.82rem",color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>"Thank you so much Sarah! We're thrilled you enjoyed the pasta — it's our chef's pride! We can't wait to welcome you back. See you soon! 🍝"</p>
                </div>
              </div>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>J</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>James T.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★☆☆☆</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>1 month ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Waited 45 minutes for our food and it came out cold. Really disappointed."</p>
                <div style={{marginTop:"0.8rem",padding:"0.9rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #86efac"}}>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#16a34a",marginBottom:"0.4rem"}}>Owner responded · 5 minutes later</div>
                  <p style={{fontSize:"0.82rem",color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>"James, we're truly sorry about your experience. A 45-minute wait is unacceptable and we take full responsibility. Please reach out to us directly and we'd love to make it right for you."</p>
                </div>
              </div>
              <div style={{padding:"1rem",background:"#f0fdf4",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:"0.82rem",fontWeight:700,color:"#16a34a"}}>Result: Customers choose YOU</div>
                <div style={{fontSize:"0.75rem",color:"#6b7280",marginTop:"0.3rem"}}>97% of customers read owner responses before visiting</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <p style={{color:"var(--text-mid)",fontSize:"0.95rem",marginBottom:"1.5rem"}}>ReplyRight generates responses like these automatically — for every review, within minutes, 24/7.</p>
          <button className="btn-primary" onClick={() => scrollTo("demo")}>See It In Action — Free Demo</button>
        </div>
      </section>

      <div className="divider" />

      {/* FAQ */}
      <section id="faq" className="section section-cream">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Common questions</h2>
        <p className="section-sub">Everything you need to know before getting started.</p>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",flexDirection:"column",gap:"1rem"}}>
          {[
            ["Will the responses sound like a robot wrote them?","No — that's the whole point. Our AI is trained to write responses that sound genuinely human, warm, and specific to each review. It references details the customer mentioned, matches your business type, and avoids generic phrases like 'We value your feedback.' Most customers can't tell the difference from a hand-written response."],
            ["Does ReplyRight post replies automatically?","Yes. Once you connect your Google Business Profile, ReplyRight detects new reviews and posts a personalized AI response automatically — no action needed on your part."],
            ["What happens if I get a really bad or complicated review?","ReplyRight handles 1-star reviews with extra care — apologizing sincerely, taking ownership, and inviting the customer to reach out directly. For unusual or sensitive reviews, you can use our approval mode (Pro plan) to review responses before they're posted."],
            ["Do I need any technical skills to set this up?","None at all. Here's the entire setup process: (1) Click 'Start Free Trial' and sign in with the Google account tied to your Google Business Profile. (2) Grant ReplyRight access to your Business Profile — this takes one click. (3) Select which business location to manage. That's it. No code, no configuration, no technical knowledge required. You'll be live in under 2 minutes."],
            ["Will this work for my type of business?","ReplyRight works for any business with a Google Business Profile — restaurants, hair salons, dental offices, auto repair shops, gyms, hotels, retail stores, medical clinics, and more. Our AI adapts its tone and language to match your specific industry."],
            ["What happens after my 14-day trial?","After your 14-day free trial, you'll be automatically enrolled in the Starter plan ($29/month) unless you cancel or upgrade before the trial ends. You can cancel anytime from your account settings with no penalty."],
            ["Can I cancel anytime?","Yes, absolutely. No contracts, no cancellation fees. Cancel anytime from your account dashboard and your subscription ends at the close of your current billing period. We also offer a 14-day free trial with no credit card required so you can try it risk-free."],
            ["How is this different from just using ChatGPT?","ChatGPT requires you to manually copy each review, write a prompt, generate a response, copy it back, and paste it into Google — every single time, for every review. ReplyRight connects directly to your Google Business Profile and does all of this automatically, the moment a new review comes in, 24/7. You never have to think about it."],
            ["Is my Google account data safe?","ReplyRight only requests access to your Business Profile reviews. We never access your personal Gmail, contacts, or other Google data."],
          ].map(([q,a],i) => (
            <FaqItem key={i} q={q} a={a} />
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="cta">
        <div className="cta-glow" />
        <h2>Your reputation deserves better<br />than silence.</h2>
        <p>Join hundreds of businesses responding to every review, automatically.</p>
        <button className="cta-btn" onClick={openModal}>Start Your Free 14-Day Trial</button>
        <p className="cta-note">Cancel anytime · Setup in under 5 minutes</p>
        <div className="guarantee-row">
          <span className="guarantee-badge">🔒 Your data stays private</span>
          <span className="guarantee-badge">⭐ 4.9/5 customer rating</span>
        </div>
      </section>

      <footer>
        <div className="footer-logo">Reply<span>Right</span></div>
        <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
          <a href="/privacy" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Privacy Policy</a>
          <a href="/terms" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Terms of Service</a>
          <button onClick={() => setShowContact(true)} style={{background:"none",border:"none",color:"rgba(255,255,255,.35)",fontSize:".78rem",cursor:"pointer",fontFamily:"'DM Sans', sans-serif",padding:0}}>Contact</button>
        </div>
        <p>© 2026 ReplyRight. All rights reserved.</p>
      </footer>

      {/* CONTACT MODAL */}
      {showContact && (
        <div onClick={e => { if(e.target===e.currentTarget) setShowContact(false); }} style={{position:"fixed",inset:0,background:"rgba(10,22,40,.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"}}>
          <div style={{background:"var(--white)",borderRadius:18,padding:"2.5rem",maxWidth:480,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,.3)",position:"relative",animation:"fadeUp .3s ease both"}}>
            <button onClick={() => setShowContact(false)} style={{position:"absolute",top:"1rem",right:"1.2rem",background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",color:"var(--text-light)",lineHeight:1}}>×</button>
            <div style={{marginBottom:"1.5rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.8rem",color:"var(--navy)",marginBottom:".4rem"}}>Get in touch</h3>
              <p style={{fontSize:".88rem",color:"var(--text-mid)"}}>Questions, feedback, or need help? We're here.</p>
              <a href="mailto:Support@replyrightapp.com" style={{display:"inline-flex",alignItems:"center",gap:".4rem",marginTop:".6rem",fontSize:".82rem",color:"var(--accent)",textDecoration:"none",fontWeight:500}}>
                ✉ Support@replyrightapp.com
              </a>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Your Name</label>
                <input value={contactName} onChange={e=>setContactName(e.target.value)} placeholder="Jane Smith" style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Email Address <span style={{color:"#dc2626"}}>*</span></label>
                <input value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="you@example.com" type="email" style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Message <span style={{color:"#dc2626"}}>*</span></label>
                <textarea value={contactMsg} onChange={e=>setContactMsg(e.target.value)} placeholder="How can we help?" rows={4} style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none",resize:"vertical"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <button onClick={sendContact} disabled={!contactEmail.trim()||!contactMsg.trim()} style={{background:"var(--navy)",color:"white",border:"none",padding:".88rem",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".92rem",fontWeight:600,cursor:"pointer",opacity:(!contactEmail.trim()||!contactMsg.trim()) ? 0.55 : 1,transition:"all .2s"}}>
                Open Email to Send →
              </button>
              <p style={{fontSize:".74rem",color:"var(--text-light)",textAlign:"center",marginTop:"-.3rem"}}>Clicking above opens your email app with your message pre-filled.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
