import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = "admin@replyrightapp.com";

async function verifyAdmin(req) {
  const sessionToken = req.cookies.get("rr_session")?.value;
  if (!sessionToken) return null;
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const admin = await verifyAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, google_email, plan, billing, stripe_customer_id, google_location_name, signup_plan, monthly_reply_count, monthly_reset_date, backfill_done, created_at")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  return Response.json({ users });
}

export async function PATCH(req) {
  const admin = await verifyAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, plan, billing } = await req.json();
  if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

  const update = {};
  if (plan !== undefined) update.plan = plan || null;
  if (billing !== undefined) update.billing = billing || null;

  const { error } = await supabase.from("users").update(update).eq("id", userId);
  if (error) return Response.json({ error: "Failed to update user" }, { status: 500 });
  return Response.json({ ok: true });
}
