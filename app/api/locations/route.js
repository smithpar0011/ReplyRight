import jwt from "jsonwebtoken";
import supabase from "../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

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

export async function GET(req) {
  let token = req.cookies.get("rr_token")?.value;
  let refresh = req.cookies.get("rr_refresh")?.value;

  // Fallback: if no Google cookies, use stored refresh token from Supabase via session
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

  const authHeader = { Authorization: `Bearer ${token}` };

  // List accounts
  const accountsRes = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    { headers: authHeader }
  );
  const accountsData = await accountsRes.json();

  if (!accountsData.accounts?.length) {
    return Response.json({ locations: [] });
  }

  // List locations for each account
  const allLocations = [];
  for (const account of accountsData.accounts) {
    const locRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress`,
      { headers: authHeader }
    );
    const locData = await locRes.json();
    for (const loc of locData.locations || []) {
      const accountId = account.name.split("/")[1];
      const locationId = loc.name.split("/")[1];
      allLocations.push({
        id: `accounts/${accountId}/locations/${locationId}`,
        name: loc.title || loc.name,
        address: loc.storefrontAddress
          ? [loc.storefrontAddress.addressLines?.[0], loc.storefrontAddress.locality, loc.storefrontAddress.administrativeArea].filter(Boolean).join(", ")
          : "",
      });
    }
  }

  const response = Response.json({ locations: allLocations });
  if (newToken) {
    response.headers.set("Set-Cookie", `rr_token=${newToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`);
  }
  return response;
}
