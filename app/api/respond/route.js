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
  let userId = null;

  // Always decode session to get userId (needed for plan/monthly limit checks)
  const sessionToken = req.cookies.get("rr_session")?.value;
  if (sessionToken) {
    try {
      const decoded = jwt.verify(sessionToken, JWT_SECRET);
      userId = decoded.userId;
    } catch {}
  }

  // Fallback: use stored refresh token from Supabase via session cookie
  if (!token && !refresh && userId) {
    const { data: u } = await supabase
      .from("users")
      .select("google_refresh_token")
      .eq("id", userId)
      .single();
    if (u?.google_refresh_token) refresh = u.google_refresh_token;
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

  // Enforce monthly limit for Starter plan
  const planCookie = req.cookies.get("rr_plan")?.value;
  let userForLimit = null;
  if (planCookie === "Starter" && userId) {
    const { data: u } = await supabase
      .from("users")
      .select("monthly_reply_count, monthly_reset_date")
      .eq("id", userId)
      .single();
    userForLimit = u;
    const today = new Date().toISOString().split("T")[0];
    if (u?.monthly_reset_date && u.monthly_reset_date <= today) {
      const next = new Date(); next.setMonth(next.getMonth() + 1, 1);
      await supabase.from("users").update({ monthly_reply_count: 0, monthly_reset_date: next.toISOString().split("T")[0] }).eq("id", userId);
      userForLimit = { ...u, monthly_reply_count: 0 };
    }
    if ((userForLimit?.monthly_reply_count || 0) >= 50) {
      return Response.json({ error: "Monthly reply limit reached (50/mo on Starter). Upgrade to Pro for unlimited replies.", limitReached: true }, { status: 403 });
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

  // Increment monthly count for Starter
  if (planCookie === "Starter" && userId) {
    const count = (userForLimit?.monthly_reply_count || 0) + 1;
    await supabase.from("users").update({ monthly_reply_count: count }).eq("id", userId);
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
