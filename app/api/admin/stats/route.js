import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function requireAdmin(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("rr_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== "admin@replyrightapp.com") return null;
    return decoded;
  } catch {
    return null;
  }
}

function startOf(unit) {
  const now = new Date();
  if (unit === "day") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (unit === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (unit === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (unit === "year") return new Date(now.getFullYear(), 0, 1);
  return new Date(0); // all time
}

export async function GET(req) {
  if (!requireAdmin(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all Stripe charges (paid)
    const charges = await stripe.charges.list({ limit: 100, expand: ["data.customer"] });
    const paid = charges.data.filter(c => c.paid && !c.refunded);

    const sumFrom = (from) =>
      paid
        .filter(c => c.created * 1000 >= from.getTime())
        .reduce((acc, c) => acc + c.amount, 0) / 100;

    const revenue = {
      today: sumFrom(startOf("day")),
      week: sumFrom(startOf("week")),
      month: sumFrom(startOf("month")),
      year: sumFrom(startOf("year")),
      allTime: paid.reduce((acc, c) => acc + c.amount, 0) / 100,
    };

    // User counts from Supabase
    const { data: users } = await supabase.from("users").select("id, plan, created_at");
    const userCounts = {
      total: users?.length || 0,
      starter: users?.filter(u => u.plan === "Starter").length || 0,
      pro: users?.filter(u => u.plan === "Pro").length || 0,
      agency: users?.filter(u => u.plan === "Agency").length || 0,
      newToday: users?.filter(u => new Date(u.created_at) >= startOf("day")).length || 0,
      newWeek: users?.filter(u => new Date(u.created_at) >= startOf("week")).length || 0,
      newMonth: users?.filter(u => new Date(u.created_at) >= startOf("month")).length || 0,
    };

    // Subscriptions
    const subs = await stripe.subscriptions.list({ limit: 100, status: "all" });
    const subCounts = {
      active: subs.data.filter(s => s.status === "active").length,
      trialing: subs.data.filter(s => s.status === "trialing").length,
      canceled: subs.data.filter(s => s.status === "canceled").length,
      pastDue: subs.data.filter(s => s.status === "past_due").length,
    };

    return Response.json({ revenue, userCounts, subCounts });
  } catch (err) {
    console.error("Admin stats error:", err);
    return Response.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
