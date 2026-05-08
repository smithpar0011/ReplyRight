import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state") || "";
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  if (error || !code) {
    const detail = encodeURIComponent(error || "no_code");
    return Response.redirect(`${baseUrl}/signin?error=1&detail=${detail}`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${baseUrl}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    console.error("Token exchange error:", JSON.stringify(tokens));
    const detail = encodeURIComponent(tokens.error_description || tokens.error || "unknown");
    return Response.redirect(`${baseUrl}/signin?error=1&detail=${detail}`);
  }

  // Fetch user profile info
  let userInfo = {};
  try {
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    userInfo = await profileRes.json();
  } catch (e) {
    console.error("Failed to fetch user profile:", e);
  }

  const isSignup = state === "signup";
  const headers = new Headers();
  const cookieOpts = "HttpOnly; Path=/; SameSite=Lax; Secure";

  // Store access token (1 hour)
  headers.append("Set-Cookie", `rr_token=${tokens.access_token}; ${cookieOpts}; Max-Age=3600`);

  // Store refresh token (30 days)
  if (tokens.refresh_token) {
    headers.append("Set-Cookie", `rr_refresh=${tokens.refresh_token}; ${cookieOpts}; Max-Age=2592000`);
  }

  // Store user info readable by client
  const userPayload = JSON.stringify({
    name: userInfo.name || "",
    email: userInfo.email || "",
    picture: userInfo.picture || "",
  });
  headers.append(
    "Set-Cookie",
    `rr_user=${encodeURIComponent(userPayload)}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`
  );

  if (isSignup) {
    // Update the user record in Supabase with Google data
    try {
      const cookieHeader = req.headers.get("cookie") || "";
      const sessionMatch = cookieHeader.match(/rr_session=([^;]+)/);
      if (sessionMatch) {
        const decoded = jwt.verify(sessionMatch[1], JWT_SECRET);
        await supabase
          .from("users")
          .update({
            google_email: userInfo.email || "",
            google_refresh_token: tokens.refresh_token || "",
          })
          .eq("id", decoded.userId);
      }
    } catch (e) {
      console.error("Failed to update user with Google data:", e);
    }
    headers.set("Location", `${baseUrl}/?signup=payment`);
  } else {
    // SIGN-IN flow: look up user by google_email or email
    let user = null;
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("google_email", userInfo.email)
        .single();
      user = data;
    } catch (e) {}

    // Fallback: look up by email field
    if (!user && userInfo.email) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", userInfo.email)
          .single();
        user = data;
      } catch (e) {}
    }

    if (!user) {
      // No account found — redirect to signin with message
      headers.set("Location", `${baseUrl}/signin?error=no_account`);
    } else {
      // Generate session token
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      headers.append(
        "Set-Cookie",
        `rr_session=${sessionToken}; ${cookieOpts}; Max-Age=2592000`
      );
      headers.set("Location", `${baseUrl}/dashboard`);
    }
  }

  return new Response(null, { status: 302, headers });
}
