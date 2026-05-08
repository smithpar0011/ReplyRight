"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, CreditCard, LogOut, RefreshCw, Search, X } from "lucide-react";

const fmt = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (ms) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (ms) => new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const PLAN_STYLE = {
  Starter: { bg: "rgba(139,92,246,.12)", color: "#7c3aed", dot: "#7c3aed" },
  Pro:     { bg: "rgba(46,125,247,.12)",  color: "#2e7df7", dot: "#2e7df7" },
  Agency:  { bg: "rgba(15,31,56,.1)",     color: "#0f1f38", dot: "#0f1f38" },
};
const STATUS_STYLE = {
  paid:     { bg: "rgba(22,163,74,.1)",   color: "#16a34a" },
  refunded: { bg: "rgba(245,158,11,.1)",  color: "#d97706" },
  failed:   { bg: "rgba(220,38,38,.1)",   color: "#dc2626" },
};

const navItems = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "users",    label: "Users",    Icon: Users },
  { id: "payments", label: "Payments", Icon: CreditCard },
];

function NavBtn({ item, active, onClick }) {
  return (
    <button onClick={onClick} className={`adm-nav-item${active ? " active" : ""}`}>
      <item.Icon size={15} />
      {item.label}
    </button>
  );
}

function StatCard({ label, value, accentClass, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.35 }}
      className={`adm-stat-card${accentClass ? ` ${accentClass}` : ""}`}
    >
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-val">{value ?? "—"}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [payFilter, setPayFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [s, u, p] = await Promise.all([
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json()),
        fetch("/api/admin/payments?limit=100").then(r => r.json()),
      ]);
      if (s.error === "Unauthorized" || u.error === "Unauthorized") { router.push("/admin-login"); return; }
      setStats(s); setUsers(u.users || []); setPayments(p.payments || []);
    } catch { setError("Failed to load data."); }
    finally { setLoading(false); setRefreshing(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const saveUser = async () => {
    setSaving(true);
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editUser.id, plan: editUser.plan, billing: editUser.billing }) });
    setSaving(false); setEditUser(null); load(true);
  };

  const filteredUsers = users.filter(u => {
    const ms = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    return ms && (planFilter === "all" || u.plan === planFilter);
  });
  const filteredPayments = payments.filter(p => payFilter === "all" || p.status === payFilter);

  const tabTitle = { overview: "Business Overview", users: "User Management", payments: "Payment History" };

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0f1f38; --blue: #1e4d8c; --accent: #2e7df7;
          --cream: #f8f5ef; --cream-dark: #ede8de;
          --text-mid: #4a5568; --text-light: #8896a7;
          --sidebar-w: 248px;
        }
        body { font-family: 'DM Sans', sans-serif; background: linear-gradient(160deg,#f0f4ff 0%,#f8f5ef 45%,#f5f0ff 100%); min-height: 100vh; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes sideGlow { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        /* ── LAYOUT ── */
        .adm-shell { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .adm-sidebar {
          width: var(--sidebar-w); flex-shrink: 0;
          background: linear-gradient(180deg,#081120 0%,#0a1628 50%,#081222 100%);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
          border-right: 1px solid rgba(255,255,255,.05); overflow: hidden;
        }
        .adm-sidebar::before {
          content:""; position:absolute; top:0; left:0; right:0; height:200px;
          background: radial-gradient(ellipse at 55% 0%, rgba(46,125,247,.22) 0%, transparent 68%);
          pointer-events:none; animation: sideGlow 6s ease-in-out infinite;
        }
        .adm-sidebar::after {
          content:""; position:absolute; bottom:0; left:0; right:0; height:90px;
          background: radial-gradient(ellipse at 50% 100%, rgba(200,169,110,.07) 0%, transparent 70%);
          pointer-events:none;
        }
        .adm-logo-wrap {
          position: relative; z-index: 1;
          padding: 1.6rem 1.6rem .9rem;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .adm-logo {
          font-family: 'Instrument Serif', serif; font-size: 1.75rem; font-weight: 400;
          color: white; letter-spacing: -.02em; text-decoration: none; display: block;
        }
        .adm-logo span { color: #2e7df7; }
        .adm-badge {
          display: inline-block; margin-top: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: .58rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 100px;
          background: rgba(46,125,247,.18); color: rgba(46,125,247,.9);
          border: 1px solid rgba(46,125,247,.25);
        }
        .adm-nav { flex: 1; padding: 1rem .7rem; position: relative; z-index: 1; }
        .adm-nav-label {
          font-size: .62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.35); padding: .4rem .75rem .3rem;
        }
        .adm-nav-item {
          display: flex; align-items: center; gap: .85rem; padding: .78rem 1.1rem;
          color: rgba(255,255,255,.55); font-size: .9rem; font-weight: 500;
          cursor: pointer; border: 1px solid transparent; background: none; width: 100%;
          text-align: left; transition: all .2s; border-radius: 11px; margin-bottom: .15rem;
          font-family: 'DM Sans', sans-serif;
        }
        .adm-nav-item:hover { color: rgba(255,255,255,.85); background: rgba(255,255,255,.07); }
        .adm-nav-item.active {
          color: white; font-weight: 600;
          background: linear-gradient(135deg,rgba(46,125,247,.28),rgba(46,125,247,.14));
          border-color: rgba(46,125,247,.32);
          box-shadow: 0 2px 14px rgba(46,125,247,.18);
        }
        .adm-sidebar-bottom {
          padding: .85rem .8rem 1rem; border-top: 1px solid rgba(255,255,255,.05); position: relative; z-index: 1;
        }
        .adm-logout-btn {
          width: 100%; display: flex; align-items: center; gap: .65rem;
          background: transparent; border: 1px solid rgba(255,255,255,.07);
          color: rgba(255,255,255,.28); border-radius: 9px; padding: .45rem .9rem;
          font-size: .76rem; cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif;
        }
        .adm-logout-btn:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.55); border-color: rgba(255,255,255,.16); }

        /* ── MAIN ── */
        .adm-main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        /* ── TOPBAR ── */
        .adm-topbar {
          background: rgba(255,255,255,.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(15,31,56,.07);
          padding: 0 2rem; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 40;
          box-shadow: 0 1px 0 rgba(255,255,255,.9) inset, 0 4px 20px rgba(15,31,56,.04);
        }
        .adm-topbar-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.05rem; font-weight: 700; color: var(--navy); letter-spacing: -.03em;
        }
        .adm-topbar-sub { font-size: .7rem; color: var(--text-light); margin-top: 2px; }
        .adm-refresh-btn {
          display: flex; align-items: center; gap: .45rem;
          padding: .42rem 1rem; border-radius: 9px;
          border: 1px solid rgba(15,31,56,.1); background: white;
          color: var(--text-mid); font-size: .76rem; font-weight: 500; cursor: pointer;
          transition: all .18s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 4px rgba(15,31,56,.05);
        }
        .adm-refresh-btn:hover { background: var(--cream); border-color: rgba(15,31,56,.18); }
        .adm-refresh-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* ── CONTENT ── */
        .adm-content { flex: 1; padding: 2rem 2.2rem; max-width: 1200px; }

        /* ── SECTION LABEL ── */
        .adm-section-label {
          display: inline-flex; align-items: center; gap: 7px; margin-bottom: 1rem;
          font-size: .6rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .13em; color: var(--accent);
        }
        .adm-section-label::before, .adm-section-label::after {
          content:""; display:inline-block; width:14px; height:1px;
          background: var(--accent); opacity: .45;
        }

        /* ── STAT CARDS ── */
        .adm-stat-grid { display: grid; gap: 1rem; margin-bottom: 2rem; }
        .adm-stat-grid-5 { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        .adm-stat-grid-7 { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
        .adm-stat-grid-4 { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
        .adm-stat-card {
          background: white; border-radius: 18px; padding: 1.4rem 1.4rem 1.2rem;
          border: 1px solid rgba(15,31,56,.07);
          box-shadow: 0 2px 12px rgba(15,31,56,.05);
          position: relative; overflow: hidden;
          transition: transform .2s, box-shadow .2s;
        }
        .adm-stat-card::after {
          content:""; position:absolute; top:0; left:0; right:0; height:3px; border-radius:18px 18px 0 0;
          background: rgba(15,31,56,.06);
        }
        .adm-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(15,31,56,.1); }
        .adm-stat-card.c-blue::after   { background: linear-gradient(90deg,#2e7df7,#5b9bff); }
        .adm-stat-card.c-green::after  { background: linear-gradient(90deg,#16a34a,#4ade80); }
        .adm-stat-card.c-gold::after   { background: linear-gradient(90deg,#c8a96e,#e8cfa0); }
        .adm-stat-card.c-purple::after { background: linear-gradient(90deg,#7c3aed,#a78bfa); }
        .adm-stat-card.c-amber::after  { background: linear-gradient(90deg,#d97706,#fbbf24); }
        .adm-stat-card.c-red::after    { background: linear-gradient(90deg,#dc2626,#f87171); }
        .adm-stat-card.c-slate::after  { background: linear-gradient(90deg,#475569,#94a3b8); }
        .adm-stat-card.c-navy::after   { background: linear-gradient(90deg,#0f1f38,#1e4d8c); }
        .adm-stat-card.c-hl {
          background: linear-gradient(135deg,#0f1f38,#1e4d8c);
          border-color: transparent;
          box-shadow: 0 6px 24px rgba(15,31,56,.3);
        }
        .adm-stat-card.c-hl::after { display: none; }
        .adm-stat-label {
          font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em;
          color: var(--text-light); margin-bottom: .55rem;
        }
        .adm-stat-card.c-hl .adm-stat-label { color: rgba(255,255,255,.5); }
        .adm-stat-val {
          font-family: 'Instrument Serif', serif; font-size: 2.1rem; color: var(--navy); line-height: 1;
        }
        .adm-stat-card.c-hl .adm-stat-val { color: white; }

        /* ── TABLE WRAPPER ── */
        .adm-table-wrap {
          background: white; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(15,31,56,.07);
          box-shadow: 0 2px 16px rgba(15,31,56,.05);
          margin-bottom: .75rem;
        }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-th {
          padding: 11px 16px; text-align: left;
          font-size: .58rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          color: var(--text-light); border-bottom: 1px solid rgba(15,31,56,.06);
          background: linear-gradient(135deg,#fafbfe 0%,#ffffff 100%);
        }
        .adm-td {
          padding: 13px 16px; font-size: .84rem; color: var(--text-mid);
          border-bottom: 1px solid rgba(15,31,56,.04);
          transition: background .12s;
        }
        .adm-tr:last-child .adm-td { border-bottom: none; }
        .adm-tr:hover .adm-td { background: #fafbfe; }

        /* ── FILTERS ── */
        .adm-filter-row { display: flex; gap: .75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .adm-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .adm-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text-light); pointer-events: none; }
        .adm-search-input {
          width: 100%; padding: .58rem .9rem .58rem 2.2rem;
          background: white; border: 1px solid rgba(15,31,56,.1); border-radius: 10px;
          font-size: .84rem; color: var(--navy); outline: none;
          transition: border-color .2s, box-shadow .2s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 4px rgba(15,31,56,.04);
        }
        .adm-search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(46,125,247,.08); }
        .adm-select {
          padding: .58rem .9rem; background: white;
          border: 1px solid rgba(15,31,56,.1); border-radius: 10px;
          font-size: .84rem; color: var(--text-mid); outline: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; box-shadow: 0 1px 4px rgba(15,31,56,.04);
        }
        .adm-select:focus { border-color: var(--accent); }
        .adm-count { font-size: .72rem; color: var(--text-light); }

        /* ── PLAN / STATUS BADGES ── */
        .adm-plan-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px;
          font-size: .68rem; font-weight: 700;
        }
        .adm-plan-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .adm-status-badge {
          display: inline-block; padding: 3px 10px; border-radius: 100px;
          font-size: .68rem; font-weight: 700; text-transform: capitalize;
        }

        /* ── EDIT BTN ── */
        .adm-edit-btn {
          padding: .35rem .85rem; border-radius: 8px;
          border: 1px solid rgba(15,31,56,.1); background: var(--cream);
          color: var(--text-mid); font-size: .74rem; font-weight: 500; cursor: pointer;
          transition: all .15s; font-family: 'DM Sans', sans-serif;
        }
        .adm-edit-btn:hover { background: white; border-color: var(--accent); color: var(--accent); }

        /* ── MODAL ── */
        .adm-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.6);
          backdrop-filter: blur(8px); display: flex; align-items: center;
          justify-content: center; z-index: 9999; padding: 16px;
        }
        .adm-modal {
          background: white; border-radius: 22px; padding: 1.8rem;
          width: 100%; max-width: 390px;
          box-shadow: 0 28px 60px rgba(15,31,56,.18);
          border: 1px solid rgba(15,31,56,.06);
        }
        .adm-modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.4rem; }
        .adm-modal-title { font-family: 'Poppins', sans-serif; font-size: .95rem; font-weight: 700; color: var(--navy); }
        .adm-modal-sub { font-size: .73rem; color: var(--text-light); margin-top: 3px; }
        .adm-modal-close { background: none; border: none; cursor: pointer; color: var(--text-light); padding: 4px; border-radius: 6px; }
        .adm-modal-close:hover { color: var(--navy); background: var(--cream); }
        .adm-field-lbl { display: block; font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--text-mid); margin-bottom: .4rem; }
        .adm-field-select {
          width: 100%; padding: .65rem .9rem; border: 1.5px solid var(--cream-dark);
          border-radius: 10px; font-size: .88rem; color: var(--navy); background: var(--cream);
          outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .adm-field-select:focus { border-color: var(--accent); background: white; }
        .adm-modal-actions { display: flex; gap: .6rem; margin-top: 1.5rem; }
        .adm-btn-cancel {
          flex: 1; padding: .72rem; border-radius: 10px; border: none;
          background: var(--cream); color: var(--text-mid); font-size: .88rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .15s;
        }
        .adm-btn-cancel:hover { background: var(--cream-dark); }
        .adm-btn-save {
          flex: 1; padding: .72rem; border-radius: 10px; border: none;
          background: var(--navy); color: white; font-size: .88rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all .2s; box-shadow: 0 4px 14px rgba(15,31,56,.2);
        }
        .adm-btn-save:hover:not(:disabled) { background: var(--blue); transform: translateY(-1px); }
        .adm-btn-save:disabled { opacity: .5; cursor: not-allowed; }

        /* ── ERROR ── */
        .adm-error { background: rgba(220,38,38,.07); border: 1px solid rgba(220,38,38,.18); border-radius: 12px; padding: 12px 16px; margin-bottom: 1.25rem; font-size: .84rem; color: #dc2626; }
      `}</style>

      <div className="adm-shell">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-logo-wrap">
            <a href="/" className="adm-logo">Reply<span>Right</span></a>
            <div className="adm-badge">Admin Panel</div>
          </div>
          <nav className="adm-nav">
            <div className="adm-nav-label">Navigation</div>
            {navItems.map(item => (
              <NavBtn key={item.id} item={item} active={tab === item.id} onClick={() => setTab(item.id)} />
            ))}
          </nav>
          <div className="adm-sidebar-bottom">
            <button
              className="adm-logout-btn"
              onClick={() => {
                document.cookie = "rr_session=; max-age=0; path=/";
                router.push("/admin-login");
              }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="adm-main">
          <header className="adm-topbar">
            <div>
              <div className="adm-topbar-title">{tabTitle[tab]}</div>
              <div className="adm-topbar-sub">ReplyRight Admin</div>
            </div>
            <button className="adm-refresh-btn" onClick={() => load(true)} disabled={refreshing}>
              <RefreshCw size={12} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </header>

          <div className="adm-content">
            {loading && (
              <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-light)", fontSize: ".9rem" }}>
                Loading…
              </div>
            )}
            {error && <div className="adm-error">{error}</div>}

            <AnimatePresence mode="wait">
              {/* ── OVERVIEW ── */}
              {!loading && tab === "overview" && stats && (
                <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="adm-section-label">Revenue</div>
                  <div className="adm-stat-grid adm-stat-grid-5">
                    {[
                      { label: "Today",      value: fmt(stats.revenue?.today),   accentClass: "c-blue" },
                      { label: "This Week",  value: fmt(stats.revenue?.week),    accentClass: "c-blue" },
                      { label: "This Month", value: fmt(stats.revenue?.month),   accentClass: "c-blue" },
                      { label: "This Year",  value: fmt(stats.revenue?.year),    accentClass: "c-blue" },
                      { label: "All Time",   value: fmt(stats.revenue?.allTime), accentClass: "c-hl"   },
                    ].map((c, i) => <StatCard key={c.label} {...c} i={i} />)}
                  </div>

                  <div className="adm-section-label">Users</div>
                  <div className="adm-stat-grid adm-stat-grid-7">
                    {[
                      { label: "Total",      value: stats.userCounts?.total,    accentClass: "c-navy"   },
                      { label: "New Today",  value: stats.userCounts?.newToday, accentClass: "c-green"  },
                      { label: "This Week",  value: stats.userCounts?.newWeek,  accentClass: "c-green"  },
                      { label: "This Month", value: stats.userCounts?.newMonth, accentClass: "c-green"  },
                      { label: "Starter",    value: stats.userCounts?.starter,  accentClass: "c-purple" },
                      { label: "Pro",        value: stats.userCounts?.pro,      accentClass: "c-blue"   },
                      { label: "Agency",     value: stats.userCounts?.agency,   accentClass: "c-navy"   },
                    ].map((c, i) => <StatCard key={c.label} {...c} i={i} />)}
                  </div>

                  <div className="adm-section-label">Subscription Health</div>
                  <div className="adm-stat-grid adm-stat-grid-4">
                    {[
                      { label: "Active",   value: stats.subCounts?.active,   accentClass: "c-green" },
                      { label: "Trialing", value: stats.subCounts?.trialing, accentClass: "c-amber" },
                      { label: "Past Due", value: stats.subCounts?.pastDue,  accentClass: "c-red"   },
                      { label: "Canceled", value: stats.subCounts?.canceled, accentClass: "c-slate" },
                    ].map((c, i) => <StatCard key={c.label} {...c} i={i} />)}
                  </div>
                </motion.div>
              )}

              {/* ── USERS ── */}
              {!loading && tab === "users" && (
                <motion.div key="us" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="adm-filter-row">
                    <div className="adm-search-wrap">
                      <Search size={13} className="adm-search-icon" />
                      <input
                        className="adm-search-input"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                    <select className="adm-select" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
                      <option value="all">All Plans</option>
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Agency">Agency</option>
                    </select>
                  </div>

                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          {["Name", "Email", "Plan", "Billing", "Joined", ""].map(h => (
                            <th key={h} className="adm-th">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 && (
                          <tr><td colSpan={6} className="adm-td" style={{ textAlign: "center", color: "var(--text-light)" }}>No users found</td></tr>
                        )}
                        {filteredUsers.map(u => {
                          const ps = PLAN_STYLE[u.plan] || { bg: "rgba(15,31,56,.06)", color: "#64748b", dot: "#94a3b8" };
                          return (
                            <tr key={u.id} className="adm-tr">
                              <td className="adm-td" style={{ fontWeight: 600, color: "var(--navy)" }}>{u.name || "—"}</td>
                              <td className="adm-td">{u.email}</td>
                              <td className="adm-td">
                                <span className="adm-plan-badge" style={{ background: ps.bg, color: ps.color }}>
                                  <span className="adm-plan-dot" style={{ background: ps.dot }} />
                                  {u.plan || "None"}
                                </span>
                              </td>
                              <td className="adm-td" style={{ textTransform: "capitalize" }}>{u.billing || "—"}</td>
                              <td className="adm-td" style={{ color: "var(--text-light)" }}>
                                {u.created_at ? fmtDate(new Date(u.created_at).getTime()) : "—"}
                              </td>
                              <td className="adm-td">
                                <button className="adm-edit-btn" onClick={() => setEditUser({ ...u })}>Edit</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="adm-count">{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}</div>
                </motion.div>
              )}

              {/* ── PAYMENTS ── */}
              {!loading && tab === "payments" && (
                <motion.div key="py" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="adm-filter-row">
                    <select className="adm-select" value={payFilter} onChange={e => setPayFilter(e.target.value)}>
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          {["Date", "Time", "Email", "Amount", "Status", "ID"].map(h => (
                            <th key={h} className="adm-th">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.length === 0 && (
                          <tr><td colSpan={6} className="adm-td" style={{ textAlign: "center", color: "var(--text-light)" }}>No payments found</td></tr>
                        )}
                        {filteredPayments.map(p => {
                          const ss = STATUS_STYLE[p.status] || { bg: "rgba(15,31,56,.06)", color: "#64748b" };
                          return (
                            <tr key={p.id} className="adm-tr">
                              <td className="adm-td" style={{ fontWeight: 500, color: "var(--navy)" }}>{fmtDate(p.created)}</td>
                              <td className="adm-td" style={{ color: "var(--text-light)" }}>{fmtTime(p.created)}</td>
                              <td className="adm-td">{p.email}</td>
                              <td className="adm-td" style={{ fontWeight: 700, color: "var(--navy)" }}>{fmt(p.amount)}</td>
                              <td className="adm-td">
                                <span className="adm-status-badge" style={{ background: ss.bg, color: ss.color }}>{p.status}</span>
                              </td>
                              <td className="adm-td" style={{ fontSize: ".68rem", color: "#cbd5e1", fontFamily: "monospace" }}>{p.id}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="adm-count">{filteredPayments.length} transaction{filteredPayments.length !== 1 ? "s" : ""}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Edit User Modal */}
        <AnimatePresence>
          {editUser && (
            <motion.div
              className="adm-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={e => { if (e.target === e.currentTarget) setEditUser(null); }}
            >
              <motion.div
                className="adm-modal"
                initial={{ opacity: 0, scale: .95, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: .95, y: 18 }}
              >
                <div className="adm-modal-header">
                  <div>
                    <div className="adm-modal-title">Edit User</div>
                    <div className="adm-modal-sub">{editUser.email}</div>
                  </div>
                  <button className="adm-modal-close" onClick={() => setEditUser(null)}><X size={16} /></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="adm-field-lbl">Plan</label>
                    <select
                      className="adm-field-select"
                      value={editUser.plan || ""}
                      onChange={e => setEditUser({ ...editUser, plan: e.target.value })}
                    >
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Agency">Agency</option>
                    </select>
                  </div>
                  <div>
                    <label className="adm-field-lbl">Billing</label>
                    <select
                      className="adm-field-select"
                      value={editUser.billing || ""}
                      onChange={e => setEditUser({ ...editUser, billing: e.target.value })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div className="adm-modal-actions">
                  <button className="adm-btn-cancel" onClick={() => setEditUser(null)}>Cancel</button>
                  <button className="adm-btn-save" onClick={saveUser} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
