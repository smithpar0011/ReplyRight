"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STAR_MAP = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const TONES = ["professional", "friendly", "apologetic", "enthusiastic"];

function Stars({ rating }) {
  const n = STAR_MAP[rating] || 0;
  return (
    <span style={{ color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(n)}
      <span style={{ opacity: 0.2 }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function Dashboard() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tone, setTone] = useState("professional");

  // Per-review state: generated response, generating flag, posting flag, posted flag
  const [responses, setResponses] = useState({});
  const [generating, setGenerating] = useState({});
  const [posting, setPosting] = useState({});
  const [posted, setPosted] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => {
        if (r.status === 401) { router.push("/"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) { setError(data.error); return; }
        setLocations(data.locations || []);
      })
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  const currentLoc = locations[selectedLoc];
  const pendingReviews = currentLoc?.reviews.filter((r) => !r.reply && r.comment) || [];
  const repliedReviews = currentLoc?.reviews.filter((r) => r.reply) || [];

  async function generateResponse(review) {
    const id = review.name;
    setGenerating((g) => ({ ...g, [id]: true }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bizName: currentLoc.locationName,
          bizType: "business",
          stars: STAR_MAP[review.starRating] || 5,
          reviewText: review.comment,
          tone,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setResponses((r) => ({ ...r, [id]: data.response }));
      }
    } finally {
      setGenerating((g) => ({ ...g, [id]: false }));
    }
  }

  async function generateAll() {
    await Promise.all(
      pendingReviews
        .filter((r) => !responses[r.name])
        .map((r) => generateResponse(r))
    );
  }

  async function postResponse(review) {
    const id = review.name;
    const comment = responses[id];
    if (!comment) return;
    setPosting((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewName: id, comment }),
      });
      const data = await res.json();
      if (data.success) setPosted((p) => ({ ...p, [id]: true }));
      else alert("Failed to post: " + data.error);
    } finally {
      setPosting((p) => ({ ...p, [id]: false }));
    }
  }

  async function postAll() {
    await Promise.all(
      pendingReviews
        .filter((r) => responses[r.name] && !posted[r.name])
        .map((r) => postResponse(r))
    );
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0f1f38; --blue: #1e4d8c; --accent: #2e7df7;
          --gold: #c8a96e; --cream: #f8f5ef; --cream-dark: #ede8de;
          --white: #ffffff; --text-dark: #0f1f38; --text-mid: #4a5568;
          --text-light: #8896a7; --success: #16a34a; --star: #f59e0b;
          --danger: #dc2626;
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--cream); min-height: 100vh; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* HEADER */
        .dash-nav {
          background: var(--navy); padding: 0 2rem; height: 58px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .dash-logo { font-family: 'Instrument Serif', serif; font-size: 1.35rem; color: white; }
        .dash-logo span { color: var(--accent); }
        .dash-nav-right { display: flex; align-items: center; gap: 1rem; }
        .dash-location-select {
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
          color: white; border-radius: 6px; padding: .4rem .8rem;
          font-family: 'DM Sans', sans-serif; font-size: .85rem; cursor: pointer; outline: none;
        }
        .dash-location-select option { background: var(--navy); }
        .logout-btn {
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
          color: rgba(255,255,255,.7); border-radius: 6px; padding: .38rem .85rem;
          font-size: .8rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all .2s;
        }
        .logout-btn:hover { background: rgba(255,255,255,.15); color: white; }

        /* STATS BAR */
        .stats-bar {
          background: var(--white); border-bottom: 1px solid var(--cream-dark);
          padding: 1rem 2rem; display: flex; gap: 2.5rem; align-items: center; flex-wrap: wrap;
        }
        .stat-item { text-align: center; }
        .stat-val { font-family: 'Instrument Serif', serif; font-size: 1.7rem; color: var(--navy); line-height: 1; }
        .stat-lbl { font-size: .72rem; color: var(--text-light); font-weight: 500; margin-top: .1rem; text-transform: uppercase; letter-spacing: .06em; }
        .stats-actions { margin-left: auto; display: flex; gap: .7rem; align-items: center; }

        /* TONE ROW */
        .tone-bar {
          background: var(--white); border-bottom: 1px solid var(--cream-dark);
          padding: .7rem 2rem; display: flex; align-items: center; gap: .8rem; flex-wrap: wrap;
        }
        .tone-label { font-size: .75rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: .08em; }
        .tone-pill {
          padding: .32rem .85rem; border-radius: 100px; font-size: .78rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          border: 1.5px solid var(--cream-dark); background: var(--cream); color: var(--text-mid);
          transition: all .15s;
        }
        .tone-pill:hover { border-color: var(--accent); color: var(--accent); }
        .tone-pill.active { background: var(--navy); border-color: var(--navy); color: white; }

        /* MAIN */
        .dash-main { max-width: 860px; margin: 0 auto; padding: 2rem; }
        .section-head { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--text-light); margin-bottom: 1rem; }

        /* REVIEW CARD */
        .review-card {
          background: var(--white); border: 1px solid var(--cream-dark); border-radius: 14px;
          padding: 1.4rem; margin-bottom: .9rem; animation: fadeUp .4s ease both;
        }
        .review-card.replied { opacity: .65; }
        .review-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .6rem; gap: 1rem; }
        .reviewer-name { font-size: .92rem; font-weight: 600; color: var(--navy); }
        .review-date { font-size: .75rem; color: var(--text-light); white-space: nowrap; }
        .review-text { font-size: .88rem; color: var(--text-mid); line-height: 1.65; margin-bottom: 1rem; }
        .response-area { background: var(--cream); border-radius: 8px; padding: 1rem; border: 1px solid var(--cream-dark); }
        .response-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--success); margin-bottom: .5rem; }
        .response-label.existing { color: var(--text-light); }
        .response-text { font-size: .85rem; color: var(--text-dark); line-height: 1.65; white-space: pre-wrap; }
        .response-textarea {
          width: 100%; font-family: 'DM Sans', sans-serif; font-size: .85rem; color: var(--text-dark);
          line-height: 1.65; border: none; background: transparent; resize: vertical;
          outline: none; min-height: 80px;
        }
        .card-actions { display: flex; gap: .6rem; margin-top: .9rem; align-items: center; }
        .btn-post {
          padding: .45rem 1.1rem; border-radius: 6px; font-size: .82rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif; border: none;
          background: var(--navy); color: white; transition: all .2s;
        }
        .btn-post:hover:not(:disabled) { background: var(--blue); }
        .btn-post:disabled { opacity: .5; cursor: not-allowed; }
        .btn-post.success { background: var(--success); }
        .btn-gen {
          padding: .45rem 1rem; border-radius: 6px; font-size: .82rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          border: 1.5px solid var(--cream-dark); background: transparent; color: var(--text-mid);
          transition: all .2s;
        }
        .btn-gen:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
        .btn-gen:disabled { opacity: .5; cursor: not-allowed; }
        .btn-edit {
          padding: .45rem .85rem; border-radius: 6px; font-size: .78rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          border: 1px solid var(--cream-dark); background: transparent; color: var(--text-light);
        }

        /* BULK ACTIONS */
        .btn-bulk {
          padding: .5rem 1.1rem; border-radius: 7px; font-size: .84rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; transition: all .2s;
        }
        .btn-bulk-primary { background: var(--accent); color: white; }
        .btn-bulk-primary:hover { background: #1a6fe8; }
        .btn-bulk-outline {
          background: transparent; color: var(--navy);
          border: 1.5px solid rgba(15,31,56,.2) !important;
        }
        .btn-bulk-outline:hover { background: var(--white); }

        /* LOADING / EMPTY */
        .spinner { width: 20px; height: 20px; border: 2px solid var(--cream-dark); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        .empty-state { text-align: center; padding: 3rem; color: var(--text-light); font-size: .92rem; }
        .empty-icon { font-size: 2.2rem; margin-bottom: .7rem; }
        .error-banner { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 1rem 1.4rem; color: var(--danger); font-size: .88rem; }

        @media(max-width: 600px) {
          .dash-nav { padding: 0 1rem; }
          .stats-bar { padding: 1rem; gap: 1.5rem; }
          .stats-actions { margin-left: 0; width: 100%; }
          .dash-main { padding: 1rem; }
          .tone-bar { padding: .7rem 1rem; }
        }
      `}</style>

      {/* HEADER */}
      <nav className="dash-nav">
        <div className="dash-logo">Reply<span>Right</span></div>
        <div className="dash-nav-right">
          {locations.length > 1 && (
            <select
              className="dash-location-select"
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(Number(e.target.value))}
            >
              {locations.map((loc, i) => (
                <option key={i} value={i}>{loc.locationName}</option>
              ))}
            </select>
          )}
          <a href="/api/auth/logout">
            <button className="logout-btn">Disconnect Google</button>
          </a>
        </div>
      </nav>

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-light)" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem", width: 32, height: 32, borderWidth: 3 }} />
          <div>Loading your reviews…</div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="dash-main">
          <div className="error-banner">⚠️ {error}</div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && currentLoc && (
        <>
          {/* STATS BAR */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-val">{currentLoc.reviews.length}</div>
              <div className="stat-lbl">Total Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-val" style={{ color: "var(--accent)" }}>{pendingReviews.length}</div>
              <div className="stat-lbl">Pending Reply</div>
            </div>
            <div className="stat-item">
              <div className="stat-val" style={{ color: "var(--success)" }}>{repliedReviews.length}</div>
              <div className="stat-lbl">Replied</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">
                {currentLoc.reviews.length > 0
                  ? (
                      currentLoc.reviews.reduce(
                        (sum, r) => sum + (STAR_MAP[r.starRating] || 0), 0
                      ) / currentLoc.reviews.length
                    ).toFixed(1) + "★"
                  : "—"}
              </div>
              <div className="stat-lbl">Avg Rating</div>
            </div>
            <div className="stats-actions">
              <button className="btn-bulk btn-bulk-outline" onClick={generateAll}>
                Generate All
              </button>
              <button
                className="btn-bulk btn-bulk-primary"
                onClick={postAll}
                disabled={!pendingReviews.some((r) => responses[r.name] && !posted[r.name])}
              >
                Post All Responses
              </button>
            </div>
          </div>

          {/* TONE SELECTOR */}
          <div className="tone-bar">
            <span className="tone-label">Tone:</span>
            {TONES.map((t) => (
              <button
                key={t}
                className={`tone-pill${tone === t ? " active" : ""}`}
                onClick={() => setTone(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="dash-main">
            {/* PENDING REVIEWS */}
            {pendingReviews.length > 0 && (
              <>
                <div className="section-head">
                  Pending Replies — {pendingReviews.length}
                </div>
                {pendingReviews.map((review) => {
                  const id = review.name;
                  const isPosted = posted[id];
                  const isPosting = posting[id];
                  const isGenerating = generating[id];
                  const response = responses[id];
                  const isEditing = editingId === id;

                  return (
                    <div className="review-card" key={id}>
                      <div className="review-header">
                        <div>
                          <div className="reviewer-name">{review.reviewer}</div>
                          <Stars rating={review.starRating} />
                        </div>
                        <div className="review-date">{timeAgo(review.createTime)}</div>
                      </div>
                      {review.comment && (
                        <div className="review-text">"{review.comment}"</div>
                      )}

                      {response ? (
                        <div className="response-area">
                          <div className="response-label">✓ AI Response Ready</div>
                          {isEditing ? (
                            <textarea
                              className="response-textarea"
                              value={response}
                              onChange={(e) =>
                                setResponses((r) => ({ ...r, [id]: e.target.value }))
                              }
                              autoFocus
                            />
                          ) : (
                            <div className="response-text">{response}</div>
                          )}
                        </div>
                      ) : (
                        <div className="response-area" style={{ textAlign: "center", color: "var(--text-light)", fontSize: ".82rem", padding: ".8rem" }}>
                          {isGenerating ? (
                            <><span className="spinner" style={{ verticalAlign: "middle", marginRight: 8 }} />Generating response…</>
                          ) : (
                            "No response yet — click Generate"
                          )}
                        </div>
                      )}

                      <div className="card-actions">
                        {isPosted ? (
                          <button className="btn-post success" disabled>✓ Posted</button>
                        ) : (
                          <button
                            className="btn-post"
                            onClick={() => postResponse(review)}
                            disabled={!response || isPosting || isGenerating}
                          >
                            {isPosting ? "Posting…" : "Post Response"}
                          </button>
                        )}
                        <button
                          className="btn-gen"
                          onClick={() => generateResponse(review)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Generating…" : response ? "Regenerate" : "Generate"}
                        </button>
                        {response && !isPosted && (
                          <button
                            className="btn-edit"
                            onClick={() => setEditingId(isEditing ? null : id)}
                          >
                            {isEditing ? "Done" : "Edit"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {pendingReviews.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <div>All reviews have been replied to.</div>
              </div>
            )}

            {/* ALREADY REPLIED */}
            {repliedReviews.length > 0 && (
              <>
                <div className="section-head" style={{ marginTop: "2.5rem" }}>
                  Already Replied — {repliedReviews.length}
                </div>
                {repliedReviews.map((review) => (
                  <div className="review-card replied" key={review.name}>
                    <div className="review-header">
                      <div>
                        <div className="reviewer-name">{review.reviewer}</div>
                        <Stars rating={review.starRating} />
                      </div>
                      <div className="review-date">{timeAgo(review.createTime)}</div>
                    </div>
                    {review.comment && (
                      <div className="review-text">"{review.comment}"</div>
                    )}
                    <div className="response-area">
                      <div className="response-label existing">Your Reply</div>
                      <div className="response-text">{review.reply}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}

      {!loading && !error && locations.length === 0 && (
        <div className="dash-main">
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div>No Google Business locations found on this account.</div>
          </div>
        </div>
      )}
    </>
  );
}
