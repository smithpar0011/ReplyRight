export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const flow = searchParams.get("flow") || "";
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  // business.manage is only needed during signup/connect flow
  // Sign-in only needs email + profile (non-sensitive, no verification required)
  const scopes = flow === "signup"
    ? [
        "https://www.googleapis.com/auth/business.manage",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ]
    : [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ];
  // admin flow uses same minimal scopes as signin

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${baseUrl}/api/auth/callback`,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: flow,
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
