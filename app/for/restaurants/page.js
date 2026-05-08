import ContentLayout from "../../components/ContentLayout";

export const metadata = {
  title: "Automated Google Review Responses for Restaurants",
  description: "ReplyRight automatically responds to every Google review for your restaurant — 24/7, in your brand voice. Start your free 14-day trial.",
  alternates: { canonical: "https://replyrightapp.com/for/restaurants" },
};

function P({ children }) { return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>; }
function H2({ children }) { return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>; }

export default function RestaurantsPage() {
  return (
    <ContentLayout
      badge="For Restaurants"
      title="Automated Google Review Responses for Restaurants"
      subtitle="You're running a kitchen, managing staff, and handling service. You don't have time to respond to every review. ReplyRight does it for you — automatically."
    >
      <P>Restaurants live and die by their Google reviews. A potential customer deciding between two dinner spots will almost always check Google first — and they notice which restaurants respond to reviews and which ones don't.</P>
      <P>The problem is that restaurant owners are among the busiest people on the planet. Between prep, service, staff, and suppliers, responding to reviews often falls to the bottom of the list. ReplyRight solves that completely.</P>

      <H2>How It Works for Restaurants</H2>
      <P>ReplyRight connects directly to your Google Business Profile and monitors your reviews in real time. The moment a new review comes in — whether it's a glowing 5-star during dinner service or a 1-star at 2am — ReplyRight generates a personalized, professional response and posts it to Google automatically.</P>
      <P>The AI is trained to write restaurant-specific responses: it references food, service, atmosphere, and the specific things the reviewer mentioned. It never uses generic phrases like "We value your feedback." It sounds like a real person who works at your restaurant wrote it.</P>

      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ece8e0", padding: "1.8rem", margin: "2rem 0" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Example — 5-Star Review Response</div>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>Customer review:</div>
          <div style={{ background: "#f8f5ef", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "Best pasta I've ever had. The carbonara was perfect — not too heavy, and the service was incredibly attentive all night. Will be back every week."
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "0.4rem" }}>ReplyRight response (auto-posted):</div>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.9rem 1.1rem", fontSize: "0.9rem", color: "#4a5568", fontStyle: "italic" }}>
            "Thank you so much — we're thrilled the carbonara hit the spot! Our chef puts a lot of love into that dish, so it means the world to hear it landed perfectly. We'll pass your kind words to the team. We can't wait to see you back soon! 🍝"
          </div>
        </div>
      </div>

      <H2>Handling Negative Restaurant Reviews</H2>
      <P>Even the best restaurants get occasional bad reviews. A cold dish, a long wait on a busy Friday — it happens. What matters is how you respond.</P>
      <P>ReplyRight handles 1-star reviews with extra care: acknowledging the issue, apologizing genuinely, and inviting the customer to reach out directly. The tone is warm and professional — never defensive, never dismissive.</P>

      <H2>Why It Matters for Restaurants Specifically</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "1rem", margin: "1.5rem 0" }}>
        {[
          { icon: "📍", title: "Local search ranking", desc: "Google rewards businesses that engage with reviews. Responding to every review helps you rank higher in 'restaurants near me' searches." },
          { icon: "🍽️", title: "First impression", desc: "Most diners decide where to eat based on Google reviews before they've ever been to your restaurant. Your responses shape that first impression." },
          { icon: "⭐", title: "Rating improvement", desc: "Businesses that respond to all reviews maintain higher average star ratings over time — especially because unhappy customers see you care." },
          { icon: "⏰", title: "24/7 coverage", desc: "Reviews come in at all hours. ReplyRight responds at 2am just as fast as it does at 2pm — so no review ever sits unanswered." },
        ].map(({ icon, title, desc }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "1.4rem", border: "1.5px solid #ece8e0" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div style={{ fontWeight: 700, color: "#0f1f38", marginBottom: "0.4rem", fontSize: "0.95rem" }}>{title}</div>
            <div style={{ fontSize: "0.85rem", color: "#718096", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      <H2>What Restaurant Owners Say</H2>
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ece8e0", padding: "1.8rem", margin: "1.5rem 0" }}>
        <p style={{ fontSize: "1rem", color: "#0f1f38", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1rem" }}>
          "I used to feel guilty every time I saw a review I hadn't responded to. Now I don't even think about it. ReplyRight handles all of it and the responses are genuinely better than what I would have written after a long shift."
        </p>
        <div style={{ fontSize: "0.85rem", color: "#718096" }}>— Restaurant owner, Salt Lake City, UT</div>
      </div>

      <H2>Plans for Restaurants</H2>
      <P><strong>Starter ($29/mo)</strong> — Perfect for single-location restaurants. Automated responses to every review, 24/7.</P>
      <P><strong>Pro ($59/mo)</strong> — Ideal for restaurants with up to 3 locations, or those who want to review responses before posting (approval mode).</P>
      <P><strong>Agency ($149/mo)</strong> — For restaurant groups, franchises, or management companies handling multiple locations.</P>
      <P>All plans include a 14-day free trial. Setup takes under 5 minutes — connect your Google Business Profile and you're live.</P>
    </ContentLayout>
  );
}
