import ContentLayout from "../../components/ContentLayout";

export const metadata = {
  title: "50 Google Review Response Templates (Copy-Paste Ready) — 2026",
  description: "Free Google review response templates for every situation — 5-star, 1-star, no comment, and more. Copy-paste ready for any business type.",
  alternates: { canonical: "https://replyrightapp.com/blog/review-response-templates" },
};

function P({ children }) { return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>; }
function H2({ children }) { return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>; }

const templates = {
  "5-Star Reviews (Positive)": [
    { label: "Short & enthusiastic", text: "Thank you so much — this made our whole team's day! We love what we do, and it means everything when that comes through. We can't wait to see you again!" },
    { label: "References specific detail", text: "So glad [specific service/product] hit the spot! We'll pass your kind words along to the team. Thank you for taking the time to share this — it genuinely means a lot." },
    { label: "For a first-time visitor", text: "Welcome — and what a way to start! We're so glad your first experience with us was a great one. We'd love to see you become a regular. Thank you for this wonderful review!" },
    { label: "For a returning customer", text: "Your continued loyalty means the world to us — thank you! Reviews like this remind us why we do what we do. Looking forward to seeing you next time!" },
    { label: "Warm and personal", text: "This honestly made our day. We put a lot of heart into [what you do], and hearing that it landed means everything. Thank you for sharing this — see you soon!" },
    { label: "For a restaurant", text: "Thank you so much! We're thrilled the [dish/experience] was everything you hoped for. We'll be sure to pass along your kind words to the kitchen. Looking forward to your next visit!" },
    { label: "For a salon/spa", text: "You're the best — thank you for this! We love what we do, and reviews like yours make it even better. We'll pass along your kind words. See you at your next appointment! 💛" },
    { label: "For a medical/dental office", text: "Thank you for taking the time to share this. Making every patient feel comfortable and cared for is what our whole team strives for. We look forward to seeing you again!" },
  ],
  "4-Star Reviews (Mostly Positive)": [
    { label: "Acknowledge the positive, invite feedback", text: "Thank you so much for the kind words! We'd love to earn that fifth star next time — if there's anything specific we could have done better, we'd genuinely love to hear it. See you again soon!" },
    { label: "Professional and appreciative", text: "We really appreciate you sharing this! We're always looking to improve, and reviews like yours help us do that. We hope to see you again and make your next experience even better." },
    { label: "Warm and inviting", text: "Thank you for this! We're glad the experience was a positive one overall. We're always working to be even better — hope to see you again soon!" },
  ],
  "1-Star & Negative Reviews": [
    { label: "General apology + invitation to resolve", text: "We're truly sorry your experience didn't meet expectations — that's not the standard we hold ourselves to. We'd really appreciate the chance to make this right. Please reach out to us directly at [email/phone] so we can address this personally." },
    { label: "Specific complaint acknowledged", text: "Thank you for bringing this to our attention. We're sorry to hear about [the issue] — that's not the experience we want for anyone who visits us. We'd love the opportunity to make it right. Please contact us at [email/phone]." },
    { label: "Calm response to angry review", text: "We're sorry your visit left you feeling this way. This is the last thing we want, and we take every concern seriously. Please reach out to us at [email/phone] when you're ready — we'd genuinely like to understand what went wrong and make it right." },
    { label: "For a factually incorrect review", text: "We appreciate you sharing your experience. We want to make sure we understand exactly what happened — some of the details don't match our records, and we'd like to look into this for you. Please reach out at [email/phone] so we can work through this together." },
    { label: "For a food complaint (restaurant)", text: "We're so sorry the [dish/meal] wasn't up to the standard we set for ourselves. That's genuinely disappointing to hear. Please reach out to us at [email/phone] — we'd like to make this right for you." },
    { label: "For a wait time complaint", text: "We completely understand your frustration and we're sorry for the wait. We know your time is valuable. We're actively working on improving our flow during busy periods, and we'd love another opportunity to show you a better experience." },
    { label: "For a staff complaint", text: "We're very sorry to hear about your interaction with our team — that absolutely does not reflect our standards. We take this seriously and will address it internally. Please reach out to us at [email/phone] so we can follow up directly." },
    { label: "For a pricing complaint", text: "Thank you for the feedback. We understand that pricing is always a consideration, and we appreciate you sharing your perspective. We strive to offer strong value for the quality we provide. If you'd like to discuss further, please don't hesitate to reach out." },
  ],
  "No Text (Star Rating Only)": [
    { label: "For a high rating with no text", text: "Thank you for the kind rating — it really means a lot! We'd love to hear more about your experience anytime. Hope to see you again soon!" },
    { label: "For a low rating with no text", text: "Thank you for taking the time to leave a rating. We're sorry if something wasn't right — we'd genuinely appreciate the chance to hear more and make it right. Please reach out at [email/phone] whenever you're ready." },
    { label: "Neutral, no text", text: "Thank you for the rating! If there's anything we could do to improve your experience next time, we'd love to hear it. We hope to see you again soon." },
  ],
  "Industry-Specific Templates": [
    { label: "Auto repair shop — positive", text: "Thank you for trusting us with your vehicle — that means a lot! We know taking your car in can be stressful, and we're glad we could make the process easy and transparent. We're here whenever you need us!" },
    { label: "Hotel / vacation rental — positive", text: "What a wonderful review — thank you! We love that you felt at home during your stay. We put a lot of care into every detail, and it means everything to know that came through. We'd love to host you again!" },
    { label: "Gym / fitness studio — positive", text: "This is amazing to hear — thank you! Our coaches and staff are genuinely passionate about helping members reach their goals, and reviews like this make it all worth it. Keep crushing it — we'll see you in class!" },
    { label: "Law firm / professional services — positive", text: "Thank you for taking the time to share this. We know these matters are often stressful, and making sure our clients feel informed and supported is something we take very seriously. We appreciate your trust." },
    { label: "Veterinary clinic — positive", text: "This made our whole team smile — thank you! We know how important your pet is to you, and we treat every animal like they're our own. We're so glad [pet name / 'your pet'] is doing well and that you felt confident in our care!" },
    { label: "Retail store — positive", text: "Thank you so much! We're so glad you found exactly what you were looking for. Our team works hard to make sure every visit is a great one. We hope to see you again soon!" },
  ],
};

