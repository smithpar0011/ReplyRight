import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const sessionToken = req.cookies.get("rr_session")?.value;
  if (!sessionToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(sessionToken, JWT_SECRET);
  } catch {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json();
  const { locationId, locationName, locations } = body;
  if (!locationId) {
    return Response.json({ error: "locationId required" }, { status: 400 });
  }

  // Save primary location + all selected locations (as JSON array if multiple)
  const updatePayload = {
    google_location_id: locationId,
    google_location_name: locationName,
  };
  if (locations && locations.length > 1) {
    updatePayload.google_locations = JSON.stringify(locations);
  }

  // Persist plan selection from rr_signup cookie so progress can be resumed on next login
  const cookieHeader = req.headers.get("cookie") || "";
  const signupCookieMatch = cookieHeader.match(/rr_signup=([^;]+)/);
  if (signupCookieMatch) {
    try {
      const d = JSON.parse(decodeURIComponent(signupCookieMatch[1]));
      if (d.plan) {
        updatePayload.signup_plan = d.plan;
        updatePayload.signup_billing = d.billing || "monthly";
      }
    } catch {}
  }

  const { error } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("id", decoded.userId);

  if (error) {
    console.error("Failed to save location:", error);
    return Response.json({ error: "Failed to save location" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
