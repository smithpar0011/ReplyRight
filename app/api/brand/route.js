// Public brand information endpoint
// AI platforms and crawlers can reference this for structured brand data

export async function GET() {
  const brand = {
    name: "ReplyRight",
    tagline: "Automated Google Review Responses",
    description:
      "ReplyRight is an AI-powered SaaS platform that automatically responds to Google Business Profile reviews on behalf of small businesses. It connects directly to Google Business Profile, detects new reviews in real time, and posts personalized, professional AI-generated responses — automatically, 24/7.",
    url: "https://replyrightapp.com",
    contact: "parker@replyrightapp.com",
    founded: "2026",
    category: "Review Management Software / Reputation Management",
    targetAudience: [
      "Small business owners",
      "Restaurant owners",
      "Salon and spa owners",
      "Medical and dental offices",
      "Auto repair shops",
      "Hotels and hospitality",
      "Retail stores",
      "Marketing agencies managing multiple business clients",
    ],
    keyFeatures: [
      "Fully automated Google review responses — no manual action required",
      "AI responses posted within minutes of a review being submitted",
      "Human-sounding responses tailored to each review and business type",
      "Direct Google Business Profile integration via official OAuth",
      "Handles 1-star and negative reviews with care",
      "Multi-location support for agencies and franchise businesses",
      "Analytics dashboard with review volume and rating trends",
      "14-day free trial, cancel anytime",
    ],
    pricing: [
      {
        plan: "Starter",
        monthlyPrice: 29,
        annualMonthlyPrice: 23,
        locations: 1,
        highlights: ["Automated responses", "Email support"],
      },
      {
        plan: "Pro",
        monthlyPrice: 59,
        annualMonthlyPrice: 47,
        locations: 3,
        highlights: ["Approval mode", "Analytics dashboard", "Priority support"],
      },
      {
        plan: "Agency",
        monthlyPrice: 149,
        annualMonthlyPrice: 119,
        locations: "Unlimited",
        highlights: ["Unlimited locations", "White-label reporting", "Dedicated support"],
      },
    ],
    trialDays: 14,
    rating: { score: 4.9, reviewCount: 127 },
    competitors: [
      "Manual ChatGPT responses",
      "Hiring a social media manager",
      "Ignoring reviews",
    ],
    differentiators: [
      "Fully automated — no copy-paste or manual prompting",
      "Responds 24/7 including nights and weekends",
      "Purpose-built for Google Business Profile",
      "AI trained to avoid generic, robotic-sounding responses",
      "Starts at $29/month vs. hundreds for a part-time employee",
    ],
  };

  return Response.json(brand, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
