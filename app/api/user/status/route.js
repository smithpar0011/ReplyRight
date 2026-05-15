import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const sessionToken = req.cookies.get("rr_session")?.value;
  if (!sessionToken) return Response.json({ error: "Not authenticated" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    userId = decoded.userId;
  } catch {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("plan, billing, monthly_reply_count, monthly_reset_date, backfill_done")
    .eq("id", userId)
    .single();
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  // Reset monthly count if past reset date
  let monthlyCount = user.monthly_reply_count || 0;
  let resetDate = user.monthly_reset_date;
  const today = new Date().toISOString().split("T")[0];

  if (resetDate && resetDate <= today) {
    monthlyCount = 0;
    const next = new Date();
    next.setMonth(next.getMonth() + 1, 1);
    resetDate = next.toISOString().split("T")[0];
    await supabase.from("users").update({ monthly_reply_count: 0, monthly_reset_date: resetDate }).eq("id", userId);
  }

  return Response.json({
    plan: user.plan || null,
    billing: user.billing || null,
    monthlyCount,
    monthlyLimit: user.plan === "Starter" ? 50 : null,
    monthlyReset: resetDate,
    backfillDone: user.backfill_done || false,
  });
}