export default function Article() {
  return (
    <ContentLayout
      badge="Templates"
      title="50 Google Review Response Templates (Copy-Paste Ready)"
      subtitle="Free templates for every review situation. Copy, customize with your details, and post — or let ReplyRight do it automatically."
      publishDate="February 2026"
      readTime={5}
    >
      <div style={{ background: "rgba(34,197,94,0.06)", border: "1.5px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "1.2rem 1.5rem", marginBottom: "2rem", color: "#166534", fontSize: "0.9rem", lineHeight: 1.7 }}>
        <strong>Pro tip:</strong> These templates are a great starting point — but the best responses reference specific details from each review. If you want that done automatically for every review, <a href="/" style={{ color: "#16a34a" }}>ReplyRight</a> handles it 24/7 with no manual work.
      </div>

      <P>Responding to Google reviews consistently is one of the highest-ROI things you can do for your local SEO and customer trust. Below are 50+ templates organized by situation — copy and customize as needed.</P>
      <P><strong>How to use these:</strong> Replace bracketed text like [email/phone] or [specific service] with your actual details. The best responses feel personal, so add a specific detail from the review when possible.</P>

      {Object.entries(templates).map(([category, items]) => (
        <div key={category}>
          <H2>{category}</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map(({ label, text }, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #ece8e0", padding: "1.2rem 1.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#718096", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</div>
                <div style={{ fontSize: "0.9rem", color: "#4a5568", lineHeight: 1.7, fontStyle: "italic" }}>"{text}"</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: "#0f1f38", borderRadius: 14, padding: "2rem", margin: "3rem 0", textAlign: "center" }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.5rem" }}>Stop copying and pasting. Let ReplyRight do it automatically.</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Every review gets a personalized response within minutes. 24/7. Starting at $29/month.</div>
        <a href="/" style={{ display: "inline-block", background: "#22c55e", color: "#fff", textDecoration: "none", padding: "0.8rem 2rem", borderRadius: 10, fontWeight: 700 }}>Start Free 14-Day Trial →</a>
      </div>
    </ContentLayout>
  );
}
