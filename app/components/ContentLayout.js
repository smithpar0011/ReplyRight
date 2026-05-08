// Shared layout for blog posts, comparison pages, and industry pages
// Server component — fully crawlable by Google and AI platforms

export default function ContentLayout({ children, badge, title, subtitle, publishDate, readTime }) {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f5ef", minHeight: "100vh" }}>
      <style>{`
        .cl-nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:1rem 2rem; background:rgba(15,31,56,0.97); backdrop-filter:blur(10px); }
        .cl-nav-links { display:flex; gap:1.2rem; align-items:center; }
        .cl-nav-link { color:rgba(255,255,255,0.7); text-decoration:none; font-size:0.85rem; font-weight:500; }
        .cl-nav-cta { background:#22c55e; color:#fff; text-decoration:none; padding:0.5rem 1.1rem; border-radius:8px; font-size:0.82rem; font-weight:600; white-space:nowrap; }
        .cl-hero { background:linear-gradient(135deg,#0f1f38 0%,#1a3a5c 100%); padding:7rem 1.5rem 3.5rem; text-align:center; }
        .cl-hero h1 { color:#fff; font-size:clamp(1.7rem,4vw,3rem); font-weight:800; line-height:1.2; max-width:780px; margin:0 auto 1.2rem; letter-spacing:-0.02em; font-family:'Poppins',sans-serif; }
        .cl-content { max-width:820px; margin:0 auto; padding:3rem 1.5rem 5rem; }
        .cl-cta { background:linear-gradient(135deg,#0f1f38,#1a3a5c); padding:4rem 1.5rem; text-align:center; }
        .cl-footer { background:#0a1628; padding:2rem 2rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem; }
        .cl-footer-links { display:flex; gap:1.2rem; flex-wrap:wrap; }
        @media(max-width:640px) {
          .cl-nav { padding:0.75rem 1.2rem; }
          .cl-nav-link { display:none; }
          .cl-nav-link.keep { display:inline; font-size:0.8rem; }
          .cl-nav-cta { font-size:0.78rem; padding:0.45rem 0.85rem; }
          .cl-hero { padding:5.5rem 1.2rem 2.5rem; }
          .cl-hero h1 { font-size:clamp(1.5rem,7vw,2.2rem) !important; }
          .cl-content { padding:2rem 1.2rem 4rem; }
          .cl-cta { padding:3rem 1.2rem; }
          .cl-cta h2 { font-size:1.4rem !important; }
          .cl-footer { flex-direction:column; text-align:center; padding:1.5rem 1.2rem; }
          .cl-footer-links { justify-content:center; gap:0.8rem; }
        }
      `}</style>

      {/* Nav */}
      <nav className="cl-nav">
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{
            width: 28, height: 28, background: "linear-gradient(135deg,#22c55e,#16a34a)",
            borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.8rem", fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>R</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>ReplyRight</span>
        </a>
        <div className="cl-nav-links">
          <a href="/blog" className="cl-nav-link">Blog</a>
          <a href="/#pricing" className="cl-nav-link">Pricing</a>
          <a href="/signin" className="cl-nav-link keep">Sign In</a>
          <a href="/" className="cl-nav-cta">Start Free Trial</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="cl-hero">
        {badge && (
          <div style={{
            display: "inline-block", background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)", borderRadius: 100,
            padding: "0.35rem 1rem", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "#22c55e",
            marginBottom: "1.5rem",
          }}>{badge}</div>
        )}
        <h1>{title}</h1>
        {subtitle && (
          <p style={{
            color: "rgba(255,255,255,0.65)", fontSize: "clamp(0.88rem,2.5vw,1.05rem)",
            maxWidth: 600, margin: "0 auto", lineHeight: 1.7,
          }}>{subtitle}</p>
        )}
        {(publishDate || readTime) && (
          <div style={{
            display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap",
            marginTop: "1.5rem", color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem", fontWeight: 500,
          }}>
            {publishDate && <span>📅 {publishDate}</span>}
            {readTime && <span>⏱ {readTime} min read</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="cl-content">
        {children}
      </div>

      {/* CTA Banner */}
      <div className="cl-cta">
        <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Ready to automate your Google review responses?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "1.5rem", fontSize: "1rem" }}>
          Start your 14-day free trial. No credit card required.
        </p>
        <a href="/" style={{
          display: "inline-block", background: "#22c55e", color: "#fff",
          textDecoration: "none", padding: "0.9rem 2rem", borderRadius: 10,
          fontWeight: 700, fontSize: "1rem",
        }}>Start Free Trial — 14 Days Free</a>
      </div>

      {/* Footer */}
      <footer className="cl-footer">
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          © 2026 ReplyRight · <a href="/privacy" style={{ color: "rgba(255,255,255,0.4)" }}>Privacy</a> · <a href="/terms" style={{ color: "rgba(255,255,255,0.4)" }}>Terms</a>
        </span>
        <div className="cl-footer-links">
          <a href="/blog" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textDecoration: "none" }}>Blog</a>
          <a href="/compare/replyright-vs-chatgpt" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textDecoration: "none" }}>vs ChatGPT</a>
          <a href="/for/restaurants" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textDecoration: "none" }}>Restaurants</a>
          <a href="/for/agencies" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textDecoration: "none" }}>Agencies</a>
        </div>
      </footer>
    </div>
  );
}
