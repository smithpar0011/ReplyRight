export default function sitemap() {
  const baseUrl = "https://replyrightapp.com";
  const now = new Date();

  return [
    // Core pages
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/signin`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Blog index
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Blog articles
    { url: `${baseUrl}/blog/how-to-automatically-respond-to-google-reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/best-google-review-management-software-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/why-responding-to-google-reviews-matters`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/how-to-handle-negative-google-reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/google-reviews-seo-ranking`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/review-response-templates`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Comparison pages
    { url: `${baseUrl}/compare/replyright-vs-chatgpt`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },

    // Industry pages
    { url: `${baseUrl}/for/restaurants`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/for/agencies`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/for/salons`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/dental`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
