import Stripe from "stripe";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export async function GET(req) {
  if (!requireAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const charges = await stripe.charges.list({ limit, expand: ["data.customer"] });

  const payments = charges.data.map(c => ({
    id: c.id,
    amount: c.amount / 100,
    currency: c.currency.toUpperCase(),
    status: c.paid ? (c.refunded ? "refunded" : "paid") : "failed",
    email: c.billing_details?.email || c.customer?.email || "—",
    description: c.description || "—",
    created: c.created * 1000,
  }));

  return Response.json({ payments });
}
