import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function requireAdmin() {
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

export async function GET() {
  if (!requireAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, plan, billing, created_at, stripe_customer_id, stripe_subscription_id")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ users: data });
}

export async function PATCH(req) {
  if (!requireAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, plan, billing } = await req.json();
  const { error } = await supabase
    .from("users")
    .update({ plan, billing })
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
