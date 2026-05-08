export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/success", "/reset-password"],
    },
    sitemap: "https://replyrightapp.com/sitemap.xml",
  };
}
