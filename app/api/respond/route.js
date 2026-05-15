import jwt from "jsonwebtoken";
import supabase from "../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;
const cookieOpts = "HttpOnly; Path=/; SameSite=Lax; Secure; Domain=.replyrightapp.com";

async function refreshAccessToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  return res.json();
}

export async function POST(req) {
  let token = req.cookies.get("rr_token")?.value;
  let refresh = req.cookies.get("rr_refresh")?.value;

  // Fallback: use stored refresh token from Supabase via session cookie
  if (!token && !refresh) {
    const sessionToken = req.cookies.get("rr_session")?.value;
    if (sessionToken) {
      try {
        const decoded = jwt.verify(sessionToken, JWT_SECRET);
        const { data: user } = await supabase
          .from("users")
          .select("google_refresh_token")
          .eq("id", decoded.userId)
          .single();
        if (user?.google_refresh_token) {
          refresh = user.google_refresh_token;
        }
      } catch {}
    }
  }

  if (!token && !refresh) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Refresh access token if needed
  let newToken = null;
  if (!token && refresh) {
    const refreshed = await refreshAccessToken(refresh);
    if (refreshed.access_token) {
      token = refreshed.access_token;
      newToken = refreshed.access_token;
    } else {
      return Response.json({ error: "Session expired" }, { status: 401 });
    }
  }

  const { reviewName, comment } = await req.json();
  if (!reviewName || !comment?.trim()) {
    return Response.json({ error: "reviewName and comment are required" }, { status: 400 });
  }

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return Response.json(
      { error: err.error?.message || "Failed to post response" },
      { status: 500 }
    );
  }

  const response = Response.json({ success: true });
  if (newToken) {
    response.headers.set(
      "Set-Cookie",
      `rr_token=${newToken}; ${cookieOpts}; Max-Age=3600`
    );
  }
  return response;
}
