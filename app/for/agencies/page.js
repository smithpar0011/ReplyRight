import ContentLayout from "../../components/ContentLayout";

export const metadata = {
  title: "Google Review Automation for Marketing Agencies — ReplyRight",
  description: "Manage Google review responses for all your clients from one dashboard. ReplyRight Agency handles unlimited locations, automated AI responses, and reporting.",
  alternates: { canonical: "https://replyrightapp.com/for/agencies" },
};

function P({ children }) { return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>; }
function H2({ children }) { return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>; }

export default function AgenciesPage() {
  return (
    <ContentLayout
      badge="For Agencies"
      title="Google Review Automation for Marketing Agencies"
      subtitle="Stop manually responding to reviews for every client. ReplyRight Agency automates responses across unlimited locations — freeing your team for higher-value work."
    >
      <P>If you manage digital marketing for multiple small businesses, Google review management is probably one of your least favorite parts of the job. It's time-consuming, repetitive, and clients expect it to happen fast — including evenings and weekends.</P>
      <P>ReplyRight Agency changes the equation entirely. One platform, unlimited client locations, fully automated AI responses — all running 24/7 without your team lifting a finger.</P>

      <H2>What the Agency Plan Includes</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "1rem", margin: "1.5rem 0" }}>
        {[
          { icon: "🏢", title: "Unlimited locations", desc: "Add as many client Google Business Profiles as you need. No per-location fees, no surprises." },
          { icon: "🤖", title: "Fully automated responses", desc: "Every review gets a personalized AI response within minutes — automatically, for every client, every day." },
          { icon: "📊", title: "Analytics dashboard", desc: "Review volume, response rate, average rating, and trends — for every client in one place." },
          { icon: "🎨", title: "White-label reporting", desc: "Export branded reports to share with clients. Looks like your agency built it." },
          { icon: "🎯", title: "Per-business customization", desc: "Set different tone, style, and business type for each client location." },
          { icon: "🔒", title: "Dedicated support", desc: "Priority support for agency accounts — not a general support queue." },
        ].map(({ icon, title, desc }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "1.4rem", border: "1.5px solid #ece8e0" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div style={{ fontWeight: 700, color: "#0f1f38", marginBottom: "0.4rem", fontSize: "0.95rem" }}>{title}</div>
            <div style={{ fontSize: "0.85rem", color: "#718096", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H2>The ROI Math for Agencies</H2>
      <P>Let's say you manage 20 client locations, each getting an average of 15 reviews per month. That's 300 reviews per month your team needs to respond to.</P>
      <P>At 7 minutes per review (reading, writing, reviewing, posting), that's <strong>35 hours of team time per month</strong> — just on review responses. At $30/hour loaded cost, that's $1,050 in labor for one task.</P>
      <P>ReplyRight Agency is $149/month. The math is obvious.</P>
      <P>Beyond the cost savings, your team gets back 35 hours per month for strategy, creative work, and client relationships — the work that actually grows your agency.</P>

      <H2>How Agencies Use ReplyRight</H2>
      <P>Most agencies set up ReplyRight for a client during onboarding — it takes under 5 minutes per location. After that, the system runs completely on autopilot. The agency gets all the credit for consistent, professional review management without doing the manual work.</P>
      <P>For clients who want to stay in the loop, approval mode (available on all plans) lets clients or account managers review AI-generated responses before they go live — without the agency having to write them from scratch.</P>

      <H2>Pricing for Agencies</H2>
      <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #22c55e", padding: "2rem", margin: "1.5rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f1f38" }}>Agency Plan</div>
            <div style={{ color: "#718096", fontSize: "0.9rem" }}>Everything you need to manage unlimited clients</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f1f38" }}>$149<span style={{ fontSize: "1rem", fontWeight: 400, color: "#718096" }}>/mo</span></div>
            <div style={{ fontSize: "0.85rem", color: "#16a34a" }}>or $119/mo billed annually</div>
          </div>
        </div>
        {["Unlimited client locations", "Fully automated AI responses 24/7", "Analytics dashboard for all locations", "White-label client reports", "Per-business tone & style settings", "Approval mode for all locations", "Dedicated priority support", "14-day free trial"].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4a5568" }}>
            <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span> {f}
          </div>
        ))}
        <a href="/" style={{ display: "inline-block", marginTop: "1.5rem", background: "#22c55e", color: "#fff", textDecoration: "none", padding: "0.8rem 2rem", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem" }}>
          Start Free 14-Day Trial →
        </a>
      </div>
    </ContentLayout>
  );
}
