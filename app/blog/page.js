import ContentLayout from "../components/ContentLayout";

export const metadata = {
  title: "Blog — Google Review Management Tips & Guides",
  description: "Expert guides on automating Google review responses, managing your online reputation, and growing your business through customer reviews.",
  alternates: { canonical: "https://replyrightapp.com/blog" },
};

const posts = [
  {
    slug: "how-to-automatically-respond-to-google-reviews",
    badge: "Guide",
    title: "How to Automatically Respond to Google Reviews in 2026",
    excerpt: "A step-by-step guide to setting up automated Google review responses — without sounding like a robot.",
    readTime: 7,
    date: "April 2026",
  },
  {
    slug: "best-google-review-management-software-2026",
    badge: "Comparison",
    title: "Best Google Review Management Software in 2026",
    excerpt: "We compared every major tool so you don't have to. Here's what actually works for small businesses.",
    readTime: 9,
    date: "April 2026",
  },
  {
    slug: "why-responding-to-google-reviews-matters",
    badge: "Strategy",
    title: "Why Responding to Google Reviews Matters (And What Happens If You Don't)",
    excerpt: "The data is clear: businesses that respond to reviews get more customers. Here's exactly why and how.",
    readTime: 6,
    date: "March 2026",
  },
  {
    slug: "how-to-handle-negative-google-reviews",
    badge: "Guide",
    title: "How to Handle Negative Google Reviews Without Damaging Your Reputation",
    excerpt: "A 1-star review doesn't have to hurt your business. Here's how to respond in a way that actually wins customers back.",
    readTime: 8,
    date: "March 2026",
  },
  {
    slug: "google-reviews-seo-ranking",
    badge: "SEO",
    title: "Do Google Reviews Affect Your Search Ranking? (Yes — Here's How)",
    excerpt: "Google reviews are one of the most powerful — and most overlooked — local SEO signals. Here's the data.",
    readTime: 6,
    date: "February 2026",
  },
  {
    slug: "review-response-templates",
    badge: "Templates",
    title: "50 Google Review Response Templates (Copy-Paste Ready)",
    excerpt: "Free templates for every situation — 5-star, 1-star, no comment, and everything in between.",
    readTime: 5,
    date: "February 2026",
  },
];

export default function BlogIndex() {
  return (
    <ContentLayout
      badge="ReplyRight Blog"
      title="Google Review Management — Tips, Guides & Strategy"
      subtitle="Everything you need to know about responding to Google reviews, managing your reputation, and growing your business."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {posts.map(post => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              background: "#fff", borderRadius: 14, padding: "1.8rem",
              textDecoration: "none", display: "block",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1.5px solid #ece8e0",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{
              display: "inline-block", background: "rgba(34,197,94,0.1)",
              color: "#16a34a", borderRadius: 100, padding: "0.25rem 0.75rem",
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: "1rem",
            }}>{post.badge}</div>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700, color: "#0f1f38",
              lineHeight: 1.4, marginBottom: "0.75rem",
            }}>{post.title}</h2>
            <p style={{ fontSize: "0.88rem", color: "#4a5568", lineHeight: 1.6, marginBottom: "1rem" }}>
              {post.excerpt}
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#718096" }}>
              <span>📅 {post.date}</span>
              <span>⏱ {post.readTime} min read</span>
            </div>
          </a>
        ))}
      </div>
    </ContentLayout>
  );
}
