import ContentLayout from "../components/ContentLayout";

export const metadata = {
  title: "About ReplyRight — Automated Google Review Responses",
  description: "ReplyRight was built to solve one problem: small business owners spending hours every week responding to Google reviews. Learn our story, mission, and team.",
  alternates: { canonical: "https://replyrightapp.com/about" },
  openGraph: {
    title: "About ReplyRight",
    description: "We built ReplyRight because small business owners deserve to focus on their business — not on copying and pasting review responses.",
    url: "https://replyrightapp.com/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About ReplyRight",
  url: "https://replyrightapp.com/about",
  description: "ReplyRight is an AI-powered platform that automatically responds to Google Business Profile reviews for small businesses, restaurants, salons, dental offices, and agencies.",
  mainEntity: {
    "@type": "Organization",
    name: "ReplyRight",
    url: "https://replyrightapp.com",
    foundingDate: "2026",
    description: "ReplyRight automatically responds to Google reviews using AI — professional, on-brand, and instant.",
    founder: {
      "@type": "Person",
      name: "Parker Smith",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "parker@replyrightapp.com",
      contactType: "customer support",
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Google Business Profile review management",
      "AI-powered review responses",
      "Reputation management for small businesses",
      "Automated review response software",
    ],
  },
};

function P({ children }) {
  return <p style={{ color: "#4a5568", lineHeight: 1.8, marginBottom: "1.1rem", fontSize: "0.97rem" }}>{children}</p>;
}
function H2({ children }) {
  return <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f1f38", margin: "2.5rem 0 1rem", letterSpacing: "-0.01em" }}>{children}</h2>;
}

export default function AboutPage() {
  return (
    <ContentLayout
      badge="Our Story"
      title="We built ReplyRight because business owners deserve better"
      subtitle="Responding to Google reviews shouldn't take hours every week. We automated the whole thing so you never have to think about it again."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <H2>The Problem We Saw</H2>
      <P>In 2025, we were talking to small business owners — restaurant owners, salon operators, dentists, auto repair shop managers — and kept hearing the same thing: "I know I should respond to my Google reviews, but I just don't have the time."</P>
      <P>These weren't people who didn't care. They cared deeply. They just had actual businesses to run. A restaurant owner working a Friday dinner rush isn't thinking about the 3-star review that came in that morning. A salon owner finishing back-to-back appointments isn't writing personalized responses between clients.</P>
      <P>The result? Hundreds of unanswered reviews. Star ratings dropping. Potential customers choosing competitors who looked more responsive and engaged. And business owners feeling guilty every time they saw another notification they didn't have time to act on.</P>

      <H2>Why Existing Solutions Weren't Good Enough</H2>
      <P>The obvious fix — using ChatGPT to write responses — requires you to manually copy each review, write a prompt, generate a response, copy it back, and post it on Google. That's 7 steps per review, every single time. For a business getting 20 reviews a month, that's hours of work — and it still requires you to notice the review, remember to do it, and have the mental bandwidth to actually follow through.</P>
      <P>The enterprise tools — Birdeye, Podium, Grade.us — are built for companies with dedicated marketing teams and budgets to match. They start at $249–$299/month and require onboarding calls and technical setup. They're not built for the owner of a family restaurant or a two-chair hair salon.</P>
      <P>Nobody had built something that just worked — automatically, affordably, and in a way that produced genuinely human-sounding responses.</P>

      <H2>What We Built</H2>
      <P>ReplyRight connects directly to your Google Business Profile via official Google OAuth, monitors for new reviews in real time, and posts a personalized AI response the moment a review comes in — 24/7, without you ever needing to log in.</P>
      <P>The AI is trained specifically for review responses. It reads what the customer actually said, references specific details from their review, adapts its tone to your business type, and writes something that sounds like a real person wrote it — because the quality of the response matters as much as the speed.</P>
      <P>Setup takes under 5 minutes. Plans start at $29/month. There are no contracts and no onboarding calls required.</P>

      <H2>Who We Serve</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "1rem", margin: "1.5rem 0" }}>
        {[
          { icon: "🍽️", label: "Restaurants & cafes" },
          { icon: "💇", label: "Salons & spas" },
          { icon: "🦷", label: "Dental & medical offices" },
          { icon: "🔧", label: "Auto repair shops" },
          { icon: "🏋️", label: "Gyms & fitness studios" },
          { icon: "🏨", label: "Hotels & vacation rentals" },
          { icon: "⚖️", label: "Law firms & professionals" },
          { icon: "🏪", label: "Retail stores" },
          { icon: "📊", label: "Marketing agencies" },
          { icon: "🏠", label: "Real estate offices" },
        ].map(({ icon, label }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.2rem", border: "1.5px solid #ece8e0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.3rem" }}>{icon}</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f1f38" }}>{label}</span>
          </div>
        ))}
      </div>

      <H2>Our Mission</H2>
      <P>Small businesses power local economies. They employ neighbors, support communities, and create the character of the places where we live. They deserve the same tools that enterprise chains have — without the enterprise price tags or the enterprise complexity.</P>
      <P>Our mission is simple: help every business with a Google Business Profile respond to every review, every time, automatically — so they can focus on doing what they actually love.</P>

      <H2>The Team</H2>
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ece8e0", padding: "2rem", margin: "1.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#0f1f38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1.5rem", flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontWeight: 800, color: "#0f1f38", fontSize: "1.1rem" }}>Parker Smith</div>
            <div style={{ color: "#718096", fontSize: "0.88rem", marginBottom: "0.5rem" }}>Founder & CEO</div>
            <div style={{ color: "#4a5568", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Built ReplyRight to solve a problem he saw firsthand — small business owners drowning in review notifications with no practical way to keep up. parker@replyrightapp.com
            </div>
          </div>
        </div>
      </div>

      <H2>Contact Us</H2>
      <P>Questions about ReplyRight? Want to learn more before signing up? We respond to every email personally.</P>
      <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #ece8e0", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>📧 <a href="mailto:parker@replyrightapp.com" style={{ color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>parker@replyrightapp.com</a></div>
        <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>🌐 <a href="https://replyrightapp.com" style={{ color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>replyrightapp.com</a></div>
        <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>📍 Utah, United States</div>
      </div>

      <div style={{ margin: "3rem 0 1rem", padding: "2rem", background: "#f8f5ef", borderRadius: 14, border: "1.5px solid #ece8e0" }}>
        <div style={{ fontWeight: 700, color: "#0f1f38", marginBottom: "1rem", fontSize: "1rem" }}>Learn more about what we do</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { href: "/blog/how-to-automatically-respond-to-google-reviews", label: "How to automatically respond to Google reviews" },
            { href: "/blog/why-responding-to-google-reviews-matters", label: "Why responding to Google reviews matters" },
            { href: "/blog/best-google-review-management-software-2026", label: "Best Google review management software in 2026" },
            { href: "/for/restaurants", label: "ReplyRight for restaurants" },
            { href: "/for/agencies", label: "ReplyRight for agencies" },
          ].map(({ href, label }, i) => (
            <a key={i} href={href} style={{ color: "#22c55e", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>→ {label}</a>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
