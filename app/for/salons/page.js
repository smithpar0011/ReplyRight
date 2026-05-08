import ContentLayout from "../../components/ContentLayout";

export const metadata = {
  title: "Automated Google Review Responses for Salons & Spas — ReplyRight",
  description: "ReplyRight automatically responds to every Google review for your salon or spa. Professional, personalized responses posted within minutes — 24/7.",
  alternates: { canonical: "https://replyrightapp.com/for/salons" },
};

function P({ children }) { return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>; }
function H2({ children }) { return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>; }

export default function SalonsPage() {
  return (
    <ContentLayout
      badge="For Salons & Spas"
      title="Automated Google Review Responses for Salons & Spas"
      subtitle="You're focused on your clients. Let ReplyRight handle every Google review — automatically, professionally, and in your brand voice."
    >
      <P>For salons, spas, and beauty businesses, Google reviews are everything. Clients searching for a new stylist or esthetician almost always check Google first — and they pay close attention to how the business responds to reviews, especially the negative ones.</P>
      <P>The challenge is that between appointments, you rarely have time to sit down and craft thoughtful responses. ReplyRight handles every review automatically, so your Google profile always looks active, engaged, and professional.</P>

      <H2>Why Google Reviews Matter More for Salons</H2>
      <P>Hair and beauty services are deeply personal. Clients are trusting you with how they look and feel. That means they do more research before booking — and read reviews more carefully than they might for, say, a hardware store.</P>
      <P>A salon with 50 reviews and thoughtful responses to each one will consistently outperform a salon with 200 reviews and no responses. The responses signal that the owner cares about every client's experience.</P>

      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ece8e0", padding: "1.8rem", margin: "2rem 0" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Example — Salon Review Response</div>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>Customer review:</div>
          <div style={{ background: "#f8f5ef", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "Absolutely loved my balayage! Sarah was so attentive and really listened to what I wanted. The salon has such a relaxing vibe. I've already booked my next appointment."
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>ReplyRight response (auto-posted):</div>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "This made our day! We'll be sure to pass along your kind words to Sarah — she truly loves what she does, and it shows. So glad you felt relaxed and heard throughout your visit. We can't wait to see you at your next appointment! 💛"
          </div>
        </div>
      </div>

      <H2>Handling Negative Salon Reviews Automatically</H2>
      <P>Even the best stylists occasionally have a client who wasn't happy. Maybe expectations weren't aligned, maybe a color didn't turn out exactly right. A 1-star review without a response looks terrible — but a thoughtful, professional response can actually salvage the situation in the eyes of future clients.</P>
      <P>ReplyRight responds to negative reviews with empathy and professionalism — acknowledging the experience, apologizing genuinely, and inviting the client to reach out to make it right.</P>

      <H2>Setup Takes 5 Minutes</H2>
      <P>Connect your Google Business Profile, select your business type (salon/spa), and you're live. ReplyRight handles everything from there — detecting new reviews the moment they're posted and responding within minutes, 24/7.</P>
      <P>Plans start at $29/month with a 14-day free trial. For salons with multiple locations (like a chain), the Agency plan at $149/month covers unlimited locations.</P>
    </ContentLayout>
  );
}
