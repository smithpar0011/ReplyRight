"use client";
import { useState, useEffect, useMemo } from "react";

const PLANS = ["Starter", "Pro", "Agency"];
const PLAN_COLORS = { Starter: "#3b82f6", Pro: "#8b5cf6", Agency: "#f59e0b", null: "#6b7280" };
const PLAN_BG = { Starter: "rgba(59,130,246,0.12)", Pro: "rgba(139,92,246,0.12)", Agency: "rgba(245,158,11,0.12)", null: "rgba(107,114,128,0.1)" };

function initials(name, email) {
  const n = name || email || "?";
  return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(iso) {
  if (!iso) return "—";
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

function PlanBadge({ plan }) {
  const label = plan || "No Plan";
  return (
    <span style={{
      background: PLAN_BG[plan] || PLAN_BG[null],
      color: PLAN_COLORS[plan] || PLAN_COLORS[null],
      border: `1px solid ${PLAN_COLORS[plan] || PLAN_COLORS[null]}33`,
      borderRadius: 100,
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [editingPlan, setEditingPlan] = useState({}); // { userId: { plan, billing } }
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => {
    fetch("/api/admin/users")
      .then(r => {
        if (r.status === 401) { window.location.href = "/admin-login"; return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        if (data.error) { setError(data.error); return; }
        setUsers(data.users || []);
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (planFilter !== "all") {
      list = list.filter(u => planFilter === "none" ? !u.plan : u.plan === planFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(u =>
        (u.email || "").toLowerCase().includes(q) ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.google_location_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, planFilter, search]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.plan).length,
    starter: users.filter(u => u.plan === "Starter").length,
    pro: users.filter(u => u.plan === "Pro").length,
    agency: users.filter(u => u.plan === "Agency").length,
    noPlan: users.filter(u => !u.plan).length,
  }), [users]);

  function startEdit(user) {
    setEditingPlan(prev => ({
      ...prev,
      [user.id]: { plan: user.plan || "", billing: user.billing || "monthly" },
    }));
    setSaved(prev => ({ ...prev, [user.id]: false }));
  }

  function cancelEdit(userId) {
    setEditingPlan(prev => { const n = { ...prev }; delete n[userId]; return n; });
  }

  async function savePlan(userId) {
    const edit = editingPlan[userId];
    if (!edit) return;
    setSaving(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: edit.plan || null, billing: edit.billing }),
      });
      const data = await res.json();
      if (data.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: edit.plan || null, billing: edit.billing } : u));
        setSaved(prev => ({ ...prev, [userId]: true }));
        setTimeout(() => cancelEdit(userId), 1000);
      } else {
        alert("Save failed: " + data.error);
      }
    } finally {
      setSaving(prev => ({ ...prev, [userId]: false }));
    }
  }

  function exportCSV() {
    const rows = [
      ["Name", "Email", "Plan", "Billing", "Location", "Joined", "Monthly Replies", "Backfill Done"],
      ...filtered.map(u => [
        u.name || "",
        u.email || u.google_email || "",
        u.plan || "No Plan",
        u.billing || "",
        u.google_location_name || "",
        u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
        u.monthly_reply_count || 0,
        u.backfill_done ? "Yes" : "No",
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "replyright-users.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0f172a; min-height: 100vh; color: #e2e8f0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .admin-nav {
          background: #0a1628; border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 2rem; height: 56px; display: flex; align-items: center;
          justify-content: space-between; position: sticky; top: 0; z-index: 50;
        }
        .admin-logo { font-family: 'Instrument Serif', serif; font-size: 1.3rem; color: #fff; }
        .admin-logo span { color: #3b82f6; }
        .admin-badge { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; margin-left: 10px; }
        .logout-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); border-radius: 6px; padding: 6px 14px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .logout-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .stats-bar { display: flex; gap: 1px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .stat-card { flex: 1; padding: 1.2rem 1.5rem; background: #0f172a; }
        .stat-val { font-family: 'Instrument Serif', serif; font-size: 2rem; line-height: 1; }
        .stat-lbl { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
        .toolbar { padding: 1rem 2rem; display: flex; gap: .8rem; align-items: center; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .search-input {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 8px 14px; color: #e2e8f0; font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none; width: 260px; transition: border-color .2s;
        }
        .search-input:focus { border-color: rgba(59,130,246,0.4); }
        .search-input::placeholder { color: rgba(255,255,255,0.2); }
        .filter-select {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 8px 14px; color: #e2e8f0; font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none; cursor: pointer;
        }
        .filter-select option { background: #1e293b; }
        .btn-export { margin-left: auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .btn-export:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .results-count { color: rgba(255,255,255,0.3); font-size: 13px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 900px; }
        thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
        th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
        tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background .15s; animation: fadeUp .3s ease both; }
        tbody tr:hover { background: rgba(255,255,255,0.02); }
        td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(59,130,246,0.2); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .user-name { font-weight: 600; color: #f1f5f9; font-size: 13px; }
        .user-email { color: rgba(255,255,255,0.35); font-size: 12px; margin-top: 1px; }
        .plan-edit-row { display: flex; align-items: center; gap: 6px; }
        .plan-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 12px; padding: 4px 8px; cursor: pointer; outline: none; }
        .plan-select option { background: #1e293b; }
        .btn-save { background: #3b82f6; border: none; border-radius: 5px; color: white; font-size: 12px; font-weight: 600; padding: 4px 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .15s; }
        .btn-save:hover:not(:disabled) { background: #2563eb; }
        .btn-save:disabled { opacity: .6; cursor: not-allowed; }
        .btn-cancel { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; color: rgba(255,255,255,0.4); font-size: 12px; padding: 4px 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .btn-edit { background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 5px; color: rgba(255,255,255,0.3); font-size: 11px; padding: 3px 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
        .btn-edit:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
        .stripe-link { color: #60a5fa; font-size: 11px; text-decoration: none; opacity: 0.7; }
        .stripe-link:hover { opacity: 1; }
        .usage-cell { font-size: 12px; }
        .usage-bar { background: rgba(255,255,255,0.06); border-radius: 100px; height: 4px; width: 60px; margin-top: 4px; overflow: hidden; }
        .usage-fill { height: 100%; border-radius: 100px; }
        .empty-row td { padding: 3rem; text-align: center; color: rgba(255,255,255,0.2); font-size: 14px; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @media(max-width: 768px) {
          .stats-bar { flex-wrap: wrap; }
          .stat-card { min-width: 45%; }
          .toolbar { padding: 1rem; }
          th, td { padding: 10px 12px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="admin-nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="admin-logo">Reply<span>Right</span></div>
          <div className="admin-badge">ADMIN</div>
        </div>
        <a href="/api/auth/logout">
          <button className="logout-btn">Sign Out</button>
        </a>
      </nav>

      {/* STATS */}
      <div className="stats-bar">
        {[
          { label: "Total Users", val: stats.total, color: "#e2e8f0" },
          { label: "Active Plans", val: stats.active, color: "#34d399" },
          { label: "Starter", val: stats.starter, color: "#3b82f6" },
          { label: "Pro", val: stats.pro, color: "#8b5cf6" },
          { label: "Agency", val: stats.agency, color: "#f59e0b" },
          { label: "No Plan", val: stats.noPlan, color: "#6b7280" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-val" style={{ color: s.color }}>{loading ? "—" : s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name, email, or location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="all">All Plans</option>
          <option value="Starter">Starter</option>
          <option value="Pro">Pro</option>
          <option value="Agency">Agency</option>
          <option value="none">No Plan</option>
        </select>
        <span className="results-count">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        <button className="btn-export" onClick={exportCSV}>Export CSV</button>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ padding: "1rem 2rem" }}>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 16px", color: "#f87171", fontSize: 14 }}>
            {error}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Billing</th>
              <th>Location</th>
              <th>Joined</th>
              <th>Monthly Usage</th>
              <th>Backfill</th>
              <th>Stripe</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ padding: "3rem", textAlign: "center" }}>
                  <div className="spinner" style={{ margin: "0 auto" }} />
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr className="empty-row"><td colSpan={8}>No users found.</td></tr>
            )}
            {!loading && filtered.map(user => {
              const isEditing = !!editingPlan[user.id];
              const edit = editingPlan[user.id] || {};
              const isSaving = saving[user.id];
              const isSaved = saved[user.id];
              const usagePct = user.plan === "Starter" ? Math.min(100, ((user.monthly_reply_count || 0) / 50) * 100) : null;

              return (
                <tr key={user.id}>
                  {/* USER */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="user-avatar">{initials(user.name, user.email || user.google_email)}</div>
                      <div>
                        <div className="user-name">{user.name || "—"}</div>
                        <div className="user-email">{user.email || user.google_email || "—"}</div>
                      </div>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>
                    {isEditing ? (
                      <div className="plan-edit-row">
                        <select
                          className="plan-select"
                          value={edit.plan || ""}
                          onChange={e => setEditingPlan(prev => ({ ...prev, [user.id]: { ...prev[user.id], plan: e.target.value } }))}
                        >
                          <option value="">No Plan</option>
                          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {isSaved ? (
                          <span style={{ color: "#34d399", fontSize: 12, fontWeight: 600 }}>✓ Saved</span>
                        ) : (
                          <>
                            <button className="btn-save" onClick={() => savePlan(user.id)} disabled={isSaving}>
                              {isSaving ? <span className="spinner" style={{ width: 12, height: 12 }} /> : "Save"}
                            </button>
                            <button className="btn-cancel" onClick={() => cancelEdit(user.id)}>✕</button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PlanBadge plan={user.plan} />
                        <button className="btn-edit" onClick={() => startEdit(user)}>Edit</button>
                      </div>
                    )}
                  </td>

                  {/* BILLING */}
                  <td>
                    {isEditing ? (
                      <select
                        className="plan-select"
                        value={edit.billing || "monthly"}
                        onChange={e => setEditingPlan(prev => ({ ...prev, [user.id]: { ...prev[user.id], billing: e.target.value } }))}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textTransform: "capitalize" }}>
                        {user.billing || "—"}
                      </span>
                    )}
                  </td>

                  {/* LOCATION */}
                  <td>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                      {user.google_location_name || "—"}
                    </span>
                  </td>

                  {/* JOINED */}
                  <td>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                      {timeAgo(user.created_at)}
                    </span>
                  </td>

                  {/* MONTHLY USAGE */}
                  <td className="usage-cell">
                    {user.plan === "Starter" ? (
                      <>
                        <span style={{ color: usagePct >= 90 ? "#f87171" : "rgba(255,255,255,0.6)" }}>
                          {user.monthly_reply_count || 0}/50
                        </span>
                        <div className="usage-bar">
                          <div className="usage-fill" style={{ width: `${usagePct}%`, background: usagePct >= 90 ? "#ef4444" : "#3b82f6" }} />
                        </div>
                      </>
                    ) : user.plan ? (
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Unlimited</span>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>—</span>
                    )}
                  </td>

                  {/* BACKFILL */}
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: user.backfill_done ? "#34d399" : "rgba(255,255,255,0.25)",
                    }}>
                      {user.backfill_done ? "Done" : "Pending"}
                    </span>
                  </td>

                  {/* STRIPE */}
                  <td>
                    {user.stripe_customer_id ? (
                      <a
                        className="stripe-link"
                        href={`https://dashboard.stripe.com/customers/${user.stripe_customer_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Stripe ↗
                      </a>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
