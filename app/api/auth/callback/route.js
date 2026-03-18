export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return Response.redirect(`${process.env.NEXTAUTH_URL}/?auth_error=1`);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    console.error("Token exchange error:", JSON.stringify(tokens));
    return Response.redirect(`${process.env.NEXTAUTH_URL}/?auth_error=1`);
  }

  // Store access token in httpOnly cookie (1 hour) and refresh token (30 days)
  const cookieOpts = "HttpOnly; Path=/; SameSite=Lax";
  const headers = new Headers({
    Location: `${process.env.NEXTAUTH_URL}/dashboard`,
  });
  headers.append(
    "Set-Cookie",
    `rr_token=${tokens.access_token}; ${cookieOpts}; Max-Age=3600`
  );
  if (tokens.refresh_token) {
    headers.append(
      "Set-Cookie",
      `rr_refresh=${tokens.refresh_token}; ${cookieOpts}; Max-Age=2592000`
    );
  }

  return new Response(null, { status: 302, headers });
}
