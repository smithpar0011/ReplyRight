import ContentLayout from "../../components/ContentLayout";

export const metadata = {
  title: "Automated Google Review Responses for Dental Offices — ReplyRight",
  description: "ReplyRight automatically responds to every Google review for your dental practice. HIPAA-aware, professional, and fully automated 24/7.",
  alternates: { canonical: "https://replyrightapp.com/for/dental" },
};

function P({ children }) { return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>; }
function H2({ children }) { return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>; }

export default function DentalPage() {
  return (
    <ContentLayout
      badge="For Dental Offices"
      title="Automated Google Review Responses for Dental Offices"
      subtitle="Every new patient checks your Google reviews before booking. ReplyRight makes sure every review gets a professional, timely response — without your team spending hours on it."
    >
      <P>New dental patients are skeptical by nature. Dentistry is personal, sometimes anxiety-inducing, and expensive. Before they book an appointment with a new office, they read reviews carefully — and they notice which practices engage with their patients and which ones don't.</P>
      <P>ReplyRight automatically responds to every Google review for your dental practice with professional, warm responses that reinforce your reputation as a caring, attentive provider.</P>

      <H2>HIPAA-Aware Responses</H2>
      <P>One of the unique challenges for dental offices is HIPAA compliance. You cannot confirm or deny treatment, discuss procedures, or share any patient health information in a public review response — even if the patient brings it up themselves in their review.</P>
      <P>ReplyRight's AI is trained to handle this correctly. Responses for dental and medical practices are crafted to acknowledge the patient's experience without confirming any protected health information. Responses invite patients to contact the office directly for any specific concerns — the appropriate channel for those conversations.</P>

      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ece8e0", padding: "1.8rem", margin: "2rem 0" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Example — Dental Practice Review Response</div>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>Patient review:</div>
          <div style={{ background: "#f8f5ef", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "I've been terrified of the dentist my whole life but Dr. Johnson made me feel completely comfortable. The staff was patient and explained everything. First time I've left a dental appointment actually smiling."
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>ReplyRight response (auto-posted, HIPAA-safe):</div>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "This is exactly what we strive for — thank you for sharing this! We know dental anxiety is real, and making every patient feel genuinely at ease is something our whole team takes seriously. We're so glad your experience reflected that. We look forward to seeing you at your next visit! 😊"
          </div>
        </div>
      </div>

      <H2>Why Review Responses Are Critical for Dental Practices</H2>
      {[
        { icon: "🦷", title: "New patient acquisition", desc: "An estimated 72% of patients use online reviews to find a new doctor or dentist. Your Google reviews and your responses to them are your most visible marketing." },
        { icon: "⭐", title: "Competitive differentiation", desc: "Many dental practices have decent star ratings but few responses. A practice that responds to every review stands out immediately as more engaged and trustworthy." },
        { icon: "📈", title: "Google local ranking", desc: "Consistent review engagement is a local SEO ranking factor. Practices that respond to reviews regularly rank higher in 'dentist near me' searches." },
        { icon: "🔒", title: "Professionalism signal", desc: "How you respond to reviews — especially critical ones — tells potential patients more about your practice culture than almost anything else." },
      ].map(({ icon, title, desc }, i) => (
        <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 700, color: "#0f1f38", marginBottom: "0.3rem" }}>{title}</div>
            <div style={{ color: "#4a5568", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</div>
          </div>
        </div>
      ))}

      <H2>Get Started in 5 Minutes</H2>
      <P>Connect your Google Business Profile, select "Dental / Medical" as your business type, and ReplyRight immediately begins monitoring for new reviews. Every review gets a professional, HIPAA-aware response within minutes — 24/7, including nights and weekends.</P>
      <P>Plans start at $29/month with a 14-day free trial. No credit card required to start.</P>
    </ContentLayout>
  );
}
